// Boss System - Epic encounters that appear at milestones
export const BOSSES = {
  GRUNT: {
    id: 'grunt',
    name: 'Boss Grunt',
    description: 'First boss encounter',
    appearAt: { score: 1200 },
    health: 50,
    size: 120,
    speed: 80,
    behavior: 'orbit_debris', // Shoots smaller asteroids in orbit
    rewards: {
      coins: 100,
      gems: 5,
      scoreBonus: 500,
    },
    visual: {
      color: '#8b4513',
      glow: '#ff4500',
      animation: 'rotate_slow',
    },
  },
  
  TITAN: {
    id: 'titan',
    name: 'Boss Titan',
    description: 'Ultimate boss challenge',
    appearAt: { score: 2400 },
    health: 100,
    size: 150,
    speed: 60,
    behavior: 'laser_sweep', // Sweeps laser across screen
    rewards: {
      coins: 200,
      gems: 10,
      scoreBonus: 1000,
    },
    visual: {
      color: '#ff0000',
      glow: '#ff00ff',
      animation: 'pulse_fast',
    },
  },
};

export const getBossForScore = (score) => {
  const availableBosses = Object.values(BOSSES).filter(
    boss => score >= boss.appearAt.score
  );
  
  if (availableBosses.length === 0) return null;
  
  // Return highest tier boss available
  return availableBosses[availableBosses.length - 1];
};

export const shouldSpawnBoss = (score, lastBossScore) => {
  const boss = getBossForScore(score);
  if (!boss) return false;
  
  // Only spawn if we haven't seen this boss yet in this run
  return score >= boss.appearAt.score && lastBossScore < boss.appearAt.score;
};

