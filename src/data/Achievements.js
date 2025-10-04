// Achievements System - Permanent unlocks
export const ACHIEVEMENTS = {
  // Score Achievements
  FIRST_FLIGHT: {
    id: 'first_flight',
    name: 'First Flight',
    description: 'Complete your first game',
    icon: '🚀',
    requirement: { gamesPlayed: 1 },
    rewards: { coins: 50, gems: 5 },
    tier: 'bronze',
  },
  
  SCORE_1K: {
    id: 'score_1k',
    name: 'Novice Pilot',
    description: 'Reach 1,000 points',
    icon: '⭐',
    requirement: { bestScore: 1000 },
    rewards: { coins: 100, gems: 10 },
    tier: 'bronze',
  },
  
  SCORE_10K: {
    id: 'score_10k',
    name: 'Skilled Navigator',
    description: 'Reach 10,000 points',
    icon: '🌟',
    requirement: { bestScore: 10000 },
    rewards: { coins: 250, gems: 25 },
    tier: 'silver',
  },
  
  SCORE_50K: {
    id: 'score_50k',
    name: 'Ace Pilot',
    description: 'Reach 50,000 points',
    icon: '💫',
    requirement: { bestScore: 50000 },
    rewards: { coins: 500, gems: 50 },
    tier: 'gold',
  },
  
  SCORE_100K: {
    id: 'score_100k',
    name: 'Legendary Commander',
    description: 'Reach 100,000 points',
    icon: '👑',
    requirement: { bestScore: 100000 },
    rewards: { coins: 1000, gems: 100 },
    tier: 'diamond',
  },
  
  // Coin Achievements
  RICH_1K: {
    id: 'rich_1k',
    name: 'Coin Collector',
    description: 'Earn 1,000 total coins',
    icon: '💰',
    requirement: { totalCoinsEarned: 1000 },
    rewards: { coins: 100, gems: 10 },
    tier: 'bronze',
  },
  
  RICH_10K: {
    id: 'rich_10k',
    name: 'Wealthy Trader',
    description: 'Earn 10,000 total coins',
    icon: '💎',
    requirement: { totalCoinsEarned: 10000 },
    rewards: { coins: 500, gems: 50 },
    tier: 'gold',
  },
  
  // Combo Achievements
  COMBO_10: {
    id: 'combo_10',
    name: 'Combo Starter',
    description: 'Achieve a 10x combo',
    icon: '🔥',
    requirement: { maxCombo: 10 },
    rewards: { coins: 75, gems: 7 },
    tier: 'bronze',
  },
  
  COMBO_25: {
    id: 'combo_25',
    name: 'Combo Master',
    description: 'Achieve a 25x combo',
    icon: '🔥🔥',
    requirement: { maxCombo: 25 },
    rewards: { coins: 200, gems: 20 },
    tier: 'silver',
  },
  
  COMBO_50: {
    id: 'combo_50',
    name: 'Combo God',
    description: 'Achieve a 50x combo',
    icon: '🔥🔥🔥',
    requirement: { maxCombo: 50 },
    rewards: { coins: 500, gems: 50 },
    tier: 'gold',
  },
  
  // Boss Achievements
  BOSS_FIRST: {
    id: 'boss_first',
    name: 'Boss Slayer',
    description: 'Defeat your first boss',
    icon: '⚔️',
    requirement: { bossesDefeated: 1 },
    rewards: { coins: 150, gems: 15 },
    tier: 'silver',
  },
  
  BOSS_10: {
    id: 'boss_10',
    name: 'Boss Hunter',
    description: 'Defeat 10 bosses',
    icon: '🗡️',
    requirement: { bossesDefeated: 10 },
    rewards: { coins: 500, gems: 50 },
    tier: 'gold',
  },
  
  // Distance Achievements
  DISTANCE_10K: {
    id: 'distance_10k',
    name: 'Long Distance',
    description: 'Travel 10,000 meters',
    icon: '🛸',
    requirement: { maxDistance: 10000 },
    rewards: { coins: 200, gems: 20 },
    tier: 'silver',
  },
  
  // Collection Achievements
  SHIPS_5: {
    id: 'ships_5',
    name: 'Ship Collector',
    description: 'Own 5 different ships',
    icon: '🚢',
    requirement: { shipsOwned: 5 },
    rewards: { coins: 300, gems: 30 },
    tier: 'silver',
  },
  
  SHIPS_ALL: {
    id: 'ships_all',
    name: 'Master Collector',
    description: 'Own all ships',
    icon: '🏆',
    requirement: { shipsOwned: 10 },
    rewards: { coins: 1000, gems: 100 },
    tier: 'diamond',
  },
};

export const checkAchievement = (achievement, playerStats) => {
  const req = achievement.requirement;
  
  for (const [key, value] of Object.entries(req)) {
    if (playerStats[key] < value) {
      return false;
    }
  }
  
  return true;
};

export const getUnlockedAchievements = (playerStats) => {
  return Object.values(ACHIEVEMENTS).filter(achievement => 
    checkAchievement(achievement, playerStats)
  );
};

export const getAchievementProgress = (achievement, playerStats) => {
  const req = achievement.requirement;
  const key = Object.keys(req)[0];
  const target = req[key];
  const current = playerStats[key] || 0;
  
  return {
    current,
    target,
    percentage: Math.min((current / target) * 100, 100),
  };
};

