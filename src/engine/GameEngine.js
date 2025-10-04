import { PHYSICS, SPAWN, SCORING, SPAWN_PROBABILITIES, WEAPONS, DIFFICULTY_STAGES, ENEMIES } from '../constants/GameConfig';

class GameEngine {
  constructor() {
    this.reset();
  }

  reset() {
    this.score = 0;
    this.distance = 0;
    this.coins = 0;
    this.combo = 0;
    this.comboTimer = 0;
    this.spawnTimer = 0;
    this.difficultyTimer = 0;
    this.difficultyMultiplier = 1.0;
    this.spawnInterval = SPAWN.INITIAL_INTERVAL;
    this.playerVelocityY = 0;
    this.tapCooldown = 0;
    this.timeSinceLastTap = 0;
    this.gameTime = 0;
    this.currentStage = 0;
    this.stageName = 'Easy Space';
    this.ammo = WEAPONS.INITIAL_AMMO;
    this.fireCooldown = 0;
    this.projectiles = [];
    this.nextProjectileId = 0;
    this.bossActive = false;
    this.boss = null;
    this.powerups = {
      shield: { active: false, durability: 0 },
      slowTime: { active: false, timer: 0 },
      magnet: { active: false, timer: 0 },
      double: { active: false, timer: 0 },
    };
    this.entities = [];
    this.nextEntityId = 0;
    this.isGameOver = false;
  }

  // Update game state
  update(deltaTime, screenHeight, screenWidth = 400) {
    if (this.isGameOver) return;

    this.gameTime += deltaTime;

    // Update tap timers
    this.tapCooldown = Math.max(0, this.tapCooldown - deltaTime);
    this.timeSinceLastTap += deltaTime;
    
    // Update fire cooldown
    this.fireCooldown = Math.max(0, this.fireCooldown - deltaTime);

    // Reset combo if window expired
    if (this.timeSinceLastTap > PHYSICS.COMBO_WINDOW) {
      this.combo = 0;
    }
    
    // Check for stage progression
    this.updateStage();

    // Update power-ups
    this.updatePowerups(deltaTime);

    // Apply time scale if slow-time is active
    const timeScale = this.powerups.slowTime.active ? this.powerups.slowTime.timeScale : 1.0;
    const scaledDelta = deltaTime * timeScale;

    // Update player physics
    this.updatePlayerPhysics(deltaTime, screenHeight);

    // Update spawn timer and difficulty
    this.updateSpawning(scaledDelta, screenHeight, screenWidth);

    // Update difficulty
    this.updateDifficulty(deltaTime);

    // Update entities
    this.updateEntities(scaledDelta);
    
    // Update projectiles
    this.updateProjectiles(deltaTime);
    
    // Check projectile hits
    this.checkProjectileHits();

    // Update score
    this.updateScore(deltaTime);
  }

  updatePlayerPhysics(deltaTime, screenHeight) {
    // Apply gravity
    this.playerVelocityY += PHYSICS.GRAVITY * deltaTime;

    // Clamp velocity
    if (this.playerVelocityY > PHYSICS.MAX_FALL_SPEED) {
      this.playerVelocityY = PHYSICS.MAX_FALL_SPEED;
    }
  }

  updatePowerups(deltaTime) {
    // Update slow time
    if (this.powerups.slowTime.active) {
      this.powerups.slowTime.timer -= deltaTime;
      if (this.powerups.slowTime.timer <= 0) {
        this.powerups.slowTime.active = false;
      }
    }

    // Update magnet
    if (this.powerups.magnet.active) {
      this.powerups.magnet.timer -= deltaTime;
      if (this.powerups.magnet.timer <= 0) {
        this.powerups.magnet.active = false;
      }
    }

    // Update double points
    if (this.powerups.double.active) {
      this.powerups.double.timer -= deltaTime;
      if (this.powerups.double.timer <= 0) {
        this.powerups.double.active = false;
      }
    }
  }

  updateSpawning(deltaTime, screenHeight, screenWidth = 400) {
    this.spawnTimer += deltaTime;

    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0;
      this.spawnEntity(screenHeight, screenWidth);
    }
  }

  updateDifficulty(deltaTime) {
    this.difficultyTimer += deltaTime;

    // Increase difficulty every 15 seconds
    if (this.difficultyTimer >= SPAWN.DIFFICULTY_INCREASE_INTERVAL) {
      this.difficultyTimer = 0;
      this.difficultyMultiplier += SPAWN.DIFFICULTY_MULTIPLIER_INCREASE;
    }

    // Decrease spawn interval every 10 seconds
    if (Math.floor(this.gameTime) % 10 === 0 && Math.floor(this.gameTime) > 0) {
      this.spawnInterval *= SPAWN.INTERVAL_DECREASE_RATE;
    }
  }

  updateEntities(deltaTime) {
    // Update and filter dead entities
    this.entities = this.entities.filter(entity => {
      // Move entity
      entity.x -= entity.speed * deltaTime;

      // Handle specific entity behavior
      if (entity.type === 'enemyDrone') {
        // Oscillation movement
        entity.phase = entity.phase || 0;
        entity.phase += deltaTime * 2;
        entity.oscillationOffset = Math.sin(entity.phase) * 30;
      }

      // Remove if off screen
      return entity.x > -100;
    });
  }

  updateScore(deltaTime) {
    // Survival points
    this.score += SCORING.SURVIVAL_PER_SECOND * deltaTime * this.difficultyMultiplier;

    // Distance
    this.distance += SPAWN.BASE_SPEED * deltaTime * 0.01; // Convert to meters
  }
  
  updateStage() {
    const stages = DIFFICULTY_STAGES.STAGES;
    let newStage = 0;
    
    for (let i = stages.length - 1; i >= 0; i--) {
      if (this.score >= stages[i].score) {
        newStage = i;
        break;
      }
    }
    
    if (newStage !== this.currentStage) {
      this.currentStage = newStage;
      this.stageName = stages[newStage].name;
      
      // Spawn boss if stage has one
      if (stages[newStage].boss && !this.bossActive) {
        this.spawnBoss(stages[newStage].boss);
      }
      
      console.log(`Stage changed to: ${this.stageName}`);
    }
  }
  
  spawnBoss(bossType) {
    const { BOSSES } = require('../data/Bosses');
    const bossData = BOSSES[bossType];
    
    if (!bossData) {
      console.log(`Boss type ${bossType} not found`);
      return;
    }
    
    this.bossActive = true;
    this.boss = {
      id: 'boss_' + Date.now(),
      type: 'boss',
      name: bossData.name,
      x: 400, // Start off-screen right
      y: 300, // Middle of screen
      size: bossData.size,
      health: bossData.health,
      maxHealth: bossData.health,
      speed: 100, // Slower than regular enemies
      phase: 0,
    };
    
    console.log(`Boss spawned: ${bossData.name} with ${bossData.health} HP`);
  }
  
  updateProjectiles(deltaTime) {
    this.projectiles = this.projectiles.filter(proj => {
      proj.x += proj.speed * deltaTime;
      return proj.x < 800; // Remove off-screen projectiles
    });
    
    // Update boss if active
    if (this.boss && this.bossActive) {
      // Simple movement pattern
      this.boss.phase += deltaTime;
      this.boss.y = 300 + Math.sin(this.boss.phase * 0.5) * 100;
      
      // Move towards left slowly
      if (this.boss.x > 300) {
        this.boss.x -= this.boss.speed * deltaTime;
      }
    }
  }
  
  checkProjectileHits() {
    const hitEntities = [];
    
    this.projectiles.forEach(proj => {
      // Check boss hits
      if (this.boss && this.bossActive) {
        const dx = proj.x - this.boss.x;
        const dy = proj.y - this.boss.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = (proj.size + this.boss.size) / 2;
        
        if (distance < minDistance) {
          this.boss.health -= proj.damage || 1;
          proj.hit = true;
          
          if (this.boss.health <= 0) {
            // Boss defeated!
            this.score += 500 * this.difficultyMultiplier;
            this.coins += 50;
            this.bossActive = false;
            this.boss = null;
            console.log('Boss defeated!');
          }
        }
      }
      
      // Check regular enemy hits
      this.entities.forEach(entity => {
        // Skip collectibles
        if (entity.type === 'star' || entity.type === 'ammo') return;
        
        const dx = proj.x - entity.x;
        const dy = proj.y - (entity.y + (entity.oscillationOffset || 0));
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = (proj.size + entity.size) / 2;
        
        if (distance < minDistance) {
          entity.health = (entity.health || 1) - 1;
          proj.hit = true;
          
          if (entity.health <= 0) {
            hitEntities.push(entity.id);
            // Award points for destroying enemy
            this.score += 25 * this.difficultyMultiplier;
            this.coins += 2;
          }
        }
      });
    });
    
    // Remove hit projectiles and destroyed entities
    this.projectiles = this.projectiles.filter(p => !p.hit);
    this.entities = this.entities.filter(e => !hitEntities.includes(e.id));
  }

  spawnEntity(screenHeight, screenWidth = 400) {
    const rand = Math.random();
    const maxY = screenHeight - PHYSICS.MAX_Y_OFFSET;
    const minY = PHYSICS.MIN_Y;
    const y = minY + Math.random() * (maxY - minY);

    let entity = {
      id: this.nextEntityId++,
      x: screenWidth + 64, // Spawn off-screen to the right
      y: y,
      speed: SPAWN.BASE_SPEED * this.difficultyMultiplier,
    };

    // Determine entity type based on probabilities
    if (rand < SPAWN_PROBABILITIES.STAR) {
      entity.type = 'star';
      entity.size = 20;
      entity.points = SCORING.STAR_PICKUP;
    } else if (rand < SPAWN_PROBABILITIES.STAR + SPAWN_PROBABILITIES.ASTEROID_SMALL) {
      entity.type = 'asteroidSmall';
      entity.size = 32;
      entity.speed *= 1.0;
    } else if (rand < SPAWN_PROBABILITIES.STAR + SPAWN_PROBABILITIES.ASTEROID_SMALL + SPAWN_PROBABILITIES.ASTEROID_MED) {
      entity.type = 'asteroidMed';
      entity.size = 48;
      entity.speed *= 0.75;
      entity.health = ENEMIES.ASTEROID_MED.health;
    } else if (rand < 0.90) {
      entity.type = 'asteroidBig';
      entity.size = 64;
      entity.speed *= 0.5;
      entity.health = ENEMIES.ASTEROID_BIG.health;
    } else if (rand < 0.95) {
      entity.type = 'enemyDrone';
      entity.size = 40;
      entity.speed *= 0.85;
      entity.phase = Math.random() * Math.PI * 2;
      entity.health = ENEMIES.ENEMY_DRONE.health;
    } else {
      entity.type = 'ammo';
      entity.size = 24;
      entity.points = 10; // 10 ammo
    }

    this.entities.push(entity);
  }

  // Handle tap input
  handleTap() {
    if (this.tapCooldown > 0) return;

    this.tapCooldown = PHYSICS.TAP_COOLDOWN;
    this.playerVelocityY = PHYSICS.JUMP_IMPULSE;

    // Combo handling
    if (this.timeSinceLastTap <= PHYSICS.COMBO_WINDOW) {
      this.combo += 1;
    } else {
      this.combo = 1;
    }
    this.timeSinceLastTap = 0;

    return true; // Tap successful
  }

  // Check collision
  checkCollision(playerX, playerY, playerSize) {
    const collisions = [];

    this.entities.forEach(entity => {
      const dx = playerX - entity.x;
      const dy = playerY - (entity.y + (entity.oscillationOffset || 0));
      const distance = Math.sqrt(dx * dx + dy * dy);
      const minDistance = (playerSize + entity.size) / 2;

      if (distance < minDistance) {
        collisions.push(entity);
      }
    });

    return collisions;
  }

  // Handle collision
  handleCollision(entity) {
    // Remove entity
    this.entities = this.entities.filter(e => e.id !== entity.id);

    if (entity.type === 'star') {
      // Collect star
      const basePoints = entity.points;
      const comboMultiplier = 1 + (this.combo * SCORING.COMBO_MULTIPLIER);
      const doubleMultiplier = this.powerups.double.active ? 2 : 1;
      
      this.score += basePoints * comboMultiplier * doubleMultiplier;
      
      const baseCoins = SCORING.COIN_PER_STAR;
      const comboCoins = Math.floor(this.combo / SCORING.COMBO_COIN_DIVISOR);
      this.coins += baseCoins + comboCoins;

      return { type: 'collect', fatal: false };
    } else if (entity.type === 'ammo') {
      // Collect ammo
      this.ammo += entity.points || 10;
      return { type: 'collect', fatal: false };
    } else {
      // Hit obstacle
      if (this.powerups.shield.active) {
        this.powerups.shield.durability -= 1;
        if (this.powerups.shield.durability <= 0) {
          this.powerups.shield.active = false;
        }
        return { type: 'shielded', fatal: false };
      } else {
        this.isGameOver = true;
        return { type: 'fatal', fatal: true };
      }
    }
  }
  
  // Fire weapon
  handleFire(playerX, playerY) {
    if (this.fireCooldown > 0 || this.ammo <= 0) {
      return false;
    }
    
    this.fireCooldown = WEAPONS.FIRE_COOLDOWN;
    this.ammo -= 1;
    
    const projectile = {
      id: this.nextProjectileId++,
      x: playerX + 30,
      y: playerY,
      speed: WEAPONS.PROJECTILE_SPEED,
      size: WEAPONS.PROJECTILE_SIZE,
      damage: 1,
    };
    
    this.projectiles.push(projectile);
    return true;
  }

  // Activate power-up
  activatePowerup(type) {
    switch (type) {
      case 'shield':
        this.powerups.shield.active = true;
        this.powerups.shield.durability = 2;
        break;
      case 'slowTime':
        this.powerups.slowTime.active = true;
        this.powerups.slowTime.timer = 5;
        this.powerups.slowTime.timeScale = 0.7;
        break;
      case 'magnet':
        this.powerups.magnet.active = true;
        this.powerups.magnet.timer = 6;
        break;
      case 'double':
        this.powerups.double.active = true;
        this.powerups.double.timer = 8;
        break;
    }
  }

  // Get game state
  getState() {
    return {
      score: Math.floor(this.score),
      distance: Math.floor(this.distance),
      coins: this.coins,
      combo: this.combo,
      playerVelocityY: this.playerVelocityY,
      entities: this.entities,
      projectiles: this.projectiles,
      powerups: this.powerups,
      isGameOver: this.isGameOver,
      difficultyMultiplier: this.difficultyMultiplier,
      ammo: this.ammo,
      currentStage: this.currentStage,
      stageName: this.stageName,
      bossActive: this.bossActive,
      boss: this.boss,
    };
  }
}

export default GameEngine;

