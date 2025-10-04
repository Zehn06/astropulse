import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../constants/GameConfig';

const GameOver = ({ score, coins, bestScore, isNewRecord, onRetry, onMenu }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Game Over Title */}
        <Text style={styles.title}>GAME OVER</Text>

        {/* New Record Badge */}
        {isNewRecord && (
          <View style={styles.recordBadge}>
            <Text style={styles.recordText}>🏆 NEW RECORD! 🏆</Text>
          </View>
        )}

        {/* Score Display */}
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>SCORE</Text>
          <Text style={styles.scoreValue}>{score}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Best</Text>
            <Text style={styles.statValue}>{bestScore}</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Earned</Text>
            <View style={styles.coinRow}>
              <Text style={styles.coinIcon}>⭐</Text>
              <Text style={styles.statValue}>{coins}</Text>
            </View>
          </View>
        </View>

        {/* Buttons */}
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryButtonText}>↻ RETRY</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.continueButton}>
          <Text style={styles.continueButtonText}>📺 Continue (Watch Ad)</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shareButton}>
          <Text style={styles.shareButtonText}>📤 Share Score</Text>
        </TouchableOpacity>

        {/* Menu Button */}
        <TouchableOpacity style={styles.menuButton} onPress={onMenu}>
          <Text style={styles.menuButtonText}>Main Menu</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(10, 14, 39, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.DANGER,
    textShadowColor: COLORS.DANGER,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    marginBottom: 20,
    letterSpacing: 2,
  },
  recordBadge: {
    backgroundColor: COLORS.ACCENT,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 20,
  },
  recordText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.BACKGROUND,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 30,
    padding: 20,
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
    width: '100%',
  },
  scoreLabel: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 5,
  },
  scoreValue: {
    fontSize: 56,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
  },
  statItem: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    minWidth: 100,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  coinRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinIcon: {
    fontSize: 20,
    marginRight: 5,
  },
  retryButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 60,
    paddingVertical: 18,
    borderRadius: 30,
    marginBottom: 15,
    width: '100%',
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
  },
  retryButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.BACKGROUND,
    textAlign: 'center',
    letterSpacing: 1,
  },
  continueButton: {
    backgroundColor: COLORS.SUCCESS,
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
    width: '100%',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.BACKGROUND,
    textAlign: 'center',
  },
  shareButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.TEXT_SECONDARY,
  },
  shareButtonText: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
  },
  menuButton: {
    marginTop: 10,
    padding: 10,
  },
  menuButtonText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
});

export default GameOver;

