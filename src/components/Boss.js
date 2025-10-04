import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../constants/GameConfig';

const Boss = ({ boss }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // Pulse animation
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

    // Glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.5,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const healthPercentage = (boss.health / boss.maxHealth) * 100;
  
  return (
    <Animated.View
      style={[
        styles.bossContainer,
        {
          left: boss.x - boss.size / 2,
          top: boss.y - boss.size / 2,
          width: boss.size,
          height: boss.size,
          transform: [{ scale: pulseAnim }],
        },
      ]}
    >
      {/* Boss Body */}
      <View style={styles.bossBody}>
        {/* Core */}
        <Animated.View style={[styles.bossCore, { opacity: glowAnim }]} />
        
        {/* Eyes */}
        <View style={[styles.bossEye, { left: '25%', top: '30%' }]} />
        <View style={[styles.bossEye, { right: '25%', top: '30%' }]} />
        
        {/* Mouth */}
        <View style={styles.bossMouth} />
      </View>

      {/* Health Bar */}
      <View style={styles.healthBarContainer}>
        <View style={styles.healthBarBg}>
          <View 
            style={[
              styles.healthBarFill,
              { 
                width: `${healthPercentage}%`,
                backgroundColor: healthPercentage > 50 ? COLORS.SUCCESS : 
                               healthPercentage > 25 ? COLORS.ACCENT : COLORS.DANGER
              }
            ]} 
          />
        </View>
        <Text style={styles.healthText}>{boss.health}/{boss.maxHealth}</Text>
      </View>

      {/* Boss Name */}
      <View style={styles.nameTag}>
        <Text style={styles.bossName}>{boss.name}</Text>
      </View>

      {/* Glow Effect */}
      <Animated.View style={[styles.bossGlow, { opacity: glowAnim }]} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bossContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bossBody: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.DANGER,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: '#ff0033',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: COLORS.DANGER,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
  },
  bossCore: {
    width: '60%',
    height: '60%',
    backgroundColor: '#ff6688',
    borderRadius: 100,
    position: 'absolute',
  },
  bossEye: {
    width: 20,
    height: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#000',
  },
  bossMouth: {
    width: '50%',
    height: 15,
    backgroundColor: '#000',
    borderRadius: 10,
    position: 'absolute',
    bottom: '20%',
  },
  healthBarContainer: {
    position: 'absolute',
    top: -25,
    width: '120%',
    alignItems: 'center',
  },
  healthBarBg: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#fff',
  },
  healthBarFill: {
    height: '100%',
  },
  healthText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 2,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  nameTag: {
    position: 'absolute',
    top: -45,
    backgroundColor: 'rgba(255, 0, 51, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#fff',
  },
  bossName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  bossGlow: {
    position: 'absolute',
    width: '150%',
    height: '150%',
    backgroundColor: COLORS.DANGER,
    borderRadius: 100,
    zIndex: -1,
  },
});

export default Boss;

