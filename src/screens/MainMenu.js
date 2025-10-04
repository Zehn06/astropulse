import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../constants/GameConfig';
import Storage from '../utils/Storage';

const MainMenu = ({ onPlay, onShop, onMissions, onSettings, onLeaderboard, onDailyReward, bestScore: propBestScore }) => {
  const [coins, setCoins] = useState(0);
  const [bestScore, setBestScore] = useState(propBestScore || 0);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadData();
    startPulseAnimation();
  }, []);

  useEffect(() => {
    if (propBestScore !== undefined) {
      setBestScore(propBestScore);
    }
  }, [propBestScore]);

  const loadData = async () => {
    const loadedCoins = await Storage.getCoins();
    const loadedBestScore = await Storage.getBestScore();
    setCoins(loadedCoins);
    setBestScore(loadedBestScore);
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>ASTRO</Text>
        <Text style={[styles.title, styles.titlePulse]}>PULSE</Text>
      </View>

      {/* Subtitle */}
      <Text style={styles.subtitle}>Tap to survive the cosmos</Text>

      {/* Best Score */}
      {bestScore > 0 && (
        <View style={styles.statsContainer}>
          <Text style={styles.statsLabel}>BEST SCORE</Text>
          <Text style={styles.statsValue}>{bestScore}</Text>
        </View>
      )}

      {/* Coins */}
      <View style={styles.coinsContainer}>
        <Text style={styles.coinIcon}>⭐</Text>
        <Text style={styles.coinsText}>{coins}</Text>
      </View>

      {/* Play Button */}
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <TouchableOpacity style={styles.playButton} onPress={onPlay}>
          <Text style={styles.playButtonText}>PLAY</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Secondary Buttons */}
      <View style={styles.secondaryButtons}>
        <TouchableOpacity style={styles.secondaryButton} onPress={onLeaderboard}>
          <Text style={styles.secondaryButtonText}>🏆 Leaderboard</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.secondaryButton} onPress={onDailyReward}>
          <Text style={styles.secondaryButtonText}>🎁 Daily Reward</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.iconButton} onPress={onShop}>
          <Text style={styles.iconButtonText}>🛒</Text>
          <Text style={styles.iconButtonLabel}>Shop</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={onMissions}>
          <Text style={styles.iconButtonText}>🎯</Text>
          <Text style={styles.iconButtonLabel}>Missions</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={onSettings}>
          <Text style={styles.iconButtonText}>⚙️</Text>
          <Text style={styles.iconButtonLabel}>Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Version */}
      <Text style={styles.version}>v1.0.0</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 56,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    textShadowColor: COLORS.PRIMARY,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    letterSpacing: 4,
  },
  titlePulse: {
    color: COLORS.SECONDARY,
    textShadowColor: COLORS.SECONDARY,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 40,
    fontStyle: 'italic',
  },
  statsContainer: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    minWidth: 200,
  },
  statsLabel: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 5,
  },
  statsValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  coinsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    padding: 10,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 20,
  },
  coinIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  coinsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.STAR,
  },
  playButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 80,
    paddingVertical: 20,
    borderRadius: 30,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  playButtonText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.BACKGROUND,
    letterSpacing: 2,
  },
  secondaryButtons: {
    flexDirection: 'row',
    marginTop: 30,
    gap: 15,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.TEXT_SECONDARY,
  },
  secondaryButtonText: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
  },
  bottomButtons: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    gap: 20,
  },
  iconButton: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.TEXT_SECONDARY,
  },
  iconButtonText: {
    fontSize: 24,
    marginBottom: 4,
  },
  iconButtonLabel: {
    fontSize: 10,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: 'bold',
  },
  version: {
    position: 'absolute',
    bottom: 10,
    fontSize: 10,
    color: COLORS.TEXT_SECONDARY,
  },
});

export default MainMenu;

