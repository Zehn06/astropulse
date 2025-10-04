// Boosters - Consumable items that enhance gameplay
export const BOOSTERS = {
  DOUBLE_COINS: {
    id: 'double_coins',
    name: '2x Coins',
    description: 'Double coins for one game',
    icon: '💰',
    duration: 'one_game',
    effect: { coinMultiplier: 2 },
    price: 100,
    priceGems: 5,
    stackable: true,
  },
  
  TRIPLE_COINS: {
    id: 'triple_coins',
    name: '3x Coins',
    description: 'Triple coins for one game',
    icon: '💎',
    duration: 'one_game',
    effect: { coinMultiplier: 3 },
    price: 250,
    priceGems: 10,
    stackable: true,
  },
  
  SCORE_BOOST: {
    id: 'score_boost',
    name: 'Score Booster',
    description: '+50% score for one game',
    icon: '🚀',
    duration: 'one_game',
    effect: { scoreMultiplier: 1.5 },
    price: 150,
    priceGems: 7,
    stackable: true,
  },
  
  MEGA_SCORE: {
    id: 'mega_score',
    name: 'Mega Score',
    description: '2x score for one game',
    icon: '⭐',
    duration: 'one_game',
    effect: { scoreMultiplier: 2 },
    price: 300,
    priceGems: 15,
    stackable: true,
  },
  
  SHIELD_START: {
    id: 'shield_start',
    name: 'Starting Shield',
    description: 'Start with a shield',
    icon: '🛡️',
    duration: 'one_game',
    effect: { startWithShield: true },
    price: 200,
    priceGems: 10,
    stackable: true,
  },
  
  MAGNET_START: {
    id: 'magnet_start',
    name: 'Starting Magnet',
    description: 'Start with magnet active',
    icon: '🧲',
    duration: 'one_game',
    effect: { startWithMagnet: 10 }, // 10 seconds
    price: 150,
    priceGems: 7,
    stackable: true,
  },
  
  SLOW_START: {
    id: 'slow_start',
    name: 'Slow Motion Start',
    description: 'Start with slow-mo active',
    icon: '⏱️',
    duration: 'one_game',
    effect: { startWithSlowMo: 10 },
    price: 150,
    priceGems: 7,
    stackable: true,
  },
  
  HEAD_START: {
    id: 'head_start',
    name: 'Head Start',
    description: 'Start with 500 points',
    icon: '🎯',
    duration: 'one_game',
    effect: { startScore: 500 },
    price: 200,
    priceGems: 10,
    stackable: false,
  },
  
  REVIVE: {
    id: 'revive',
    name: 'Extra Life',
    description: 'Revive once when you die',
    icon: '❤️',
    duration: 'one_game',
    effect: { extraLife: 1 },
    price: 300,
    priceGems: 20,
    stackable: true,
  },
  
  SUPER_COMBO: {
    id: 'super_combo',
    name: 'Super Combo',
    description: 'Combo window +50%',
    icon: '🔥',
    duration: 'one_game',
    effect: { comboWindowMultiplier: 1.5 },
    price: 180,
    priceGems: 9,
    stackable: false,
  },
};

export const getBoosterById = (id) => BOOSTERS[id.toUpperCase()];

export const calculateBoosterEffects = (activeBoosters) => {
  const effects = {
    coinMultiplier: 1,
    scoreMultiplier: 1,
    startWithShield: false,
    startWithMagnet: 0,
    startWithSlowMo: 0,
    startScore: 0,
    extraLife: 0,
    comboWindowMultiplier: 1,
  };

  activeBoosters.forEach(boosterId => {
    const booster = getBoosterById(boosterId);
    if (!booster) return;

    Object.keys(booster.effect).forEach(key => {
      if (key === 'coinMultiplier' || key === 'scoreMultiplier') {
        effects[key] *= booster.effect[key];
      } else if (key === 'startScore' || key === 'startWithMagnet' || key === 'startWithSlowMo') {
        effects[key] += booster.effect[key];
      } else if (key === 'extraLife') {
        effects[key] += booster.effect[key];
      } else {
        effects[key] = effects[key] || booster.effect[key];
      }
    });
  });

  return effects;
};

