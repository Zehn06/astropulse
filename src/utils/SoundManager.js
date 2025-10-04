import { Audio } from 'expo-av';

class SoundManager {
  constructor() {
    this.sounds = {};
    this.soundsEnabled = true;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing audio:', error);
    }
  }

  // Load a sound (would load actual audio files in production)
  async loadSound(name, uri) {
    try {
      const { sound } = await Audio.Sound.createAsync(
        uri,
        { shouldPlay: false }
      );
      this.sounds[name] = sound;
    } catch (error) {
      console.error(`Error loading sound ${name}:`, error);
    }
  }

  // Play a sound effect
  async playSound(name) {
    if (!this.soundsEnabled) return;

    try {
      // In production, this would play the actual sound
      // For now, we'll just log it
      console.log(`Playing sound: ${name}`);
      
      // If sound is loaded, play it
      if (this.sounds[name]) {
        await this.sounds[name].replayAsync();
      }
    } catch (error) {
      console.error(`Error playing sound ${name}:`, error);
    }
  }

  // Play thrust sound
  playThrust() {
    this.playSound('thrust');
  }

  // Play collect sound
  playCollect() {
    this.playSound('collect');
  }

  // Play explosion sound
  playExplosion(size = 'small') {
    this.playSound(`explosion_${size}`);
  }

  // Play power-up pickup sound
  playPowerUp() {
    this.playSound('powerup');
  }

  // Play game over sound
  playGameOver() {
    this.playSound('gameover');
  }

  // Play UI click sound
  playUIClick() {
    this.playSound('ui_click');
  }
  
  // Play shoot sound
  playShoot() {
    this.playSound('shoot');
  }
  
  // Set sound enabled/disabled
  setEnabled(enabled) {
    this.soundsEnabled = enabled;
  }

  // Toggle sound on/off
  toggleSound() {
    this.soundsEnabled = !this.soundsEnabled;
    return this.soundsEnabled;
  }

  // Cleanup
  async cleanup() {
    for (const sound of Object.values(this.sounds)) {
      try {
        await sound.unloadAsync();
      } catch (error) {
        console.error('Error unloading sound:', error);
      }
    }
    this.sounds = {};
  }
}

export default new SoundManager();

