import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { COLORS } from '../constants/GameConfig';
import PlayerData from '../utils/PlayerData';

const LeaderboardScreen = ({ onBack }) => {
  const [playerData, setPlayerData] = useState(null);
  const [selectedTab, setSelectedTab] = useState('global');
  
  // Mock leaderboard data (in production, this would come from a server)
  const mockGlobalLeaderboard = [
    { rank: 1, name: 'SpaceAce', score: 5000, avatar: '🚀' },
    { rank: 2, name: 'StarHunter', score: 4500, avatar: '⭐' },
    { rank: 3, name: 'CosmicRider', score: 4000, avatar: '🌟' },
    { rank: 4, name: 'NebulaNinja', score: 3500, avatar: '👾' },
    { rank: 5, name: 'GalaxyGuard', score: 3000, avatar: '🛸' },
  ];

  useEffect(() => {
    loadData();
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        
        <Text style={styles.title}>LEADERBOARD</Text>
        
        <View style={styles.backButton} />
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'global' && styles.tabActive]}
          onPress={() => setSelectedTab('global')}
        >
          <Text style={[styles.tabText, selectedTab === 'global' && styles.tabTextActive]}>
            GLOBAL
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'friends' && styles.tabActive]}
          onPress={() => setSelectedTab('friends')}
        >
          <Text style={[styles.tabText, selectedTab === 'friends' && styles.tabTextActive]}>
            FRIENDS
          </Text>
        </TouchableOpacity>
      </View>

      {/* Your Rank Card */}
      <View style={styles.yourRankCard}>
        <Text style={styles.yourRankLabel}>YOUR RANK</Text>
        <View style={styles.yourRankContent}>
          <Text style={styles.yourRankNumber}>#???</Text>
          <View style={styles.yourRankInfo}>
            <Text style={styles.yourRankScore}>{playerData.bestScore}</Text>
            <Text style={styles.yourRankScoreLabel}>Best Score</Text>
          </View>
        </View>
      </View>

      {/* Leaderboard List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {selectedTab === 'global' ? (
          <View style={styles.list}>
            {mockGlobalLeaderboard.map((entry, index) => (
              <View
                key={index}
                style={[
                  styles.leaderboardEntry,
                  entry.rank <= 3 && styles.topThreeEntry,
                ]}
              >
                <View style={[styles.rankBadge, entry.rank <= 3 && styles.topThreeRank]}>
                  <Text style={styles.rankText}>#{entry.rank}</Text>
                </View>
                
                <Text style={styles.avatar}>{entry.avatar}</Text>
                
                <View style={styles.entryInfo}>
                  <Text style={styles.entryName}>{entry.name}</Text>
                  <Text style={styles.entryScore}>{entry.score.toLocaleString()}</Text>
                </View>
                
                {entry.rank === 1 && <Text style={styles.crownIcon}>👑</Text>}
                {entry.rank === 2 && <Text style={styles.medalIcon}>🥈</Text>}
                {entry.rank === 3 && <Text style={styles.medalIcon}>🥉</Text>}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.comingSoonContainer}>
            <Text style={styles.comingSoonIcon}>👥</Text>
            <Text style={styles.comingSoonText}>Friends Leaderboard</Text>
            <Text style={styles.comingSoonSub}>Coming Soon!</Text>
            <Text style={styles.comingSoonHint}>Connect with friends to compete</Text>
          </View>
        )}
      </ScrollView>
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
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 15,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: COLORS.PRIMARY,
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.TEXT_SECONDARY,
    letterSpacing: 1,
  },
  tabTextActive: {
    color: COLORS.PRIMARY,
  },
  yourRankCard: {
    margin: 20,
    padding: 20,
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
  },
  yourRankLabel: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 10,
    letterSpacing: 1,
  },
  yourRankContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  yourRankNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  yourRankInfo: {
    flex: 1,
  },
  yourRankScore: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  yourRankScoreLabel: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  scrollView: {
    flex: 1,
  },
  list: {
    padding: 20,
  },
  leaderboardEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    marginBottom: 10,
    gap: 15,
  },
  topThreeEntry: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  rankBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topThreeRank: {
    backgroundColor: COLORS.ACCENT,
  },
  rankText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  avatar: {
    fontSize: 32,
  },
  entryInfo: {
    flex: 1,
  },
  entryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  entryScore: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  crownIcon: {
    fontSize: 24,
  },
  medalIcon: {
    fontSize: 20,
  },
  comingSoonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  comingSoonIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  comingSoonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  comingSoonSub: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 20,
  },
  comingSoonHint: {
    fontSize: 14,
    color: COLORS.ACCENT,
    fontStyle: 'italic',
  },
});

export default LeaderboardScreen;

