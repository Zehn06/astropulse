// Ship Database - 15 Different Ships with Unique Stats
export const SHIPS = {
  STARTER: {
    id: 'starter',
    name: 'Explorer',
    description: 'Basic ship for beginners',
    tier: 1,
    stats: {
      speed: 1.0,
      handling: 1.0,
      luck: 1.0,
      magnetism: 1.0,
      shield: 0,
    },
    price: 0,
    priceGems: 0,
    unlockRequirement: null,
    visual: {
      color: '#00d4ff',
      shape: 'triangle',
      trail: '#00d4ff',
    },
  },
  
  SPEEDSTER: {
    id: 'speedster',
    name: 'Velocity',
    description: 'Fast and agile, but fragile',
    tier: 2,
    stats: {
      speed: 1.3,
      handling: 1.2,
      luck: 0.9,
      magnetism: 0.8,
      shield: 0,
    },
    price: 500,
    priceGems: 0,
    unlockRequirement: { score: 1000 },
    visual: {
      color: '#ff0066',
      shape: 'slim',
      trail: '#ff0066',
    },
  },
  
  TANK: {
    id: 'tank',
    name: 'Fortress',
    description: 'Slow but has shield protection',
    tier: 2,
    stats: {
      speed: 0.8,
      handling: 0.7,
      luck: 1.0,
      magnetism: 1.0,
      shield: 1,
    },
    price: 750,
    priceGems: 0,
    unlockRequirement: { score: 2000 },
    visual: {
      color: '#00ff00',
      shape: 'heavy',
      trail: '#00ff00',
    },
  },
  
  LUCKY_CHARM: {
    id: 'lucky',
    name: 'Lucky Star',
    description: 'Increased coin and power-up drops',
    tier: 2,
    stats: {
      speed: 1.0,
      handling: 1.0,
      luck: 1.5,
      magnetism: 1.3,
      shield: 0,
    },
    price: 1000,
    priceGems: 0,
    unlockRequirement: { score: 3000 },
    visual: {
      color: '#ffd700',
      shape: 'star',
      trail: '#ffd700',
    },
  },
  
  PHOENIX: {
    id: 'phoenix',
    name: 'Phoenix',
    description: 'Revive once per game',
    tier: 3,
    stats: {
      speed: 1.1,
      handling: 1.1,
      luck: 1.1,
      magnetism: 1.0,
      shield: 0,
      revive: 1,
    },
    price: 2000,
    priceGems: 50,
    unlockRequirement: { score: 5000 },
    visual: {
      color: '#ff4500',
      shape: 'phoenix',
      trail: '#ff4500',
    },
  },
  
  STEALTH: {
    id: 'stealth',
    name: 'Shadow',
    description: 'Smaller hitbox, hard to hit',
    tier: 3,
    stats: {
      speed: 1.2,
      handling: 1.3,
      luck: 1.0,
      magnetism: 0.9,
      shield: 0,
      hitboxReduction: 0.7,
    },
    price: 2500,
    priceGems: 75,
    unlockRequirement: { score: 7500 },
    visual: {
      color: '#9400d3',
      shape: 'stealth',
      trail: '#9400d3',
    },
  },
  
  MAGNET_KING: {
    id: 'magnet',
    name: 'Graviton',
    description: 'Powerful coin magnet',
    tier: 3,
    stats: {
      speed: 0.9,
      handling: 0.9,
      luck: 1.2,
      magnetism: 2.0,
      shield: 0,
    },
    price: 3000,
    priceGems: 100,
    unlockRequirement: { coins: 5000 },
    visual: {
      color: '#00ffff',
      shape: 'round',
      trail: '#00ffff',
    },
  },
  
  RAINBOW: {
    id: 'rainbow',
    name: 'Prisma',
    description: 'Balanced stats, rainbow trail',
    tier: 3,
    stats: {
      speed: 1.2,
      handling: 1.2,
      luck: 1.2,
      magnetism: 1.2,
      shield: 0,
    },
    price: 0,
    priceGems: 150,
    unlockRequirement: null,
    visual: {
      color: '#ffffff',
      shape: 'prisma',
      trail: 'rainbow',
    },
  },
  
  COSMIC: {
    id: 'cosmic',
    name: 'Cosmic Voyager',
    description: 'Elite ship with superior stats',
    tier: 4,
    stats: {
      speed: 1.3,
      handling: 1.3,
      luck: 1.3,
      magnetism: 1.3,
      shield: 1,
    },
    price: 5000,
    priceGems: 200,
    unlockRequirement: { league: 'gold' },
    visual: {
      color: '#8a2be2',
      shape: 'cosmic',
      trail: '#8a2be2',
    },
  },
  
  LEGENDARY: {
    id: 'legendary',
    name: 'Apex Predator',
    description: 'The ultimate ship',
    tier: 5,
    stats: {
      speed: 1.5,
      handling: 1.5,
      luck: 1.5,
      magnetism: 1.5,
      shield: 2,
      revive: 1,
    },
    price: 10000,
    priceGems: 500,
    unlockRequirement: { league: 'diamond' },
    visual: {
      color: '#ff00ff',
      shape: 'legendary',
      trail: 'legendary',
    },
  },
};

export const getShipById = (id) => SHIPS[id.toUpperCase()] || SHIPS.STARTER;

export const getAvailableShips = (playerData) => {
  return Object.values(SHIPS).filter(ship => {
    if (!ship.unlockRequirement) return true;
    
    const req = ship.unlockRequirement;
    if (req.score && playerData.bestScore < req.score) return false;
    if (req.coins && playerData.totalCoinsEarned < req.coins) return false;
    if (req.league && !isLeagueUnlocked(playerData.league, req.league)) return false;
    
    return true;
  });
};

const isLeagueUnlocked = (currentLeague, requiredLeague) => {
  const leagues = ['bronze', 'silver', 'gold', 'platinum', 'diamond'];
  const currentIndex = leagues.indexOf(currentLeague);
  const requiredIndex = leagues.indexOf(requiredLeague);
  return currentIndex >= requiredIndex;
};

