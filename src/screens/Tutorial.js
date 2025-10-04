import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../constants/GameConfig';

const Tutorial = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleNext = () => {
    if (step < 3) {
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setStep(step + 1);
        // Fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const getTutorialContent = () => {
    switch (step) {
      case 1:
        return {
          icon: '👆',
          title: 'Tap to Thrust',
          description: 'Tap anywhere on the screen to give your ship an upward boost. Release to let gravity pull you down.',
        };
      case 2:
        return {
          icon: '⭐',
          title: 'Collect Stars',
          description: 'Collect stars to earn points and coins. Chain them together for combo multipliers!',
        };
      case 3:
        return {
          icon: '☄️',
          title: 'Avoid Obstacles',
          description: 'Watch out for asteroids and enemy drones. One hit and it\'s game over!',
        };
      default:
        return {};
    }
  };

  const content = getTutorialContent();

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Tutorial Icon */}
        <Text style={styles.icon}>{content.icon}</Text>

        {/* Title */}
        <Text style={styles.title}>{content.title}</Text>

        {/* Description */}
        <Text style={styles.description}>{content.description}</Text>

        {/* Step Indicator */}
        <View style={styles.stepIndicator}>
          {[1, 2, 3].map((s) => (
            <View
              key={s}
              style={[
                styles.stepDot,
                s === step && styles.stepDotActive,
              ]}
            />
          ))}
        </View>

        {/* Next Button */}
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {step === 3 ? 'Start Playing!' : 'Next'}
          </Text>
        </TouchableOpacity>

        {/* Skip Button */}
        {step < 3 && (
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Skip Tutorial</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
  },
  icon: {
    fontSize: 80,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 40,
  },
  stepIndicator: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 5,
  },
  stepDotActive: {
    backgroundColor: COLORS.PRIMARY,
    width: 30,
  },
  nextButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 60,
    paddingVertical: 18,
    borderRadius: 30,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    marginBottom: 15,
  },
  nextButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.BACKGROUND,
  },
  skipButton: {
    padding: 10,
  },
  skipButtonText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
});

export default Tutorial;

