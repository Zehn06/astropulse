import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
} from 'react-native';
import { COLORS } from '../constants/GameConfig';
import PlayerData from '../utils/PlayerData';

const DailyRewardScreen = ({ onBack, onClaim }) => {
  const [playerData, setPlayerData] = useState(null);
  const [canClaim, setCanClaim] = useState(false);
  const [currentDay, setCurrentDay] = useState(1);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const rewards = [
    { day: 1, coins: 50, gems: 0 },
    { day: 2, coins: 100, gems: 0 },
    { day: 3, coins: 150, gems: 5 },
    { day: 4, coins: 200, gems: 0 },
    { day: 5, coins: 300, gems: 10 },
    { day: 6, coins: 400, gems: 0 },
    { day: 7, coins: 1000, gems: 50 },
  ];

  useEffect(() => {
    loadData();
    startPulseAnimation();
  }, []);

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

  const loadData = async () => {
    const data = await PlayerData.load();
    setPlayerData(data);
    
    // Check if can claim (simplified logic)
    const lastClaimDate = data.lastDailyReward || 0;
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    setCanClaim(now - lastClaimDate > oneDayMs);
    setCurrentDay((data.dailyRewardStreak || 0) + 1);
  };

  const handleClaim = async () => {
    if (!canClaim || !playerData) return;
    
    const reward = rewards[(currentDay - 1) % 7];
    
    // Add rewards
    await PlayerData.addCoins(reward.coins);
    if (reward.gems > 0) {
      await PlayerData.addGems(reward.gems);
    }
    
    // Update streak
    const updated = await PlayerData.load();
    updated.dailyRewardStreak = currentDay % 7 === 0 ? 0 : currentDay;
    updated.lastDailyReward = Date.now();
    await PlayerData.save();
    
    // Notify parent and close
    if (onClaim) {
      onClaim(reward);
    }
    onBack();
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        
        <Text style={styles.title}>DAILY REWARD</Text>
        
        <View style={styles.backButton} />
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>Claim your daily reward!</Text>
        <Text style={styles.streakText}>Day {currentDay} of 7</Text>

        {/* Rewards Grid */}
        <View style={styles.rewardsGrid}>
          {rewards.map((reward, index) => {
            const isClaimed = index < (currentDay - 1);
            const isCurrent = index === (currentDay - 1);
            
            return (
              <Animated.View
                key={reward.day}
                style={[
                  styles.rewardCard,
                  isClaimed && styles.rewardCardClaimed,
                  isCurrent && styles.rewardCardCurrent,
                  isCurrent && canClaim && { transform: [{ scale: pulseAnim }] },
                ]}
              >
                <Text style={styles.dayText}>Day {reward.day}</Text>
                
                <View style={styles.rewardContent}>
                  {reward.coins > 0 && (
                    <Text style={styles.rewardAmount}>
                      ⭐ {reward.coins}
                    </Text>
                  )}
                  {reward.gems > 0 && (
                    <Text style={styles.rewardAmount}>
                      💎 {reward.gems}
                    </Text>
                  )}
                </View>
                
                {isClaimed && (
                  <View style={styles.claimedBadge}>
                    <Text style={styles.claimedText}>✓</Text>
                  </View>
                )}
                
                {reward.day === 7 && (
                  <View style={styles.bonusBadge}>
                    <Text style={styles.bonusText}>BONUS!</Text>
                  </View>
                )}
              </Animated.View>
            );
          })}
        </View>

        {/* Claim Button */}
        {canClaim ? (
          <TouchableOpacity style={styles.claimButton} onPress={handleClaim}>
            <Text style={styles.claimButtonText}>CLAIM REWARD!</Text>
            <Text style={styles.claimButtonSub}>
              ⭐ {rewards[(currentDay - 1) % 7].coins}
              {rewards[(currentDay - 1) % 7].gems > 0 && 
                ` + 💎 ${rewards[(currentDay - 1) % 7].gems}`}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.alreadyClaimedContainer}>
            <Text style={styles.alreadyClaimedText}>✓ Already Claimed Today</Text>
            <Text style={styles.alreadyClaimedSub}>Come back tomorrow!</Text>
          </View>
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
    borderBottomColor: 'rgba(0, 212, 255, 0.2)',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 32,
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    letterSpacing: 2,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: 10,
  },
  streakText: {
    fontSize: 16,
    color: COLORS.ACCENT,
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: 'bold',
  },
  rewardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 30,
  },
  rewardCard: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
  },
  rewardCardClaimed: {
    opacity: 0.5,
  },
  rewardCardCurrent: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: 'rgba(0, 212, 255, 0.15)',
  },
  dayText: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 8,
  },
  rewardContent: {
    alignItems: 'center',
  },
  rewardAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  claimedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.SUCCESS,
    justifyContent: 'center',
    alignItems: 'center',
  },
  claimedText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  bonusBadge: {
    position: 'absolute',
    top: -8,
    left: -8,
    backgroundColor: COLORS.ACCENT,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bonusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.BACKGROUND,
  },
  claimButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  claimButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.BACKGROUND,
    letterSpacing: 2,
  },
  claimButtonSub: {
    fontSize: 16,
    color: COLORS.BACKGROUND,
    marginTop: 5,
  },
  alreadyClaimedContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  alreadyClaimedText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.SUCCESS,
    marginBottom: 10,
  },
  alreadyClaimedSub: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
  },
});

export default DailyRewardScreen;

