// AstroPulse Game Configuration
// Based on GDD specifications

// Debug mode - Set to false for production
export const DEBUG = {
  ENABLED: true, // Set to false in production
  SHOW_FPS: false,
  SHOW_COLLIDERS: false,
  GOD_MODE: false,
  LOG_SPAWNS: false,
};

export const PHYSICS = {
  GRAVITY: 900, // px/s^2
  JUMP_IMPULSE: -330, // px/s (negative = upward)
  MAX_FALL_SPEED: 750, // px/s
  MIN_Y: 40,
  MAX_Y_OFFSET: 40, // from screen height
  TAP_COOLDOWN: 0.08, // seconds
  COMBO_WINDOW: 0.7, // seconds
};

export const PLAYER = {
  START_X: 120,
  SIZE: 50,
  INITIAL_VELOCITY_Y: 0,
};

// Web responsive settings
export const WEB_CONFIG = {
  // Desktop için sabit boyutlar
  DESKTOP_WIDTH: 500,
  DESKTOP_HEIGHT: 800,
  // Mobile için responsive
  MOBILE_WIDTH: '100vw',
  MOBILE_HEIGHT: '100vh',
  // Web için özel ayarlar
  WEB_PLAYER_START_X: 60, // Web'de daha küçük ekran için
  WEB_PLAYER_SIZE: 40, // Web'de daha küçük player
};

export const SPAWN = {
  INITIAL_INTERVAL: 1.4, // seconds
  MIN_INTERVAL: 0.5, // minimum spawn interval
  INTERVAL_DECREASE_RATE: 0.98, // per 10 seconds
  DIFFICULTY_INCREASE_INTERVAL: 15, // seconds
  DIFFICULTY_MULTIPLIER_INCREASE: 0.05,
  BASE_SPEED: 220, // px/s
  POWERUP_FREQUENCY_MIN: 12, // seconds
  POWERUP_FREQUENCY_MAX: 18, // seconds
};

export const SCORING = {
  STAR_PICKUP: 10,
  SURVIVAL_PER_SECOND: 2,
  COMBO_MULTIPLIER: 0.1, // 10% per combo level
  DISTANCE_BONUS_INTERVAL: 100, // meters
  DISTANCE_BONUS_POINTS: 50,
  COIN_PER_STAR: 1,
  COMBO_COIN_DIVISOR: 3, // extra coin per 3 combo
};

export const ENEMIES = {
  ASTEROID_SMALL: {
    speed: 220,
    size: 32,
    points: 0,
    health: 1,
  },
  ASTEROID_MED: {
    speed: 160,
    size: 48,
    points: 0,
    health: 2,
  },
  ASTEROID_BIG: {
    speed: 100,
    size: 64,
    points: 0,
    health: 3,
  },
  ENEMY_DRONE: {
    speed: 180,
    size: 40,
    health: 2,
    oscillation: {
      frequency: 2,
      amplitude: 30,
    },
  },
};

export const WEAPONS = {
  FIRE_COOLDOWN: 0.3, // seconds
  PROJECTILE_SPEED: 600, // px/s
  PROJECTILE_SIZE: 8,
  INITIAL_AMMO: 50,
};

export const POWERUPS = {
  SHIELD: {
    duration: 0, // instant effect
    durability: 2,
  },
  SLOW_TIME: {
    duration: 5,
    timeScale: 0.7,
  },
  MAGNET: {
    duration: 6,
    radius: 150,
  },
  DOUBLE: {
    duration: 8,
    multiplier: 2,
  },
};

export const COLORS = {
  BACKGROUND: '#0a0e27',
  PRIMARY: '#00d4ff', // neon cyan
  SECONDARY: '#ff00ff', // neon magenta
  ACCENT: '#ffff00', // yellow
  STAR: '#ffd700', // gold
  DANGER: '#ff3366',
  SUCCESS: '#00ff88',
  TEXT_PRIMARY: '#ffffff',
  TEXT_SECONDARY: '#8892b0',
};

export const SPAWN_PROBABILITIES = {
  // Initial probabilities (will change with difficulty)
  STAR: 0.35,
  ASTEROID_SMALL: 0.25,
  ASTEROID_MED: 0.15,
  ASTEROID_BIG: 0.10,
  ENEMY_DRONE: 0.10,
  AMMO_PICKUP: 0.05,
};

export const DIFFICULTY_STAGES = {
  STAGE_INTERVAL: 400, // Every 400 score
  STAGES: [
    { score: 0, name: 'Easy Space', enemyMultiplier: 1.0, spawnRate: 1.0 },
    { score: 400, name: 'Asteroid Belt', enemyMultiplier: 1.2, spawnRate: 1.15 },
    { score: 800, name: 'Danger Zone', enemyMultiplier: 1.4, spawnRate: 1.3 },
    { score: 1200, name: 'Boss Encounter', enemyMultiplier: 1.6, spawnRate: 1.5, boss: 'GRUNT' },
    { score: 1600, name: 'Deep Space', enemyMultiplier: 1.8, spawnRate: 1.7 },
    { score: 2000, name: 'Chaos Realm', enemyMultiplier: 2.0, spawnRate: 2.0 },
    { score: 2400, name: 'Boss Battle', enemyMultiplier: 2.2, spawnRate: 2.3, boss: 'TITAN' },
  ],
};

export const GAME_STATE = {
  MENU: 'MENU',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  GAME_OVER: 'GAME_OVER',
  TUTORIAL: 'TUTORIAL',
};

// Quality of Life improvements
export const QOL = {
  AUTO_SAVE_INTERVAL: 5, // seconds
  MAX_ENTITIES: 50, // prevent performance issues
  PARTICLE_LIFETIME: 1, // seconds
  SCREEN_SHAKE_INTENSITY: 10, // pixels
  HAPTIC_ENABLED: true,
  SOUND_ENABLED: true,
};

// Visual effects settings
export const VFX = {
  STAR_GLOW_RADIUS: 10,
  SHIP_TRAIL_LENGTH: 5,
  EXPLOSION_PARTICLE_COUNT: 8,
  BACKGROUND_STAR_COUNT: 35,
  PARALLAX_SPEED_FAR: 0.3,
  PARALLAX_SPEED_MID: 0.6,
};

// Performance settings
export const PERFORMANCE = {
  TARGET_FPS: 60,
  MAX_DELTA_TIME: 0.1, // 100ms cap to prevent huge jumps
  ENTITY_CULL_DISTANCE: 100, // pixels off-screen before removal
  UPDATE_THROTTLE: 16.67, // ms (60 FPS)
};
