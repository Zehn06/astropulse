// Daily & Weekly Missions System
export const MISSION_TYPES = {
  SCORE: 'score',
  COINS: 'coins',
  DISTANCE: 'distance',
  COMBO: 'combo',
  STARS: 'stars',
  BOSSES: 'bosses',
  GAMES: 'games',
  POWERUPS: 'powerups',
};

export const DAILY_MISSIONS = [
  {
    id: 'daily_score_1000',
    name: 'Score Master',
    description: 'Reach 1,000 points in a single game',
    type: MISSION_TYPES.SCORE,
    target: 1000,
    rewards: { coins: 50, gems: 2 },
    difficulty: 'easy',
  },
  {
    id: 'daily_coins_50',
    name: 'Coin Collector',
    description: 'Collect 50 coins in total today',
    type: MISSION_TYPES.COINS,
    target: 50,
    rewards: { coins: 30, gems: 1 },
    difficulty: 'easy',
  },
  {
    id: 'daily_combo_10',
    name: 'Combo King',
    description: 'Achieve a 10x combo',
    type: MISSION_TYPES.COMBO,
    target: 10,
    rewards: { coins: 75, gems: 3 },
    difficulty: 'medium',
  },
  {
    id: 'daily_games_5',
    name: 'Persistent Player',
    description: 'Play 5 games today',
    type: MISSION_TYPES.GAMES,
    target: 5,
    rewards: { coins: 40, gems: 2 },
    difficulty: 'easy',
  },
  {
    id: 'daily_distance_5000',
    name: 'Long Journey',
    description: 'Travel 5,000 meters in a single game',
    type: MISSION_TYPES.DISTANCE,
    target: 5000,
    rewards: { coins: 100, gems: 5 },
    difficulty: 'hard',
  },
];

export const WEEKLY_MISSIONS = [
  {
    id: 'weekly_score_50000',
    name: 'Weekly Champion',
    description: 'Reach 50,000 total score this week',
    type: MISSION_TYPES.SCORE,
    target: 50000,
    rewards: { coins: 500, gems: 50 },
    difficulty: 'hard',
  },
  {
    id: 'weekly_bosses_3',
    name: 'Boss Hunter',
    description: 'Defeat 3 bosses this week',
    type: MISSION_TYPES.BOSSES,
    target: 3,
    rewards: { coins: 300, gems: 30 },
    difficulty: 'medium',
  },
  {
    id: 'weekly_games_25',
    name: 'Dedicated Player',
    description: 'Play 25 games this week',
    type: MISSION_TYPES.GAMES,
    target: 25,
    rewards: { coins: 400, gems: 40 },
    difficulty: 'medium',
  },
  {
    id: 'weekly_coins_500',
    name: 'Wealth Builder',
    description: 'Collect 500 coins this week',
    type: MISSION_TYPES.COINS,
    target: 500,
    rewards: { coins: 200, gems: 25 },
    difficulty: 'hard',
  },
];

export const generateDailyMissions = () => {
  // Randomly select 3 daily missions
  const shuffled = [...DAILY_MISSIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
};

export const generateWeeklyMissions = () => {
  // Return 2 weekly missions
  const shuffled = [...WEEKLY_MISSIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 2);
};

export const checkMissionProgress = (mission, stats) => {
  switch (mission.type) {
    case MISSION_TYPES.SCORE:
      return stats.totalScore >= mission.target;
    case MISSION_TYPES.COINS:
      return stats.totalCoins >= mission.target;
    case MISSION_TYPES.COMBO:
      return stats.maxCombo >= mission.target;
    case MISSION_TYPES.GAMES:
      return stats.gamesPlayed >= mission.target;
    case MISSION_TYPES.DISTANCE:
      return stats.maxDistance >= mission.target;
    case MISSION_TYPES.BOSSES:
      return stats.bossesDefeated >= mission.target;
    default:
      return false;
  }
};

