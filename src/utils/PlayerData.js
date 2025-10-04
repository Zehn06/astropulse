import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateDailyMissions, generateWeeklyMissions } from '../data/Missions';
import { ACHIEVEMENTS } from '../data/Achievements';

const STORAGE_KEY = '@astropulse_player_data';

const DEFAULT_PLAYER_DATA = {
  // Currency
  coins: 0,
  gems: 0,
  
  // Stats
  bestScore: 0,
  totalScore: 0,
  totalCoinsEarned: 0,
  totalGemsEarned: 0,
  gamesPlayed: 0,
  maxCombo: 0,
  maxDistance: 0,
  bossesDefeated: 0,
  
  // Ships
  currentShip: 'starter',
  ownedShips: ['starter'],
  
  // Boosters (inventory)
  boosters: {},
  
  // Active boosters (for current game)
  activeBoosters: [],
  
  // Upgrades
  ammoLevel: 1,
  fireRateLevel: 1,
  damageLevel: 1,
  
  // Daily Rewards
  dailyRewardStreak: 0,
  lastDailyReward: 0,
  
  // League
  league: 'bronze',
  
  // Missions
  dailyMissions: generateDailyMissions(),
  weeklyMissions: generateWeeklyMissions(),
  dailyMissionProgress: {},
  weeklyMissionProgress: {},
  lastDailyReset: new Date().toDateString(),
  lastWeeklyReset: getWeekStart(),
  
  // Achievements
  unlockedAchievements: [],
  
  // Settings
  soundEnabled: true,
  hapticEnabled: true,
  
  // Timestamps
  firstPlayDate: Date.now(),
  lastPlayDate: Date.now(),
  
  // Session stats (resets on app close)
  sessionGamesPlayed: 0,
  sessionScore: 0,
};

class PlayerData {
  constructor() {
    this.data = { ...DEFAULT_PLAYER_DATA };
    this.listeners = [];
  }

  async load() {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.data = { ...DEFAULT_PLAYER_DATA, ...parsed };
        
        // Check if daily/weekly missions need reset
        this.checkMissionResets();
        
        console.log('PlayerData: Loaded successfully');
        this.notifyListeners();
        return this.data;
      }
    } catch (error) {
      console.error('PlayerData: Load error', error);
    }
    return this.data;
  }

  async save() {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      console.log('PlayerData: Saved successfully');
      this.notifyListeners();
    } catch (error) {
      console.error('PlayerData: Save error', error);
    }
  }

  // Get current data
  getData() {
    return { ...this.data };
  }

  // Update data
  async update(updates) {
    this.data = { ...this.data, ...updates };
    await this.save();
  }

  // Currency operations
  async addCoins(amount) {
    this.data.coins += amount;
    this.data.totalCoinsEarned += amount;
    await this.save();
  }

  async spendCoins(amount) {
    if (this.data.coins >= amount) {
      this.data.coins -= amount;
      await this.save();
      return true;
    }
    return false;
  }

  async addGems(amount) {
    this.data.gems += amount;
    this.data.totalGemsEarned += amount;
    await this.save();
  }

  async spendGems(amount) {
    if (this.data.gems >= amount) {
      this.data.gems -= amount;
      await this.save();
      return true;
    }
    return false;
  }

  // Ship operations
  async purchaseShip(shipId) {
    if (!this.data.ownedShips.includes(shipId)) {
      this.data.ownedShips.push(shipId);
      await this.save();
      return true;
    }
    return false;
  }

  async selectShip(shipId) {
    if (this.data.ownedShips.includes(shipId)) {
      this.data.currentShip = shipId;
      await this.save();
      return true;
    }
    return false;
  }

  // Booster operations
  async purchaseBooster(boosterId, quantity = 1) {
    this.data.boosters[boosterId] = (this.data.boosters[boosterId] || 0) + quantity;
    await this.save();
  }

  async useBooster(boosterId) {
    if ((this.data.boosters[boosterId] || 0) > 0) {
      this.data.boosters[boosterId]--;
      this.data.activeBoosters.push(boosterId);
      await this.save();
      return true;
    }
    return false;
  }

  clearActiveBoosters() {
    this.data.activeBoosters = [];
  }

  // Game completion
  async onGameComplete(gameData) {
    const { score, coins, combo, distance, bossDefeated } = gameData;
    
    // Update stats
    if (score > this.data.bestScore) {
      this.data.bestScore = score;
    }
    this.data.totalScore += score;
    this.data.gamesPlayed++;
    this.data.sessionGamesPlayed++;
    this.data.sessionScore += score;
    
    if (combo > this.data.maxCombo) {
      this.data.maxCombo = combo;
    }
    
    if (distance > this.data.maxDistance) {
      this.data.maxDistance = distance;
    }
    
    if (bossDefeated) {
      this.data.bossesDefeated++;
    }
    
    // Add coins
    await this.addCoins(coins);
    
    // Update league
    this.updateLeague();
    
    // Check achievements
    this.checkAchievements();
    
    // Update mission progress
    this.updateMissionProgress(gameData);
    
    // Clear active boosters
    this.clearActiveBoosters();
    
    // Save
    this.data.lastPlayDate = Date.now();
    await this.save();
    
    return this.data;
  }

  updateLeague() {
    const { getLeagueForScore } = require('../data/Leagues');
    const newLeague = getLeagueForScore(this.data.bestScore);
    this.data.league = newLeague.id;
  }

  checkAchievements() {
    Object.values(ACHIEVEMENTS).forEach(achievement => {
      if (!this.data.unlockedAchievements.includes(achievement.id)) {
        const { checkAchievement } = require('../data/Achievements');
        if (checkAchievement(achievement, this.data)) {
          this.data.unlockedAchievements.push(achievement.id);
          // Award achievement rewards
          this.data.coins += achievement.rewards.coins;
          this.data.gems += achievement.rewards.gems;
          console.log('Achievement unlocked:', achievement.name);
        }
      }
    });
  }

  updateMissionProgress(gameData) {
    // Update daily missions
    this.data.dailyMissions.forEach(mission => {
      const progressKey = mission.id;
      if (!this.data.dailyMissionProgress[progressKey]) {
        this.data.dailyMissionProgress[progressKey] = 0;
      }
      
      switch (mission.type) {
        case 'score':
          if (gameData.score >= mission.target) {
            this.data.dailyMissionProgress[progressKey] = mission.target;
          }
          break;
        case 'coins':
          this.data.dailyMissionProgress[progressKey] += gameData.coins;
          break;
        case 'combo':
          if (gameData.combo >= mission.target) {
            this.data.dailyMissionProgress[progressKey] = mission.target;
          }
          break;
        case 'games':
          this.data.dailyMissionProgress[progressKey]++;
          break;
        case 'distance':
          if (gameData.distance >= mission.target) {
            this.data.dailyMissionProgress[progressKey] = mission.target;
          }
          break;
      }
    });

    // Similar for weekly missions
    this.data.weeklyMissions.forEach(mission => {
      const progressKey = mission.id;
      if (!this.data.weeklyMissionProgress[progressKey]) {
        this.data.weeklyMissionProgress[progressKey] = 0;
      }
      
      // Update progress based on mission type
      switch (mission.type) {
        case 'score':
          this.data.weeklyMissionProgress[progressKey] += gameData.score;
          break;
        case 'coins':
          this.data.weeklyMissionProgress[progressKey] += gameData.coins;
          break;
        case 'games':
          this.data.weeklyMissionProgress[progressKey]++;
          break;
        case 'bosses':
          if (gameData.bossDefeated) {
            this.data.weeklyMissionProgress[progressKey]++;
          }
          break;
      }
    });
  }

  checkMissionResets() {
    const today = new Date().toDateString();
    const thisWeek = getWeekStart();
    
    // Reset daily missions
    if (this.data.lastDailyReset !== today) {
      this.data.dailyMissions = generateDailyMissions();
      this.data.dailyMissionProgress = {};
      this.data.lastDailyReset = today;
      console.log('Daily missions reset');
    }
    
    // Reset weekly missions
    if (this.data.lastWeeklyReset !== thisWeek) {
      this.data.weeklyMissions = generateWeeklyMissions();
      this.data.weeklyMissionProgress = {};
      this.data.lastWeeklyReset = thisWeek;
      console.log('Weekly missions reset');
    }
  }

  // Upgrade ammo capacity
  async upgradeAmmo() {
    if (this.data.ammoLevel < 7) {
      this.data.ammoLevel++;
      await this.save();
      return true;
    }
    return false;
  }
  
  // Get max ammo based on level
  getMaxAmmo() {
    return Math.floor(50 * (1 + (this.data.ammoLevel - 1) * 0.5));
  }

  // Listener system for reactive updates
  addListener(callback) {
    this.listeners.push(callback);
  }

  removeListener(callback) {
    this.listeners = this.listeners.filter(l => l !== callback);
  }

  notifyListeners() {
    this.listeners.forEach(callback => callback(this.data));
  }

  // Reset all data (for testing)
  async reset() {
    this.data = { ...DEFAULT_PLAYER_DATA };
    await this.save();
  }
}

function getWeekStart() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday as week start
  const monday = new Date(now.setDate(diff));
  return monday.toDateString();
}

export default new PlayerData();

