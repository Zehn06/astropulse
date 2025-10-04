import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient'; // Optional
import { COLORS } from '../constants/GameConfig';
import { SHIPS } from '../data/Ships';
import { BOOSTERS } from '../data/Boosters';
import PlayerData from '../utils/PlayerData';
import SoundManager from '../utils/SoundManager';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ShopScreen = ({ onBack }) => {
  const [playerData, setPlayerData] = useState(null);
  const [selectedTab, setSelectedTab] = useState('ships');
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [ammoLevel, setAmmoLevel] = useState(1);

  useEffect(() => {
    loadData();
    
    // Entrance animation
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
    setAmmoLevel(data.ammoLevel || 1);
  };

  const handlePurchaseShip = async (ship) => {
    if (!playerData) return;

    SoundManager.playUIClick();

    if (playerData.ownedShips.includes(ship.id)) {
      await PlayerData.selectShip(ship.id);
      Alert.alert('✓ Equipped', `${ship.name} is now active!`, [{ text: 'OK' }]);
      return;
    }

    if (ship.unlockRequirement) {
      const req = ship.unlockRequirement;
      if (req.score && playerData.bestScore < req.score) {
        Alert.alert('🔒 Locked', `Reach ${req.score.toLocaleString()} points to unlock`);
        return;
      }
    }

    Alert.alert(
      `Purchase ${ship.name}?`,
      ship.description + `\n\nCost: ${ship.price > 0 ? '⭐ ' + ship.price : '💎 ' + ship.priceGems}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Buy Now',
          onPress: async () => {
            const currency = ship.price > 0 ? 'coins' : 'gems';
            const amount = ship.price > 0 ? ship.price : ship.priceGems;
            const success = currency === 'coins' 
              ? await PlayerData.spendCoins(amount)
              : await PlayerData.spendGems(amount);
              
            if (success) {
              await PlayerData.purchaseShip(ship.id);
              await PlayerData.selectShip(ship.id);
              Alert.alert('🎉 Success!', `${ship.name} unlocked and equipped!`);
            } else {
              Alert.alert('❌ Not enough ' + (currency === 'coins' ? 'coins' : 'gems'));
            }
          },
        },
      ]
    );
  };

  const handlePurchaseBooster = async (booster) => {
    if (!playerData) return;

    SoundManager.playUIClick();

    Alert.alert(
      booster.name,
      booster.description + `\n\nCost: ${booster.price > 0 ? '⭐ ' + booster.price : '💎 ' + booster.priceGems}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Buy',
          onPress: async () => {
            const currency = booster.price > 0 ? 'coins' : 'gems';
            const amount = booster.price > 0 ? booster.price : booster.priceGems;
            const success = currency === 'coins'
              ? await PlayerData.spendCoins(amount)
              : await PlayerData.spendGems(amount);
              
            if (success) {
              await PlayerData.purchaseBooster(booster.id);
              Alert.alert('✓ Purchased', `${booster.name} added to inventory!`);
            } else {
              Alert.alert('❌ Insufficient ' + (currency === 'coins' ? 'coins' : 'gems'));
            }
          },
        },
      ]
    );
  };
  
  const handleUpgradeAmmo = async () => {
    if (!playerData) return;
    
    SoundManager.playUIClick();
    
    const nextLevel = ammoLevel + 1;
    const costs = [0, 200, 500, 1000, 2000, 4000, 8000];
    
    if (nextLevel > 7) {
      Alert.alert('MAX LEVEL', 'Ammo capacity is already at maximum!');
      return;
    }
    
    const cost = costs[nextLevel - 1];
    const currentMax = 50 * (1 + (ammoLevel - 1) * 0.5);
    const nextMax = 50 * (1 + nextLevel * 0.5 - 0.5);
    
    Alert.alert(
      `Upgrade Ammo Capacity?`,
      `Level ${ammoLevel} → Level ${nextLevel}\n\nMax Ammo: ${Math.floor(currentMax)} → ${Math.floor(nextMax)}\n\nCost: ⭐ ${cost}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Upgrade',
          onPress: async () => {
            const success = await PlayerData.spendCoins(cost);
            if (success) {
              await PlayerData.upgradeAmmo();
              setAmmoLevel(nextLevel);
              Alert.alert('🎉 Upgraded!', `Ammo capacity increased to ${Math.floor(nextMax)}!`);
            } else {
              Alert.alert('❌ Not Enough Coins', `You need ${cost} coins.`);
            }
          },
        },
      ]
    );
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
          
          <Text style={styles.title}>SHOP</Text>
          
          <View style={styles.currency}>
            <View style={styles.currencyItem}>
              <Text style={styles.currencyValue}>{playerData.coins}</Text>
              <Text style={styles.currencyLabel}>⭐</Text>
            </View>
            <View style={styles.currencyItem}>
              <Text style={styles.currencyValue}>{playerData.gems}</Text>
              <Text style={styles.currencyLabel}>💎</Text>
            </View>
          </View>
        </View>

        {/* Modern Tabs */}
        <View style={styles.tabBar}>
          {['ships', 'boosters', 'upgrades', 'gems'].map(tab => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                selectedTab === tab && styles.tabActive
              ]}
              onPress={() => {
                setSelectedTab(tab);
                SoundManager.playUIClick();
              }}
            >
              <Text style={[
                styles.tabLabel,
                selectedTab === tab && styles.tabLabelActive
              ]}>
                {tab.toUpperCase()}
              </Text>
              {selectedTab === tab && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {selectedTab === 'ships' && (
            <View style={styles.grid}>
              {Object.values(SHIPS).map((ship, index) => {
                const owned = playerData.ownedShips.includes(ship.id);
                const selected = playerData.currentShip === ship.id;
                
                return (
                  <TouchableOpacity
                    key={ship.id}
                    style={[
                      styles.card,
                      selected && styles.cardSelected,
                    ]}
                    onPress={() => handlePurchaseShip(ship)}
                    activeOpacity={0.7}
                  >
                    {/* Ship Visual */}
                    <View style={[styles.shipVisual, { backgroundColor: ship.visual.color + '40' }]}>
                      <View style={[styles.shipIndicator, { backgroundColor: ship.visual.color }]} />
                      <Text style={styles.tierBadge}>T{ship.tier}</Text>
                    </View>
                    
                    {/* Info */}
                    <View style={styles.cardInfo}>
                      <Text style={styles.cardTitle}>{ship.name}</Text>
                      <Text style={styles.cardDescription} numberOfLines={2}>
                        {ship.description}
                      </Text>
                      
                      {/* Stats */}
                      <View style={styles.stats}>
                        <View style={styles.statBar}>
                          <View style={[styles.statFill, { width: `${ship.stats.speed * 60}%` }]} />
                        </View>
                        <Text style={styles.statLabel}>Speed {ship.stats.speed}x</Text>
                      </View>
                    </View>
                    
                    {/* Action */}
                    {owned ? (
                      selected ? (
                        <View style={styles.equippedBadge}>
                          <Text style={styles.equippedText}>✓ EQUIPPED</Text>
                        </View>
                      ) : (
                        <View style={styles.selectBadge}>
                          <Text style={styles.selectText}>TAP TO EQUIP</Text>
                        </View>
                      )
                    ) : (
                      <View style={styles.priceBadge}>
                        <Text style={styles.priceText}>
                          {ship.price > 0 ? `⭐ ${ship.price}` : `💎 ${ship.priceGems}`}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {selectedTab === 'boosters' && (
            <View style={styles.grid}>
              {Object.values(BOOSTERS).map(booster => {
                const owned = playerData.boosters[booster.id] || 0;
                
                return (
                  <TouchableOpacity
                    key={booster.id}
                    style={styles.card}
                    onPress={() => handlePurchaseBooster(booster)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.boosterIcon}>{booster.icon}</Text>
                    
                    <View style={styles.cardInfo}>
                      <Text style={styles.cardTitle}>{booster.name}</Text>
                      <Text style={styles.cardDescription} numberOfLines={2}>
                        {booster.description}
                      </Text>
                    </View>
                    
                    {owned > 0 && (
                      <View style={styles.inventoryBadge}>
                        <Text style={styles.inventoryText}>×{owned}</Text>
                      </View>
                    )}
                    
                    <View style={styles.priceBadge}>
                      <Text style={styles.priceText}>
                        {booster.price > 0 ? `⭐ ${booster.price}` : `💎 ${booster.priceGems}`}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {selectedTab === 'upgrades' && (
            <View style={styles.grid}>
              {/* Ammo Capacity Upgrade */}
              <TouchableOpacity
                style={[styles.card, styles.upgradeCard]}
                onPress={handleUpgradeAmmo}
                activeOpacity={0.7}
              >
                <View style={[styles.upgradeIcon, { backgroundColor: 'rgba(255, 136, 0, 0.2)' }]}>
                  <Text style={styles.upgradeIconText}>🔫</Text>
                </View>
                
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>Ammo Capacity</Text>
                  <Text style={styles.cardDescription}>
                    Increase maximum ammo capacity
                  </Text>
                  
                  <View style={styles.upgradeLevel}>
                    <Text style={styles.upgradeLevelText}>Level {ammoLevel}/7</Text>
                    <View style={styles.upgradeLevelBar}>
                      <View style={[styles.upgradeLevelFill, { width: `${(ammoLevel / 7) * 100}%` }]} />
                    </View>
                  </View>
                  
                  <Text style={styles.upgradeCurrentValue}>
                    Current: {Math.floor(50 * (1 + (ammoLevel - 1) * 0.5))} max ammo
                  </Text>
                  
                  {ammoLevel < 7 && (
                    <Text style={styles.upgradeNextValue}>
                      Next: {Math.floor(50 * (1 + ammoLevel * 0.5))} max ammo
                    </Text>
                  )}
                </View>
                
                {ammoLevel >= 7 ? (
                  <View style={styles.maxLevelBadge}>
                    <Text style={styles.maxLevelText}>MAX LEVEL</Text>
                  </View>
                ) : (
                  <View style={styles.priceBadge}>
                    <Text style={styles.priceText}>
                      ⭐ {[0, 200, 500, 1000, 2000, 4000, 8000][ammoLevel]}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
              
              {/* Fire Rate Upgrade - Coming Soon */}
              <View style={[styles.card, styles.lockedCard]}>
                <View style={[styles.upgradeIcon, { backgroundColor: 'rgba(255, 0, 255, 0.2)' }]}>
                  <Text style={styles.upgradeIconText}>⚡</Text>
                </View>
                
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>Fire Rate</Text>
                  <Text style={styles.cardDescription}>
                    Shoot faster
                  </Text>
                </View>
                
                <View style={styles.comingSoonBadge}>
                  <Text style={styles.comingSoonBadgeText}>COMING SOON</Text>
                </View>
              </View>
              
              {/* Damage Upgrade - Coming Soon */}
              <View style={[styles.card, styles.lockedCard]}>
                <View style={[styles.upgradeIcon, { backgroundColor: 'rgba(255, 51, 102, 0.2)' }]}>
                  <Text style={styles.upgradeIconText}>💥</Text>
                </View>
                
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>Weapon Damage</Text>
                  <Text style={styles.cardDescription}>
                    Deal more damage per shot
                  </Text>
                </View>
                
                <View style={styles.comingSoonBadge}>
                  <Text style={styles.comingSoonBadgeText}>COMING SOON</Text>
                </View>
              </View>
            </View>
          )}

          {selectedTab === 'gems' && (
            <View style={styles.comingSoonContainer}>
              <Text style={styles.comingSoonIcon}>💎</Text>
              <Text style={styles.comingSoonText}>Gem Store</Text>
              <Text style={styles.comingSoonSub}>Coming Soon!</Text>
              <Text style={styles.comingSoonHint}>Watch ads to earn free gems</Text>
            </View>
          )}
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
    fontWeight: '600',
  },
  
  // Header
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
  currency: {
    flexDirection: 'row',
    gap: 12,
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 212, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  currencyValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  currencyLabel: {
    fontSize: 14,
  },
  
  // Tabs
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    position: 'relative',
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
    letterSpacing: 1,
  },
  tabActive: {},
  tabLabelActive: {
    color: COLORS.PRIMARY,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 2,
  },
  
  // Content
  scrollView: {
    flex: 1,
    paddingTop: 20,
  },
  grid: {
    padding: 20,
    gap: 16,
  },
  
  // Card
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: 12,
  },
  cardSelected: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
  },
  shipVisual: {
    height: 100,
    borderRadius: 12,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  shipIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  tierBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff',
  },
  boosterIcon: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 12,
  },
  cardInfo: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 18,
  },
  
  // Stats
  stats: {
    marginTop: 10,
  },
  statBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  statFill: {
    height: '100%',
    backgroundColor: COLORS.PRIMARY,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.TEXT_SECONDARY,
  },
  
  // Badges
  equippedBadge: {
    backgroundColor: COLORS.SUCCESS,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  equippedText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  selectBadge: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  selectText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.BACKGROUND,
    letterSpacing: 1,
  },
  priceBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.ACCENT,
  },
  priceText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.ACCENT,
  },
  inventoryBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  inventoryText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  
  // Coming Soon
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
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  comingSoonSub: {
    fontSize: 18,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 20,
  },
  comingSoonHint: {
    fontSize: 14,
    color: COLORS.ACCENT,
    fontStyle: 'italic',
  },
  
  // Upgrade specific styles
  upgradeCard: {
    minHeight: 200,
  },
  upgradeIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    alignSelf: 'center',
  },
  upgradeIconText: {
    fontSize: 40,
  },
  upgradeLevel: {
    marginTop: 12,
    marginBottom: 8,
  },
  upgradeLevelText: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 6,
    fontWeight: '600',
  },
  upgradeLevelBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  upgradeLevelFill: {
    height: '100%',
    backgroundColor: COLORS.PRIMARY,
  },
  upgradeCurrentValue: {
    fontSize: 13,
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
    marginTop: 8,
  },
  upgradeNextValue: {
    fontSize: 12,
    color: COLORS.SUCCESS,
    marginTop: 4,
  },
  maxLevelBadge: {
    backgroundColor: COLORS.ACCENT,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  maxLevelText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.BACKGROUND,
    letterSpacing: 1,
  },
  lockedCard: {
    opacity: 0.6,
  },
  comingSoonBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.TEXT_SECONDARY,
  },
  comingSoonBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.TEXT_SECONDARY,
    letterSpacing: 1,
  },
});

export default ShopScreen;
