import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS, DEBUG } from '../constants/GameConfig';

const HUD = ({ score, coins, combo, bestScore, powerups, fps, ammo, stageName }) => {
  const comboScale = useRef(new Animated.Value(1)).current;
  const stageAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (combo > 1) {
      // Pulse animation for combo
      Animated.sequence([
        Animated.spring(comboScale, {
          toValue: 1.2,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.spring(comboScale, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [combo]);
  
  useEffect(() => {
    if (stageName) {
      // Stage change animation
      stageAnim.setValue(0);
      Animated.sequence([
        Animated.timing(stageAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(stageAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [stageName]);

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Debug FPS Counter */}
      {DEBUG.ENABLED && DEBUG.SHOW_FPS && fps !== undefined && (
        <View style={styles.fpsContainer}>
          <Text style={styles.fpsText}>FPS: {fps}</Text>
        </View>
      )}

      {/* Top HUD */}
      <View style={styles.topRow}>
        {/* Coins - Left */}
        <View style={styles.hudItem}>
          <Text style={styles.coinIcon}>⭐</Text>
          <Text style={styles.coinText}>{coins}</Text>
        </View>

        {/* Score - Center */}
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>{Math.floor(score)}</Text>
          {bestScore > 0 && (
            <Text style={styles.bestScoreText}>Best: {bestScore}</Text>
          )}
        </View>

        {/* Ammo - Right */}
        <View style={styles.hudItem}>
          <Text style={styles.ammoIcon}>🔫</Text>
          <Text style={[styles.coinText, ammo < 10 ? { color: COLORS.DANGER } : {}]}>
            {ammo || 0}
          </Text>
        </View>
      </View>

      {/* Stage Name - Centered */}
      {stageName && (
        <Animated.View
          style={[
            styles.stageContainer,
            {
              opacity: stageAnim,
              transform: [{
                translateY: stageAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              }],
            },
          ]}
        >
          <Text style={styles.stageText}>{stageName}</Text>
        </Animated.View>
      )}
      
      {/* Combo indicator - Bottom Center */}
      {combo > 1 && (
        <Animated.View 
          style={[
            styles.comboContainer,
            {
              transform: [{ scale: comboScale }],
            },
          ]}
        >
          <Text style={styles.comboText}>COMBO x{combo}</Text>
          <View style={styles.comboBar}>
            <View
              style={[
                styles.comboBarFill,
                { width: `${Math.min(100, combo * 10)}%` },
              ]}
            />
          </View>
          <Text style={styles.comboBonus}>+{combo * 10}% Points</Text>
        </Animated.View>
      )}

      {/* Power-up indicators - Bottom */}
      <View style={styles.powerupsContainer}>
        {powerups.shield && powerups.shield.active && (
          <View style={[styles.powerupBadge, styles.powerupShield]}>
            <Text style={styles.powerupIcon}>🛡️</Text>
            <Text style={styles.powerupText}>{powerups.shield.durability}</Text>
          </View>
        )}
        {powerups.slowTime && powerups.slowTime.active && (
          <View style={[styles.powerupBadge, styles.powerupSlowTime]}>
            <Text style={styles.powerupIcon}>⏱️</Text>
            <Text style={styles.powerupText}>{Math.ceil(powerups.slowTime.timer)}s</Text>
          </View>
        )}
        {powerups.magnet && powerups.magnet.active && (
          <View style={[styles.powerupBadge, styles.powerupMagnet]}>
            <Text style={styles.powerupIcon}>🧲</Text>
            <Text style={styles.powerupText}>{Math.ceil(powerups.magnet.timer)}s</Text>
          </View>
        )}
        {powerups.double && powerups.double.active && (
          <View style={[styles.powerupBadge, styles.powerupDouble]}>
            <Text style={styles.powerupIcon}>✖️2</Text>
            <Text style={styles.powerupText}>{Math.ceil(powerups.double.timer)}s</Text>
          </View>
        )}
      </View>

      {/* Tap instruction (subtle) */}
      <View style={styles.tapHintContainer}>
        <Text style={styles.tapHint}>TAP TO THRUST</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  fpsContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
    borderRadius: 5,
  },
  fpsText: {
    fontSize: 12,
    color: COLORS.SUCCESS,
    fontWeight: 'bold',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  hudItem: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 60,
  },
  coinIcon: {
    fontSize: 20,
    marginRight: 5,
  },
  ammoIcon: {
    fontSize: 20,
    marginRight: 5,
  },
  coinText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  stageContainer: {
    position: 'absolute',
    top: 120,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  stageText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.SECONDARY,
    textShadowColor: COLORS.SECONDARY,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
    letterSpacing: 3,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    textShadowColor: COLORS.PRIMARY,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  bestScoreText: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 2,
  },
  comboContainer: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  comboText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.ACCENT,
    textShadowColor: COLORS.ACCENT,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  comboBar: {
    width: 120,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    marginTop: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.ACCENT,
  },
  comboBarFill: {
    height: '100%',
    backgroundColor: COLORS.ACCENT,
  },
  comboBonus: {
    fontSize: 12,
    color: COLORS.ACCENT,
    marginTop: 4,
    fontWeight: 'bold',
  },
  powerupsContainer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 20,
  },
  powerupBadge: {
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
    padding: 8,
    alignItems: 'center',
    minWidth: 50,
  },
  powerupShield: {
    borderColor: COLORS.SUCCESS,
    backgroundColor: 'rgba(0, 255, 136, 0.2)',
  },
  powerupSlowTime: {
    borderColor: COLORS.SECONDARY,
    backgroundColor: 'rgba(255, 0, 255, 0.2)',
  },
  powerupMagnet: {
    borderColor: COLORS.ACCENT,
    backgroundColor: 'rgba(255, 255, 0, 0.2)',
  },
  powerupDouble: {
    borderColor: COLORS.DANGER,
    backgroundColor: 'rgba(255, 51, 102, 0.2)',
  },
  powerupIcon: {
    fontSize: 20,
  },
  powerupText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginTop: 2,
  },
  tapHintContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  tapHint: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    opacity: 0.5,
    letterSpacing: 2,
  },
});

export default HUD;
