import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, SafeAreaView } from 'react-native';
import MainMenu from './screens/MainMenu';
import GameScreen from './screens/GameScreen';
import GameOver from './screens/GameOver';
import ShopScreen from './screens/ShopScreen';
import MissionsScreen from './screens/MissionsScreen';
import SettingsScreen from './screens/SettingsScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import DailyRewardScreen from './screens/DailyRewardScreen';
import { GAME_STATE, COLORS } from './constants/GameConfig';
import Storage from './utils/Storage';
import SoundManager from './utils/SoundManager';
import PlayerData from './utils/PlayerData';

const GameManager = () => {
  const [gameState, setGameState] = useState(GAME_STATE.MENU);
  const [gameOverData, setGameOverData] = useState(null);
  const [bestScore, setBestScore] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);
  const [showShop, setShowShop] = useState(false);
  const [showMissions, setShowMissions] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showDailyReward, setShowDailyReward] = useState(false);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    try {
      console.log('GameManager: Initializing...');
      
      // Initialize managers
      await SoundManager.initialize();
      console.log('GameManager: Sound initialized');
      
      // Load player data
      await PlayerData.load();
      console.log('GameManager: PlayerData loaded');
      
      // Load best score
      const loadedBestScore = await Storage.getBestScore();
      setBestScore(loadedBestScore);
      console.log('GameManager: Best score loaded:', loadedBestScore);

      // Check if first time (for tutorial)
      const isFirstTime = await Storage.isFirstTime();
      if (isFirstTime) {
        await Storage.setNotFirstTime();
        console.log('GameManager: First time user');
      }

      setIsInitialized(true);
      console.log('GameManager: Initialization complete!');
    } catch (err) {
      console.error('GameManager: Initialization error:', err);
      setError(err.message);
    }
  };

  const handlePlay = () => {
    console.log('GameManager: Starting game...');
    setGameState(GAME_STATE.PLAYING);
  };

  const handleGameOver = async (data) => {
    console.log('GameManager: Game over with data:', data);
    
    try {
      const loadedBestScore = await Storage.getBestScore();
      setBestScore(loadedBestScore);
      
      setGameOverData({
        ...data,
        bestScore: loadedBestScore,
      });
      setGameState(GAME_STATE.GAME_OVER);
    } catch (err) {
      console.error('GameManager: Game over error:', err);
    }
  };

  const handleRetry = () => {
    console.log('GameManager: Retrying...');
    setGameOverData(null);
    setGameState(GAME_STATE.PLAYING);
  };

  const handleMenu = () => {
    console.log('GameManager: Back to menu');
    setGameOverData(null);
    setShowShop(false);
    setShowMissions(false);
    setShowSettings(false);
    setShowLeaderboard(false);
    setShowDailyReward(false);
    setGameState(GAME_STATE.MENU);
  };

  const handleShop = () => {
    console.log('GameManager: Opening shop');
    setShowShop(true);
    setShowMissions(false);
    setShowSettings(false);
  };

  const handleCloseShop = () => {
    console.log('GameManager: Closing shop');
    setShowShop(false);
  };

  const handleMissions = () => {
    console.log('GameManager: Opening missions');
    setShowMissions(true);
    setShowShop(false);
    setShowSettings(false);
  };

  const handleCloseMissions = () => {
    console.log('GameManager: Closing missions');
    setShowMissions(false);
  };

  const handleSettings = () => {
    console.log('GameManager: Opening settings');
    setShowSettings(true);
    setShowShop(false);
    setShowMissions(false);
    setShowLeaderboard(false);
    setShowDailyReward(false);
  };

  const handleCloseSettings = () => {
    console.log('GameManager: Closing settings');
    setShowSettings(false);
  };
  
  const handleLeaderboard = () => {
    console.log('GameManager: Opening leaderboard');
    setShowLeaderboard(true);
    setShowShop(false);
    setShowMissions(false);
    setShowSettings(false);
    setShowDailyReward(false);
  };
  
  const handleCloseLeaderboard = () => {
    console.log('GameManager: Closing leaderboard');
    setShowLeaderboard(false);
  };
  
  const handleDailyReward = () => {
    console.log('GameManager: Opening daily reward');
    setShowDailyReward(true);
    setShowShop(false);
    setShowMissions(false);
    setShowSettings(false);
    setShowLeaderboard(false);
  };
  
  const handleCloseDailyReward = () => {
    console.log('GameManager: Closing daily reward');
    setShowDailyReward(false);
  };

  // Show loading screen
  if (!isInitialized) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          <Text style={styles.loadingText}>Loading AstroPulse...</Text>
          {error && (
            <Text style={styles.errorText}>Error: {error}</Text>
          )}
        </View>
      </SafeAreaView>
    );
  }

  // Render current screen
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        {showShop ? (
          <ShopScreen onBack={handleCloseShop} />
        ) : showMissions ? (
          <MissionsScreen onBack={handleCloseMissions} />
        ) : showSettings ? (
          <SettingsScreen onBack={handleCloseSettings} />
        ) : showLeaderboard ? (
          <LeaderboardScreen onBack={handleCloseLeaderboard} />
        ) : showDailyReward ? (
          <DailyRewardScreen onBack={handleCloseDailyReward} />
        ) : (
          <>
            {gameState === GAME_STATE.MENU && (
              <MainMenu 
                onPlay={handlePlay} 
                onShop={handleShop}
                onMissions={handleMissions}
                onSettings={handleSettings}
                onLeaderboard={handleLeaderboard}
                onDailyReward={handleDailyReward}
                bestScore={bestScore}
              />
            )}

            {gameState === GAME_STATE.PLAYING && (
              <GameScreen 
                key={Date.now()} // Force remount on each game start
                onGameOver={handleGameOver} 
              />
            )}

            {gameState === GAME_STATE.GAME_OVER && gameOverData && (
              <GameOver
                score={gameOverData.score}
                coins={gameOverData.coins}
                bestScore={gameOverData.bestScore}
                isNewRecord={gameOverData.isNewRecord}
                onRetry={handleRetry}
                onMenu={handleMenu}
              />
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
  },
  errorText: {
    marginTop: 10,
    fontSize: 14,
    color: COLORS.DANGER,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default GameManager;
