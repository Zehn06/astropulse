import * as Haptics from 'expo-haptics';

class HapticManager {
  constructor() {
    this.enabled = true;
  }

  // Light tap feedback (10-20ms equivalent)
  async tap() {
    if (!this.enabled) return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.error('Haptic tap error:', error);
    }
  }

  // Collision feedback (40-60ms equivalent)
  async collision() {
    if (!this.enabled) return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch (error) {
      console.error('Haptic collision error:', error);
    }
  }

  // Success feedback
  async success() {
    if (!this.enabled) return;
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Haptic success error:', error);
    }
  }

  // Warning feedback
  async warning() {
    if (!this.enabled) return;
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch (error) {
      console.error('Haptic warning error:', error);
    }
  }

  // Toggle haptics on/off
  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
}

export default new HapticManager();

