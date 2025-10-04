import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../constants/GameConfig';

const Entity = ({ entity }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Rotation animation for asteroids
    if (entity.type.includes('asteroid')) {
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 360,
          duration: 3000 / (entity.speed / 100), // Faster rotation for faster asteroids
          useNativeDriver: true,
        })
      ).start();
    }

    // Pulse animation for stars and power-ups
    if (entity.type === 'star' || entity.type === 'ammo') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, []);

  const renderEntity = () => {
    const y = entity.y + (entity.oscillationOffset || 0);
    const rotation = rotateAnim.interpolate({
      inputRange: [0, 360],
      outputRange: ['0deg', '360deg'],
    });

    switch (entity.type) {
      case 'star':
        return (
          <Animated.View
            style={[
              styles.starContainer,
              {
                left: entity.x - entity.size / 2,
                top: y - entity.size / 2,
                width: entity.size,
                height: entity.size,
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <View style={styles.starOuter}>
              <View style={styles.starInner} />
            </View>
            <View style={styles.starGlow} />
          </Animated.View>
        );

      case 'asteroidSmall':
      case 'asteroidMed':
      case 'asteroidBig':
        const asteroidSize = entity.type === 'asteroidSmall' ? 'small' : 
                           entity.type === 'asteroidMed' ? 'med' : 'big';
        return (
          <Animated.View
            style={[
              styles.asteroid,
              {
                left: entity.x - entity.size / 2,
                top: y - entity.size / 2,
                width: entity.size,
                height: entity.size,
                borderRadius: entity.size / 2,
                transform: [{ rotate: rotation }],
              },
            ]}
          >
            {/* Asteroid layers for depth */}
            <View style={[styles.asteroidLayer, { width: entity.size * 0.7, height: entity.size * 0.7 }]} />
            <View style={[styles.asteroidCore, { width: entity.size * 0.4, height: entity.size * 0.4 }]} />
            
            {/* Crater details */}
            <View style={[styles.crater, styles.crater1, { 
              width: entity.size * 0.15, 
              height: entity.size * 0.15,
              top: entity.size * 0.2,
              left: entity.size * 0.3,
            }]} />
            <View style={[styles.crater, styles.crater2, { 
              width: entity.size * 0.12, 
              height: entity.size * 0.12,
              top: entity.size * 0.6,
              left: entity.size * 0.5,
            }]} />
          </Animated.View>
        );

      case 'enemyDrone':
        return (
          <Animated.View
            style={[
              styles.drone,
              {
                left: entity.x - entity.size / 2,
                top: y - entity.size / 2,
                width: entity.size,
                height: entity.size,
              },
            ]}
          >
            {/* Drone body */}
            <View style={styles.droneBody}>
              <View style={styles.droneCore} />
              <View style={styles.droneEye} />
            </View>
            
            {/* Drone wings */}
            <View style={[styles.droneWing, styles.droneWingLeft]} />
            <View style={[styles.droneWing, styles.droneWingRight]} />
            
            {/* Danger glow */}
            <View style={styles.droneGlow} />
          </Animated.View>
        );
      
      case 'ammo':
        return (
          <Animated.View
            style={[
              styles.ammoContainer,
              {
                left: entity.x - entity.size / 2,
                top: y - entity.size / 2,
                width: entity.size,
                height: entity.size,
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <View style={styles.ammoBox}>
              <View style={styles.ammoIcon} />
            </View>
            <View style={styles.ammoGlow} />
          </Animated.View>
        );

      default:
        return null;
    }
  };

  return renderEntity();
};

const styles = StyleSheet.create({
  // Star styles
  starContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  starOuter: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    backgroundColor: COLORS.STAR,
  },
  starInner: {
    width: '60%',
    height: '60%',
    backgroundColor: '#fff',
    borderRadius: 100,
  },
  starGlow: {
    position: 'absolute',
    width: '140%',
    height: '140%',
    backgroundColor: COLORS.STAR,
    borderRadius: 100,
    opacity: 0.3,
  },

  // Asteroid styles
  asteroid: {
    position: 'absolute',
    backgroundColor: '#666',
    borderWidth: 2,
    borderColor: '#888',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  asteroidLayer: {
    position: 'absolute',
    backgroundColor: '#555',
    borderRadius: 1000,
  },
  asteroidCore: {
    position: 'absolute',
    backgroundColor: '#777',
    borderRadius: 1000,
  },
  crater: {
    position: 'absolute',
    backgroundColor: '#444',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#333',
  },
  crater1: {},
  crater2: {},

  // Enemy drone styles
  drone: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  droneBody: {
    width: '80%',
    height: '60%',
    backgroundColor: COLORS.DANGER,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ff6688',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.DANGER,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  droneCore: {
    width: '50%',
    height: '50%',
    backgroundColor: '#ff0033',
    borderRadius: 100,
  },
  droneEye: {
    position: 'absolute',
    width: '30%',
    height: '30%',
    backgroundColor: '#fff',
    borderRadius: 100,
    top: '20%',
  },
  droneWing: {
    position: 'absolute',
    width: '25%',
    height: '40%',
    backgroundColor: COLORS.DANGER,
    opacity: 0.6,
  },
  droneWingLeft: {
    left: -5,
    transform: [{ skewY: '-15deg' }],
  },
  droneWingRight: {
    right: -5,
    transform: [{ skewY: '15deg' }],
  },
  droneGlow: {
    position: 'absolute',
    width: '150%',
    height: '150%',
    backgroundColor: COLORS.DANGER,
    borderRadius: 100,
    opacity: 0.2,
  },
  
  // Ammo pickup styles
  ammoContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ammoBox: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FF8800',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#FFAA00',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF8800',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  ammoIcon: {
    width: '50%',
    height: '50%',
    backgroundColor: '#FFD700',
    borderRadius: 2,
  },
  ammoGlow: {
    position: 'absolute',
    width: '150%',
    height: '150%',
    backgroundColor: '#FF8800',
    borderRadius: 8,
    opacity: 0.3,
  },
});

export default Entity;
