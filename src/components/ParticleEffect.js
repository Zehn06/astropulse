import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../constants/GameConfig';

const ParticleEffect = ({ x, y, type = 'explosion', onComplete }) => {
  const particles = useRef([...Array(8)].map(() => ({
    x: new Animated.Value(0),
    y: new Animated.Value(0),
    opacity: new Animated.Value(1),
    angle: Math.random() * Math.PI * 2,
  }))).current;

  useEffect(() => {
    animateParticles();
  }, []);

  const animateParticles = () => {
    const animations = particles.map((particle) => {
      const distance = 30 + Math.random() * 30;
      const endX = Math.cos(particle.angle) * distance;
      const endY = Math.sin(particle.angle) * distance;

      return Animated.parallel([
        Animated.timing(particle.x, {
          toValue: endX,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(particle.y, {
          toValue: endY,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(particle.opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]);
    });

    Animated.parallel(animations).start(() => {
      if (onComplete) onComplete();
    });
  };

  const getColor = () => {
    switch (type) {
      case 'explosion':
        return COLORS.DANGER;
      case 'collect':
        return COLORS.STAR;
      case 'powerup':
        return COLORS.SUCCESS;
      default:
        return COLORS.PRIMARY;
    }
  };

  return (
    <View style={[styles.container, { left: x, top: y }]}>
      {particles.map((particle, index) => (
        <Animated.View
          key={index}
          style={[
            styles.particle,
            {
              backgroundColor: getColor(),
              transform: [
                { translateX: particle.x },
                { translateY: particle.y },
              ],
              opacity: particle.opacity,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 1,
    height: 1,
  },
  particle: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});

export default ParticleEffect;

