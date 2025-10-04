// League/Tier System - Competitive progression
export const LEAGUES = {
  BRONZE: {
    id: 'bronze',
    name: 'Bronze League',
    icon: '🥉',
    color: '#cd7f32',
    minScore: 0,
    maxScore: 5000,
    rewards: {
      weekly: { coins: 100, gems: 5 },
      promotion: { coins: 200, gems: 10 },
    },
  },
  
  SILVER: {
    id: 'silver',
    name: 'Silver League',
    icon: '🥈',
    color: '#c0c0c0',
    minScore: 5000,
    maxScore: 15000,
    rewards: {
      weekly: { coins: 250, gems: 15 },
      promotion: { coins: 500, gems: 25 },
    },
  },
  
  GOLD: {
    id: 'gold',
    name: 'Gold League',
    icon: '🥇',
    color: '#ffd700',
    minScore: 15000,
    maxScore: 35000,
    rewards: {
      weekly: { coins: 500, gems: 30 },
      promotion: { coins: 1000, gems: 50 },
    },
  },
  
  PLATINUM: {
    id: 'platinum',
    name: 'Platinum League',
    icon: '💎',
    color: '#e5e4e2',
    minScore: 35000,
    maxScore: 75000,
    rewards: {
      weekly: { coins: 1000, gems: 60 },
      promotion: { coins: 2000, gems: 100 },
    },
  },
  
  DIAMOND: {
    id: 'diamond',
    name: 'Diamond League',
    icon: '💠',
    color: '#b9f2ff',
    minScore: 75000,
    maxScore: 150000,
    rewards: {
      weekly: { coins: 2000, gems: 120 },
      promotion: { coins: 5000, gems: 250 },
    },
  },
  
  MASTER: {
    id: 'master',
    name: 'Master League',
    icon: '👑',
    color: '#ff00ff',
    minScore: 150000,
    maxScore: Infinity,
    rewards: {
      weekly: { coins: 5000, gems: 300 },
      promotion: null, // Already at top
    },
  },
};

export const getLeagueForScore = (bestScore) => {
  const leagues = Object.values(LEAGUES);
  for (let i = leagues.length - 1; i >= 0; i--) {
    if (bestScore >= leagues[i].minScore) {
      return leagues[i];
    }
  }
  return LEAGUES.BRONZE;
};

export const getNextLeague = (currentLeague) => {
  const leagues = Object.values(LEAGUES);
  const currentIndex = leagues.findIndex(l => l.id === currentLeague.id);
  return leagues[currentIndex + 1] || null;
};

export const getProgressToNextLeague = (bestScore, currentLeague) => {
  const nextLeague = getNextLeague(currentLeague);
  if (!nextLeague) return 100; // Already at max
  
  const progress = ((bestScore - currentLeague.minScore) / (nextLeague.minScore - currentLeague.minScore)) * 100;
  return Math.min(Math.max(progress, 0), 100);
};

