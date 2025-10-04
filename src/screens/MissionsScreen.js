import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
} from 'react-native';
import { COLORS } from '../constants/GameConfig';
import PlayerData from '../utils/PlayerData';
import SoundManager from '../utils/SoundManager';

const MissionsScreen = ({ onBack }) => {
  const [playerData, setPlayerData] = useState(null);
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadData();
    
    Animated.spring(slideAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
    
    const listener = (data) => setPlayerData(data);
    PlayerData.addListener(listener);
    
    return () => PlayerData.removeListener(listener);
  }, []);

  const loadData = async () => {
    const data = await PlayerData.load();
    setPlayerData(data);
  };

  if (!playerData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const opacity = slideAnim;
  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity, transform: [{ translateY }] }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          
          <Text style={styles.title}>MISSIONS</Text>
          
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Daily Missions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🌅 DAILY MISSIONS</Text>
            <Text style={styles.sectionSubtitle}>Resets in 23h 45m</Text>
            
            {playerData.dailyMissions && playerData.dailyMissions.map((mission, index) => {
              const progress = playerData.dailyMissionProgress[mission.id] || 0;
              const percent = Math.min((progress / mission.target) * 100, 100);
              const isComplete = percent >= 100;
              
              return (
                <View key={mission.id} style={[styles.missionCard, isComplete && styles.missionComplete]}>
                  <View style={styles.missionInfo}>
                    <Text style={styles.missionName}>{mission.name}</Text>
                    <Text style={styles.missionDescription}>{mission.description}</Text>
                    
                    {/* Progress Bar */}
                    <View style={styles.progressBar}>
                      <View style={[styles.progressFill, { width: `${percent}%` }]} />
                    </View>
                    <Text style={styles.progressText}>
                      {progress} / {mission.target}
                    </Text>
                  </View>
                  
                  <View style={styles.missionReward}>
                    <Text style={styles.rewardText}>⭐ {mission.rewards.coins}</Text>
                    <Text style={styles.rewardText}>💎 {mission.rewards.gems}</Text>
                  </View>
                  
                  {isComplete && (
                    <View style={styles.completeBadge}>
                      <Text style={styles.completeText}>✓ DONE</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          {/* Weekly Missions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📅 WEEKLY MISSIONS</Text>
            <Text style={styles.sectionSubtitle}>Resets in 5 days</Text>
            
            {playerData.weeklyMissions && playerData.weeklyMissions.map((mission) => {
              const progress = playerData.weeklyMissionProgress[mission.id] || 0;
              const percent = Math.min((progress / mission.target) * 100, 100);
              const isComplete = percent >= 100;
              
              return (
                <View key={mission.id} style={[styles.missionCard, styles.weeklyCard, isComplete && styles.missionComplete]}>
                  <View style={styles.missionInfo}>
                    <Text style={styles.missionName}>{mission.name}</Text>
                    <Text style={styles.missionDescription}>{mission.description}</Text>
                    
                    <View style={styles.progressBar}>
                      <View style={[styles.progressFill, styles.weeklyProgress, { width: `${percent}%` }]} />
                    </View>
                    <Text style={styles.progressText}>
                      {progress} / {mission.target}
                    </Text>
                  </View>
                  
                  <View style={styles.missionReward}>
                    <Text style={styles.rewardText}>⭐ {mission.rewards.coins}</Text>
                    <Text style={styles.rewardText}>💎 {mission.rewards.gems}</Text>
                  </View>
                  
                  {isComplete && (
                    <View style={[styles.completeBadge, styles.weeklyBadge]}>
                      <Text style={styles.completeText}>✓ DONE</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          {/* Coming Soon */}
          <View style={styles.comingSoon}>
            <Text style={styles.comingSoonText}>🎯 More missions coming soon!</Text>
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: COLORS.TEXT_PRIMARY,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    letterSpacing: 2,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 16,
  },
  missionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  weeklyCard: {
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
  },
  missionComplete: {
    borderColor: COLORS.SUCCESS,
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
  },
  missionInfo: {
    marginBottom: 12,
  },
  missionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  missionDescription: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 3,
  },
  weeklyProgress: {
    backgroundColor: COLORS.ACCENT,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  missionReward: {
    flexDirection: 'row',
    gap: 12,
  },
  rewardText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.ACCENT,
  },
  completeBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: COLORS.SUCCESS,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  weeklyBadge: {
    backgroundColor: COLORS.ACCENT,
  },
  completeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  comingSoon: {
    padding: 40,
    alignItems: 'center',
  },
  comingSoonText: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    fontStyle: 'italic',
  },
});

export default MissionsScreen;

