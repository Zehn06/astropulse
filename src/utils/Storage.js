import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  COINS: '@astropulse_coins',
  BEST_SCORE: '@astropulse_best_score',
  SELECTED_SHIP: '@astropulse_selected_ship',
  UPGRADE_THRUST: '@astropulse_upgrade_thrust',
  HAS_REMOVED_ADS: '@astropulse_has_removed_ads',
  DAILY_CLAIMED_DATE: '@astropulse_daily_claimed',
  FIRST_TIME: '@astropulse_first_time',
};

class Storage {
  // Get coins
  async getCoins() {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEYS.COINS);
      return value !== null ? parseInt(value, 10) : 0;
    } catch (error) {
      console.error('Error getting coins:', error);
      return 0;
    }
  }

  // Set coins
  async setCoins(coins) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.COINS, coins.toString());
    } catch (error) {
      console.error('Error setting coins:', error);
    }
  }

  // Add coins
  async addCoins(amount) {
    const currentCoins = await this.getCoins();
    await this.setCoins(currentCoins + amount);
    return currentCoins + amount;
  }

  // Get best score
  async getBestScore() {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEYS.BEST_SCORE);
      return value !== null ? parseInt(value, 10) : 0;
    } catch (error) {
      console.error('Error getting best score:', error);
      return 0;
    }
  }

  // Set best score
  async setBestScore(score) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.BEST_SCORE, score.toString());
    } catch (error) {
      console.error('Error setting best score:', error);
    }
  }

  // Update best score if higher
  async updateBestScore(score) {
    const bestScore = await this.getBestScore();
    if (score > bestScore) {
      await this.setBestScore(score);
      return true; // New record!
    }
    return false;
  }

  // Get upgrade level
  async getUpgradeLevel(upgradeName) {
    try {
      const value = await AsyncStorage.getItem(`@astropulse_upgrade_${upgradeName}`);
      return value !== null ? parseInt(value, 10) : 0;
    } catch (error) {
      console.error('Error getting upgrade level:', error);
      return 0;
    }
  }

  // Set upgrade level
  async setUpgradeLevel(upgradeName, level) {
    try {
      await AsyncStorage.setItem(`@astropulse_upgrade_${upgradeName}`, level.toString());
    } catch (error) {
      console.error('Error setting upgrade level:', error);
    }
  }

  // Check if first time playing
  async isFirstTime() {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEYS.FIRST_TIME);
      return value === null;
    } catch (error) {
      console.error('Error checking first time:', error);
      return true;
    }
  }

  // Mark as not first time
  async setNotFirstTime() {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.FIRST_TIME, 'false');
    } catch (error) {
      console.error('Error setting first time:', error);
    }
  }

  // Clear all data (for testing)
  async clearAll() {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
}

export default new Storage();

