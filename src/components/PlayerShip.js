import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { COLORS, PLAYER } from '../constants/GameConfig';

const PlayerShip = ({ x, y, rotation = 0, isThrusting = false, velocityY = 0 }) => {
  const thrusterOpacity = useRef(new Animated.Value(0)).current;
  const shipScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isThrusting) {
      // Thruster pulse animation
      Animated.parallel([
        Animated.timing(thrusterOpacity, {
          toValue: 1,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.spring(shipScale, {
          toValue: 1.1,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(thrusterOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.spring(shipScale, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isThrusting]);

  // Calculate tilt based on velocity
  const tilt = Math.max(-15, Math.min(15, velocityY * 0.03));

  return (
    <Animated.View
      style={[
        styles.container,
        {
          left: x - PLAYER.SIZE / 2,
          top: y - PLAYER.SIZE / 2,
          transform: [
            { rotate: `${rotation + tilt}deg` },
            { scale: shipScale },
          ],
        },
      ]}
    >
      {/* Ship body - triangle with gradient effect */}
      <View style={styles.shipBody}>
        <View style={styles.triangleContainer}>
          <View style={[styles.triangle, styles.triangleMain]} />
          <View style={[styles.triangle, styles.triangleGlow]} />
        </View>
        
        {/* Ship core - glowing center */}
        <View style={styles.shipCore} />
        
        {/* Ship wings */}
        <View style={styles.wingTop} />
        <View style={styles.wingBottom} />
      </View>

      {/* Thruster glow effect */}
      <Animated.View
        style={[
          styles.thrusterContainer,
          {
            opacity: thrusterOpacity,
          },
        ]}
      >
        <View style={[styles.thruster, styles.thruster1]} />
        <View style={[styles.thruster, styles.thruster2]} />
        <View style={[styles.thruster, styles.thruster3]} />
        
        {/* Thruster particles */}
        <View style={styles.thrusterParticle1} />
        <View style={styles.thrusterParticle2} />
      </Animated.View>

      {/* Ship aura/glow */}
      <View style={styles.shipAura} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: PLAYER.SIZE,
    height: PLAYER.SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shipBody: {
    width: PLAYER.SIZE,
    height: PLAYER.SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  triangleContainer: {
    position: 'absolute',
    width: PLAYER.SIZE,
    height: PLAYER.SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  triangle: {
    position: 'absolute',
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: PLAYER.SIZE / 3,
    borderRightWidth: PLAYER.SIZE / 3,
    borderBottomWidth: PLAYER.SIZE,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    transform: [{ rotate: '90deg' }],
  },
  triangleMain: {
    borderBottomColor: COLORS.PRIMARY,
  },
  triangleGlow: {
    borderBottomColor: COLORS.PRIMARY,
    opacity: 0.3,
    transform: [{ rotate: '90deg' }, { scale: 1.2 }],
  },
  shipCore: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  wingTop: {
    position: 'absolute',
    top: 15,
    left: 5,
    width: 12,
    height: 3,
    backgroundColor: COLORS.SECONDARY,
    borderRadius: 2,
    opacity: 0.8,
  },
  wingBottom: {
    position: 'absolute',
    bottom: 15,
    left: 5,
    width: 12,
    height: 3,
    backgroundColor: COLORS.SECONDARY,
    borderRadius: 2,
    opacity: 0.8,
  },
  shipAura: {
    position: 'absolute',
    width: PLAYER.SIZE * 1.5,
    height: PLAYER.SIZE * 1.5,
    borderRadius: PLAYER.SIZE * 0.75,
    backgroundColor: COLORS.PRIMARY,
    opacity: 0.1,
  },
  thrusterContainer: {
    position: 'absolute',
    left: -20,
    width: 25,
    height: 35,
    justifyContent: 'center',
  },
  thruster: {
    position: 'absolute',
    left: 0,
    height: 4,
    backgroundColor: COLORS.ACCENT,
    borderRadius: 2,
    shadowColor: COLORS.ACCENT,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  thruster1: {
    top: 12,
    width: 18,
  },
  thruster2: {
    top: 18,
    width: 22,
  },
  thruster3: {
    top: 24,
    width: 16,
  },
  thrusterParticle1: {
    position: 'absolute',
    left: -5,
    top: 15,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.DANGER,
    opacity: 0.8,
  },
  thrusterParticle2: {
    position: 'absolute',
    left: -8,
    top: 22,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.ACCENT,
    opacity: 0.6,
  },
});

export default PlayerShip;
