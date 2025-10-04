import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { COLORS } from '../constants/GameConfig';
import Storage from '../utils/Storage';
import SoundManager from '../utils/SoundManager';

const SettingsScreen = ({ onBack }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    // Load settings from storage
    // TODO: Implement settings storage
  };

  const handleSoundToggle = (value) => {
    setSoundEnabled(value);
    SoundManager.setEnabled(value);
  };

  const handleMusicToggle = (value) => {
    setMusicEnabled(value);
    // TODO: Implement music toggle
  };

  const handleHapticsToggle = (value) => {
    setHapticsEnabled(value);
    // TODO: Implement haptics toggle
  };

  const handleResetProgress = () => {
    // TODO: Show confirmation dialog
    console.log('Reset progress');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SETTINGS</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content}>
        {/* Audio Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AUDIO</Text>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Sound Effects</Text>
            <Switch
              value={soundEnabled}
              onValueChange={handleSoundToggle}
              trackColor={{ false: '#555', true: COLORS.PRIMARY }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Music</Text>
            <Switch
              value={musicEnabled}
              onValueChange={handleMusicToggle}
              trackColor={{ false: '#555', true: COLORS.PRIMARY }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Gameplay Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>GAMEPLAY</Text>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Haptic Feedback</Text>
            <Switch
              value={hapticsEnabled}
              onValueChange={handleHapticsToggle}
              trackColor={{ false: '#555', true: COLORS.PRIMARY }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Data Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DATA</Text>
          
          <TouchableOpacity style={styles.dangerButton} onPress={handleResetProgress}>
            <Text style={styles.dangerButtonText}>Reset All Progress</Text>
          </TouchableOpacity>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ABOUT</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Developer</Text>
            <Text style={styles.infoValue}>AstroPulse Team</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
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
  backButtonText: {
    fontSize: 32,
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    letterSpacing: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 15,
    letterSpacing: 1,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingLabel: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
  },
  dangerButton: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.DANGER,
    alignItems: 'center',
  },
  dangerButtonText: {
    color: COLORS.DANGER,
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoLabel: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
  },
  infoValue: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;

