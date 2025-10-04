import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Animated,
  Text,
  SafeAreaView,
  Easing,
  Platform,
} from 'react-native';
import { PHYSICS, PLAYER, COLORS, WEB_CONFIG } from '../constants/GameConfig';
import GameEngine from '../engine/GameEngine';
import PlayerShip from '../components/PlayerShip';
import Entity from '../components/Entity';
import Boss from '../components/Boss';
import HUD from '../components/HUD';
import SoundManager from '../utils/SoundManager';
import HapticManager from '../utils/HapticManager';
import PlayerData from '../utils/PlayerData';
import { SHIPS } from '../data/Ships';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Web için responsive boyutlar
const isWeb = Platform.OS === 'web';

const GameScreen = ({ onGameOver }) => {
  const [gameState, setGameState] = useState({
    score: 0,
    coins: 0,
    combo: 0,
    entities: [],
    powerups: {
      shield: { active: false, durability: 0 },
      slowTime: { active: false, timer: 0 },
      magnet: { active: false, timer: 0 },
      double: { active: false, timer: 0 },
    },
    isGameOver: false,
  });
  
  const [playerY, setPlayerY] = useState(SCREEN_HEIGHT / 2);
  const [isThrusting, setIsThrusting] = useState(false);
  const [bestScore, setBestScore] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isDead, setIsDead] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [fireButton, setFireButton] = useState({ x: SCREEN_WIDTH - 80, y: SCREEN_HEIGHT - 100 });
  const [leftFireButton, setLeftFireButton] = useState({ x: 20, y: SCREEN_HEIGHT - 100 });
  
  // Refs
  const gameEngine = useRef(null);
  const animationFrameId = useRef(null);
  const lastTime = useRef(Date.now());
  const playerYRef = useRef(SCREEN_HEIGHT / 2);
  const isMounted = useRef(true);
  
  // Animations
  const backgroundOffset1 = useRef(new Animated.Value(0)).current;
  const backgroundOffset2 = useRef(new Animated.Value(0)).current;
  const backgroundOffset3 = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const deathAnim = useRef(new Animated.Value(1)).current;
  const deathRotation = useRef(new Animated.Value(0)).current;
  const deathScale = useRef(new Animated.Value(1)).current;
  const readyAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    console.log('GameScreen: Component mounted');
    initGame();
    
    // Web için keyboard controls
    if (isWeb) {
      const handleKeyDown = (e) => {
        if (e.code === 'ArrowUp') {
          e.preventDefault();
          handleTap(); // Uçuş
        }
        if (e.code === 'Space') {
          e.preventDefault();
          handleFire(); // Ateş et
        }
        if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
          e.preventDefault();
          handleLeftFire(); // Sol ateş
        }
      };
      
      window.addEventListener('keydown', handleKeyDown);
      
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        console.log('GameScreen: Component unmounting');
        isMounted.current = false;
        cleanup();
      };
    }
    
    return () => {
      console.log('GameScreen: Component unmounting');
      isMounted.current = false;
      cleanup();
    };
  }, []);

  const initGame = async () => {
    try {
      console.log('GameScreen: Initializing game...');
      
      // Create game engine instance
      gameEngine.current = new GameEngine();
      gameEngine.current.reset();
      console.log('GameScreen: Game engine created');
      
      // Load player data
      const playerData = await PlayerData.load();
      const currentShip = SHIPS[playerData.currentShip.toUpperCase()] || SHIPS.STARTER;
      
      // Apply ship stats
      if (currentShip.stats) {
        // Modify physics based on ship
        // This would affect game engine calculations
      }
      
      // Load best score
      setBestScore(playerData.bestScore);
      console.log('GameScreen: Best score loaded:', playerData.bestScore);
      
      // Reset player position
      playerYRef.current = SCREEN_HEIGHT / 2;
      setPlayerY(SCREEN_HEIGHT / 2);
      
      // Start background animations
      console.log('GameScreen: Starting background animations...');
      startBackgroundAnimation();
      
      // Countdown: 3-2-1-GO
      console.log('GameScreen: Starting countdown...');
      
      const startCountdown = (count) => {
        if (count > 0) {
          setCountdown(count);
          
          Animated.sequence([
            Animated.timing(readyAnim, {
              toValue: 1,
              duration: 300,
              easing: Easing.out(Easing.back(1.5)),
              useNativeDriver: true,
            }),
            Animated.timing(readyAnim, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start(() => {
            if (isMounted.current) {
              setTimeout(() => startCountdown(count - 1), 100);
            }
          });
        } else {
          // Show "GO!" and start game
          setCountdown(0);
          Animated.sequence([
            Animated.timing(readyAnim, {
              toValue: 1.2,
              duration: 300,
              easing: Easing.out(Easing.back(1.5)),
              useNativeDriver: true,
            }),
            Animated.timing(readyAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start(() => {
            if (isMounted.current) {
              setIsReady(true);
              startGameLoop();
              console.log('GameScreen: Game started!');
            }
          });
        }
      };
      
      setTimeout(() => startCountdown(3), 500);
    } catch (error) {
      console.error('GameScreen: Initialization error:', error);
    }
  };

  const startGameLoop = () => {
    lastTime.current = Date.now();
    
    const loop = () => {
      if (!isMounted.current || !gameEngine.current || isDead) {
        return;
      }

      const currentTime = Date.now();
      const deltaTime = Math.min((currentTime - lastTime.current) / 1000, 0.1);
      lastTime.current = currentTime;

      try {
        // Update game engine
        gameEngine.current.update(deltaTime, SCREEN_HEIGHT, SCREEN_WIDTH);
        const state = gameEngine.current.getState();

        // Update player position with better clamping
        playerYRef.current = playerYRef.current + state.playerVelocityY * deltaTime;
        
        // Strict bounds checking - die if out of bounds
        const minY = PHYSICS.MIN_Y;
        const maxY = SCREEN_HEIGHT - PHYSICS.MAX_Y_OFFSET;
        
        if (playerYRef.current < minY || playerYRef.current > maxY) {
          // Player went out of bounds - game over
          gameEngine.current.isGameOver = true;
          handleGameEnd();
          return;
        }

        if (isMounted.current) {
          setPlayerY(playerYRef.current);
          setGameState(state);
        }

        // Check collisions
        const collisions = gameEngine.current.checkCollision(
          PLAYER.START_X,
          playerYRef.current,
          PLAYER.SIZE
        );

        collisions.forEach((entity) => {
          const result = gameEngine.current.handleCollision(entity);
          
          if (result.type === 'collect') {
            SoundManager.playCollect();
            HapticManager.tap();
            playCollectAnimation(entity.x, entity.y);
          } else if (result.fatal) {
            handleGameEnd();
            return;
          } else if (result.type === 'shielded') {
            SoundManager.playExplosion('small');
            HapticManager.collision();
            triggerShake();
          }
        });

        // Check if game over
        if (state.isGameOver) {
          handleGameEnd();
          return;
        }

        animationFrameId.current = requestAnimationFrame(loop);
      } catch (error) {
        console.error('GameScreen: Game loop error:', error);
      }
    };

    animationFrameId.current = requestAnimationFrame(loop);
  };

  const startBackgroundAnimation = () => {
    // Multiple parallax layers for depth
    Animated.loop(
      Animated.timing(backgroundOffset1, {
        toValue: -SCREEN_WIDTH * 2,
        duration: 30000,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();

    Animated.loop(
      Animated.timing(backgroundOffset2, {
        toValue: -SCREEN_WIDTH * 2,
        duration: 15000,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();

    Animated.loop(
      Animated.timing(backgroundOffset3, {
        toValue: -SCREEN_WIDTH * 2,
        duration: 8000,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();
  };

  const handleTap = useCallback(() => {
    if (!gameEngine.current || !isReady || isDead) return;
    
    const success = gameEngine.current.handleTap();
    if (success) {
      setIsThrusting(true);
      SoundManager.playThrust();
      HapticManager.tap();
      
      setTimeout(() => {
        if (isMounted.current) {
          setIsThrusting(false);
        }
      }, 100);
    }
  }, [isReady, isDead]);


  // Web için mouse events
  const handleMouseDown = useCallback(() => {
    handleTap(); // Sol tık = uçuş
  }, [handleTap]);

  const handleMouseUp = useCallback(() => {
    setIsThrusting(false);
  }, []);
  
  const handleFire = useCallback(() => {
    console.log('Space pressed - handleFire called');
    if (!gameEngine.current || isDead) {
      console.log('Fire blocked - gameEngine:', !!gameEngine.current, 'isDead:', isDead);
      return;
    }
    
    const success = gameEngine.current.handleFire(PLAYER.START_X, playerYRef.current);
    console.log('Fire success:', success);
    if (success) {
      SoundManager.playShoot();
      HapticManager.tap();
    }
  }, [isDead]);

  const handleLeftFire = useCallback(() => {
    if (!gameEngine.current || isDead) return;
    
    // Sol taraftan ateş etmek için farklı pozisyon
    const leftFireX = PLAYER.START_X - 30; // Sol tarafa kaydır
    const success = gameEngine.current.handleFire(leftFireX, playerYRef.current);
    if (success) {
      SoundManager.playShoot();
      HapticManager.tap();
    }
  }, [isDead]);

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const playCollectAnimation = (x, y) => {
    // Placeholder for particle effect
  };

  const playDeathAnimation = () => {
    setIsDead(true);
    
    // Epic death animation
    Animated.parallel([
      Animated.timing(deathAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(deathRotation, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(deathScale, {
        toValue: 0.3,
        duration: 800,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleGameEnd = async () => {
    if (!gameEngine.current || isDead) return;
    
    console.log('GameScreen: Game ending...');
    
    // Stop game loop
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }

    // Play death animation
    playDeathAnimation();
    SoundManager.playGameOver();
    HapticManager.collision();

    // Save data
    const finalState = gameEngine.current.getState();
    
    try {
      await PlayerData.onGameComplete({
        score: finalState.score,
        coins: finalState.coins,
        combo: finalState.combo,
        distance: finalState.distance,
        bossDefeated: false,
      });

      console.log('GameScreen: Data saved');

      const playerData = await PlayerData.load();
      const isNewRecord = finalState.score === playerData.bestScore && finalState.score > 0;

      // Wait for death animation
      setTimeout(() => {
        if (isMounted.current && onGameOver) {
          onGameOver({
            score: finalState.score,
            coins: finalState.coins,
            isNewRecord,
          });
        }
      }, 1000);
    } catch (error) {
      console.error('GameScreen: Game end error:', error);
    }
  };

  const cleanup = () => {
    console.log('GameScreen: Cleaning up...');
    
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    
    backgroundOffset1.stopAnimation();
    backgroundOffset2.stopAnimation();
    backgroundOffset3.stopAnimation();
  };

  // Show countdown screen
  if (!isReady) {
    const scale = readyAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.5, 1.2],
    });

    const opacity = readyAnim;

    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Animated.View style={[styles.countdownContainer, { transform: [{ scale }], opacity }]}>
          {countdown > 0 ? (
            <>
              <Text style={styles.countdownText}>{countdown}</Text>
              <Text style={styles.readySubtext}>Get Ready!</Text>
            </>
          ) : (
            <>
              <Text style={[styles.countdownText, { color: COLORS.SECONDARY }]}>GO!</Text>
              <Text style={styles.readySubtext}>Tap to thrust!</Text>
            </>
          )}
        </Animated.View>
      </SafeAreaView>
    );
  }

  const rotation = deathRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '720deg'],
  });

  return (
    <TouchableWithoutFeedback 
      onPress={handleTap}
      onMouseDown={isWeb ? handleMouseDown : undefined}
      onMouseUp={isWeb ? handleMouseUp : undefined}
    >
      <SafeAreaView style={styles.container}>
        <Animated.View
          style={[
            styles.gameContainer,
            {
              transform: [{ translateX: shakeAnim }],
            },
          ]}
        >
          {/* Background Layer 1 (Farthest - Nebula) */}
          <Animated.View
            style={[
              styles.backgroundLayer,
              styles.nebula,
              {
                transform: [{ translateX: backgroundOffset1 }],
              },
            ]}
          />

          {/* Background Layer 2 (Far stars) */}
          <Animated.View
            style={[
              styles.backgroundLayer,
              {
                transform: [{ translateX: backgroundOffset2 }],
                opacity: 0.4,
              },
            ]}
          >
            {[...Array(30)].map((_, i) => (
              <View
                key={`star-far-${i}`}
                style={[
                  styles.star,
                  {
                    left: (i * 70 + 100) % (SCREEN_WIDTH * 2),
                    top: (i * 47) % SCREEN_HEIGHT,
                    width: 2,
                    height: 2,
                    opacity: 0.6,
                  },
                ]}
              />
            ))}
          </Animated.View>

          {/* Background Layer 3 (Near stars) */}
          <Animated.View
            style={[
              styles.backgroundLayer,
              {
                transform: [{ translateX: backgroundOffset3 }],
                opacity: 0.8,
              },
            ]}
          >
            {[...Array(20)].map((_, i) => (
              <View
                key={`star-near-${i}`}
                style={[
                  styles.star,
                  {
                    left: (i * 100 + 50) % (SCREEN_WIDTH * 2),
                    top: (i * 67) % SCREEN_HEIGHT,
                    width: 3,
                    height: 3,
                  },
                ]}
              />
            ))}
          </Animated.View>

          {/* Entities */}
          {gameState.entities && gameState.entities.map((entity) => (
            <Entity key={entity.id} entity={entity} />
          ))}
          
          {/* Projectiles */}
          {gameState.projectiles && gameState.projectiles.map((proj) => (
            <View
              key={proj.id}
              style={[
                styles.projectile,
                {
                  left: proj.x - proj.size / 2,
                  top: proj.y - proj.size / 2,
                  width: proj.size,
                  height: proj.size,
                },
              ]}
            />
          ))}
          
          {/* Boss */}
          {gameState.boss && gameState.bossActive && (
            <Boss boss={gameState.boss} />
          )}

          {/* Player Ship with death animation */}
          <Animated.View
            style={{
              opacity: deathAnim,
              transform: [
                { rotate: rotation },
                { scale: deathScale },
              ],
            }}
          >
            <PlayerShip
              x={PLAYER.START_X}
              y={playerY}
              isThrusting={isThrusting}
              velocityY={gameState.playerVelocityY || 0}
            />
          </Animated.View>

          {/* HUD */}
          <HUD
            score={gameState.score}
            coins={gameState.coins}
            combo={gameState.combo}
            bestScore={bestScore}
            powerups={gameState.powerups}
            ammo={gameState.ammo}
            stageName={gameState.stageName}
          />
          
          {/* Right Fire Button */}
          <TouchableOpacity
            style={[styles.fireButton, { left: fireButton.x, top: fireButton.y }]}
            onPress={handleFire}
            activeOpacity={0.7}
          >
            <Text style={styles.fireButtonText}>🔫</Text>
            <Text style={styles.ammoText}>{gameState.ammo || 0}</Text>
          </TouchableOpacity>

          {/* Left Fire Button */}
          <TouchableOpacity
            style={[styles.leftFireButton, { left: leftFireButton.x, top: leftFireButton.y }]}
            onPress={handleLeftFire}
            activeOpacity={0.7}
          >
            <Text style={styles.fireButtonText}>🔫</Text>
            <Text style={styles.ammoText}>{gameState.ammo || 0}</Text>
          </TouchableOpacity>

        </Animated.View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  gameContainer: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  countdownText: {
    fontSize: Platform.OS === 'web' ? 180 : 140,
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
    textShadowColor: COLORS.PRIMARY,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 50,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: Platform.OS === 'web' ? 200 : 160,
  },
  readyText: {
    fontSize: 48,
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
    textShadowColor: COLORS.PRIMARY,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    textAlign: 'center',
  },
  readySubtext: {
    fontSize: Platform.OS === 'web' ? 32 : 24,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  backgroundLayer: {
    position: 'absolute',
    width: SCREEN_WIDTH * 3,
    height: SCREEN_HEIGHT,
  },
  nebula: {
    backgroundColor: '#0d1225',
    opacity: 0.3,
  },
  stars: {
    flex: 1,
  },
  star: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 2,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  projectile: {
    position: 'absolute',
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 4,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  fireButton: {
    position: 'absolute',
    width: 70,
    height: 70,
    backgroundColor: 'rgba(0, 212, 255, 0.3)',
    borderRadius: 35,
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  leftFireButton: {
    position: 'absolute',
    width: 70,
    height: 70,
    backgroundColor: 'rgba(255, 0, 150, 0.3)',
    borderRadius: 35,
    borderWidth: 2,
    borderColor: COLORS.SECONDARY,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.SECONDARY,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  fireButtonText: {
    fontSize: 30,
  },
  ammoText: {
    fontSize: 12,
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
    marginTop: 2,
  },
});

export default GameScreen;
