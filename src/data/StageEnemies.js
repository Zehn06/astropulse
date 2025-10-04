// Different enemy configurations for each stage
export const STAGE_ENEMIES = {
  0: {
    // Easy Space
    enemies: ['asteroidSmall', 'star'],
    weights: { asteroidSmall: 0.6, star: 0.4 },
    speedMultiplier: 1.0,
  },
  1: {
    // Asteroid Belt
    enemies: ['asteroidSmall', 'asteroidMed', 'star'],
    weights: { asteroidSmall: 0.4, asteroidMed: 0.3, star: 0.3 },
    speedMultiplier: 1.1,
  },
  2: {
    // Danger Zone
    enemies: ['asteroidSmall', 'asteroidMed', 'asteroidBig', 'enemyDrone', 'star'],
    weights: { asteroidSmall: 0.25, asteroidMed: 0.25, asteroidBig: 0.15, enemyDrone: 0.15, star: 0.2 },
    speedMultiplier: 1.2,
  },
  3: {
    // Boss Encounter
    enemies: ['asteroidMed', 'asteroidBig', 'enemyDrone', 'star'],
    weights: { asteroidMed: 0.3, asteroidBig: 0.25, enemyDrone: 0.25, star: 0.2 },
    speedMultiplier: 1.3,
    bossType: 'GRUNT',
  },
  4: {
    // Deep Space
    enemies: ['asteroidMed', 'asteroidBig', 'enemyDrone', 'star'],
    weights: { asteroidMed: 0.25, asteroidBig: 0.3, enemyDrone: 0.3, star: 0.15 },
    speedMultiplier: 1.4,
  },
  5: {
    // Chaos Realm
    enemies: ['asteroidBig', 'enemyDrone', 'star'],
    weights: { asteroidBig: 0.4, enemyDrone: 0.45, star: 0.15 },
    speedMultiplier: 1.5,
  },
  6: {
    // Boss Battle
    enemies: ['asteroidBig', 'enemyDrone', 'star'],
    weights: { asteroidBig: 0.35, enemyDrone: 0.45, star: 0.2 },
    speedMultiplier: 1.6,
    bossType: 'TITAN',
  },
};

export const getEnemiesForStage = (stageIndex) => {
  return STAGE_ENEMIES[stageIndex] || STAGE_ENEMIES[0];
};

