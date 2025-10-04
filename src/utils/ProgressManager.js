// Progress Manager - Kullanıcı ilerlemesini kaydetme sistemi
import AsyncStorage from '@react-native-async-storage/async-storage';

const PROGRESS_KEYS = {
  PLAYER_DATA: 'player_progress',
  GAME_STATS: 'game_stats',
  ACHIEVEMENTS: 'achievements',
  DAILY_REWARDS: 'daily_rewards',
  SETTINGS: 'game_settings',
};

class ProgressManager {
  // Player Data Kaydetme
  static async savePlayerData(playerData) {
    try {
      await AsyncStorage.setItem(PROGRESS_KEYS.PLAYER_DATA, JSON.stringify(playerData));
      console.log('ProgressManager: Player data saved');
      return true;
    } catch (error) {
      console.error('ProgressManager: Error saving player data:', error);
      return false;
    }
  }

  // Player Data Yükleme
  static async loadPlayerData() {
    try {
      const data = await AsyncStorage.getItem(PROGRESS_KEYS.PLAYER_DATA);
      if (data) {
        const playerData = JSON.parse(data);
        console.log('ProgressManager: Player data loaded');
        return playerData;
      }
      return null;
    } catch (error) {
      console.error('ProgressManager: Error loading player data:', error);
      return null;
    }
  }

  // Game Stats Kaydetme
  static async saveGameStats(stats) {
    try {
      await AsyncStorage.setItem(PROGRESS_KEYS.GAME_STATS, JSON.stringify(stats));
      console.log('ProgressManager: Game stats saved');
      return true;
    } catch (error) {
      console.error('ProgressManager: Error saving game stats:', error);
      return false;
    }
  }

  // Game Stats Yükleme
  static async loadGameStats() {
    try {
      const data = await AsyncStorage.getItem(PROGRESS_KEYS.GAME_STATS);
      if (data) {
        const stats = JSON.parse(data);
        console.log('ProgressManager: Game stats loaded');
        return stats;
      }
      return {
        totalGamesPlayed: 0,
        totalScore: 0,
        bestScore: 0,
        totalCoinsEarned: 0,
        totalDistance: 0,
        enemiesKilled: 0,
        powerupsCollected: 0,
        playTime: 0,
        lastPlayed: null,
      };
    } catch (error) {
      console.error('ProgressManager: Error loading game stats:', error);
      return null;
    }
  }

  // Achievements Kaydetme
  static async saveAchievements(achievements) {
    try {
      await AsyncStorage.setItem(PROGRESS_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
      console.log('ProgressManager: Achievements saved');
      return true;
    } catch (error) {
      console.error('ProgressManager: Error saving achievements:', error);
      return false;
    }
  }

  // Achievements Yükleme
  static async loadAchievements() {
    try {
      const data = await AsyncStorage.getItem(PROGRESS_KEYS.ACHIEVEMENTS);
      if (data) {
        const achievements = JSON.parse(data);
        console.log('ProgressManager: Achievements loaded');
        return achievements;
      }
      return {};
    } catch (error) {
      console.error('ProgressManager: Error loading achievements:', error);
      return {};
    }
  }

  // Daily Rewards Kaydetme
  static async saveDailyRewards(dailyRewards) {
    try {
      await AsyncStorage.setItem(PROGRESS_KEYS.DAILY_REWARDS, JSON.stringify(dailyRewards));
      console.log('ProgressManager: Daily rewards saved');
      return true;
    } catch (error) {
      console.error('ProgressManager: Error saving daily rewards:', error);
      return false;
    }
  }

  // Daily Rewards Yükleme
  static async loadDailyRewards() {
    try {
      const data = await AsyncStorage.getItem(PROGRESS_KEYS.DAILY_REWARDS);
      if (data) {
        const dailyRewards = JSON.parse(data);
        console.log('ProgressManager: Daily rewards loaded');
        return dailyRewards;
      }
      return {
        lastClaimed: null,
        streak: 0,
        totalClaimed: 0,
      };
    } catch (error) {
      console.error('ProgressManager: Error loading daily rewards:', error);
      return null;
    }
  }

  // Settings Kaydetme
  static async saveSettings(settings) {
    try {
      await AsyncStorage.setItem(PROGRESS_KEYS.SETTINGS, JSON.stringify(settings));
      console.log('ProgressManager: Settings saved');
      return true;
    } catch (error) {
      console.error('ProgressManager: Error saving settings:', error);
      return false;
    }
  }

  // Settings Yükleme
  static async loadSettings() {
    try {
      const data = await AsyncStorage.getItem(PROGRESS_KEYS.SETTINGS);
      if (data) {
        const settings = JSON.parse(data);
        console.log('ProgressManager: Settings loaded');
        return settings;
      }
      return {
        soundEnabled: true,
        hapticsEnabled: true,
        musicVolume: 0.7,
        sfxVolume: 0.8,
        graphicsQuality: 'high',
        language: 'en',
      };
    } catch (error) {
      console.error('ProgressManager: Error loading settings:', error);
      return null;
    }
  }

  // Tüm Progress'i Kaydetme
  static async saveAllProgress(playerData, gameStats, achievements, dailyRewards, settings) {
    try {
      const promises = [
        this.savePlayerData(playerData),
        this.saveGameStats(gameStats),
        this.saveAchievements(achievements),
        this.saveDailyRewards(dailyRewards),
        this.saveSettings(settings),
      ];
      
      const results = await Promise.all(promises);
      const allSaved = results.every(result => result === true);
      
      if (allSaved) {
        console.log('ProgressManager: All progress saved successfully');
        return true;
      } else {
        console.warn('ProgressManager: Some progress failed to save');
        return false;
      }
    } catch (error) {
      console.error('ProgressManager: Error saving all progress:', error);
      return false;
    }
  }

  // Tüm Progress'i Yükleme
  static async loadAllProgress() {
    try {
      const [playerData, gameStats, achievements, dailyRewards, settings] = await Promise.all([
        this.loadPlayerData(),
        this.loadGameStats(),
        this.loadAchievements(),
        this.loadDailyRewards(),
        this.loadSettings(),
      ]);

      console.log('ProgressManager: All progress loaded');
      return {
        playerData,
        gameStats,
        achievements,
        dailyRewards,
        settings,
      };
    } catch (error) {
      console.error('ProgressManager: Error loading all progress:', error);
      return null;
    }
  }

  // Progress'i Sıfırlama
  static async resetAllProgress() {
    try {
      await AsyncStorage.multiRemove(Object.values(PROGRESS_KEYS));
      console.log('ProgressManager: All progress reset');
      return true;
    } catch (error) {
      console.error('ProgressManager: Error resetting progress:', error);
      return false;
    }
  }

  // Backup Oluşturma
  static async createBackup() {
    try {
      const allProgress = await this.loadAllProgress();
      const backup = {
        timestamp: Date.now(),
        version: '1.0.0',
        data: allProgress,
      };
      
      await AsyncStorage.setItem('game_backup', JSON.stringify(backup));
      console.log('ProgressManager: Backup created');
      return backup;
    } catch (error) {
      console.error('ProgressManager: Error creating backup:', error);
      return null;
    }
  }

  // Backup'dan Geri Yükleme
  static async restoreFromBackup() {
    try {
      const backupData = await AsyncStorage.getItem('game_backup');
      if (backupData) {
        const backup = JSON.parse(backupData);
        const { data } = backup;
        
        await this.saveAllProgress(
          data.playerData,
          data.gameStats,
          data.achievements,
          data.dailyRewards,
          data.settings
        );
        
        console.log('ProgressManager: Progress restored from backup');
        return true;
      }
      return false;
    } catch (error) {
      console.error('ProgressManager: Error restoring from backup:', error);
      return false;
    }
  }
}

export default ProgressManager;
