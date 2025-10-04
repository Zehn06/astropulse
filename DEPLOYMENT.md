# AstroPulse - Deployment Guide

## 📱 Building for Production

### Method 1: Expo Classic Build (Easier)

#### Android APK
```bash
# Install Expo CLI globally
npm install -g expo-cli

# Login to Expo account (create one at expo.dev if needed)
expo login

# Build APK
expo build:android -t apk

# Or build App Bundle (AAB) for Play Store
expo build:android -t app-bundle
```

The build will be queued on Expo's servers. You'll get a download link when complete.

#### iOS IPA (Mac required for final steps)
```bash
expo build:ios
```

Note: iOS builds require Apple Developer Program membership ($99/year).

### Method 2: EAS Build (Recommended, Modern)

EAS (Expo Application Services) is the new build system:

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Initialize EAS in your project
eas build:configure

# Build Android
eas build --platform android

# Build iOS
eas build --platform ios

# Build both
eas build --platform all
```

### Method 3: Expo Go Testing (No Build Required)

For testing on devices without building:

1. Publish your project:
```bash
expo publish
```

2. Share the Expo Go link with testers
3. They can open it in Expo Go app

## 🏪 Publishing to App Stores

### Google Play Store

1. **Prepare Assets:**
   - App icon (512x512)
   - Feature graphic (1024x500)
   - Screenshots (at least 2)
   - Privacy policy URL

2. **Build AAB:**
```bash
eas build --platform android --profile production
```

3. **Create Google Play Developer Account:**
   - One-time fee: $25
   - https://play.google.com/console

4. **Upload AAB:**
   - Create new app in Play Console
   - Fill in store listing details
   - Upload AAB file
   - Submit for review

### Apple App Store

1. **Prepare Assets:**
   - App icon (1024x1024)
   - Screenshots for all device sizes
   - Privacy policy URL

2. **Build IPA:**
```bash
eas build --platform ios --profile production
```

3. **Apple Developer Account:**
   - Annual fee: $99
   - https://developer.apple.com

4. **Upload via Xcode or Transporter:**
   - Download IPA from EAS
   - Use Apple's Transporter app
   - Submit via App Store Connect

## 🔧 Pre-Deployment Checklist

### Required Changes

- [ ] Update `app.json` with proper bundle identifiers
- [ ] Add app icon (1024x1024)
- [ ] Add splash screen
- [ ] Configure version number
- [ ] Set up privacy policy (required for ads)
- [ ] Test on multiple devices
- [ ] Test on different screen sizes

### app.json Configuration

```json
{
  "expo": {
    "name": "AstroPulse",
    "slug": "astropulse",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#0a0e27"
    },
    "ios": {
      "bundleIdentifier": "com.yourcompany.astropulse",
      "buildNumber": "1"
    },
    "android": {
      "package": "com.yourcompany.astropulse",
      "versionCode": 1,
      "permissions": []
    }
  }
}
```

### Testing

```bash
# Test on Android device
expo start --android

# Test on iOS device
expo start --ios

# Test performance
expo start --no-dev --minify
```

## 📊 Adding Analytics (Optional)

### Expo Analytics

```bash
npm install expo-firebase-analytics
```

### Google Analytics

```bash
npm install @react-native-firebase/analytics
```

## 💰 Monetization Setup

### AdMob Integration

1. Create AdMob account: https://admob.google.com
2. Install package:
```bash
npm install expo-ads-admob
```

3. Add to app.json:
```json
{
  "expo": {
    "android": {
      "config": {
        "googleMobileAdsAppId": "ca-app-pub-xxxxxxxx~xxxxxxxx"
      }
    },
    "ios": {
      "config": {
        "googleMobileAdsAppId": "ca-app-pub-xxxxxxxx~xxxxxxxx"
      }
    }
  }
}
```

### In-App Purchases

```bash
npm install expo-in-app-purchases
```

## 🔐 Environment Variables

Create `.env` file for sensitive data:

```
ADMOB_ANDROID_APP_ID=ca-app-pub-xxxxx
ADMOB_IOS_APP_ID=ca-app-pub-xxxxx
ADMOB_ANDROID_BANNER_ID=ca-app-pub-xxxxx
ADMOB_IOS_BANNER_ID=ca-app-pub-xxxxx
```

Add to `.gitignore`:
```
.env
.env.local
```

## 📈 Post-Launch

### Monitoring
- Set up crash reporting (Sentry, Bugsnag)
- Monitor Play Console / App Store Connect
- Track user reviews
- Monitor analytics

### Updates
```bash
# Publish OTA update (JavaScript only changes)
expo publish

# Or with EAS Update
eas update --branch production
```

### Version Management

Update version in `app.json`:
```json
{
  "version": "1.0.1",
  "android": {
    "versionCode": 2
  },
  "ios": {
    "buildNumber": "2"
  }
}
```

## 🐛 Troubleshooting

### Build Fails
- Check all required fields in app.json
- Ensure icon.png exists
- Verify bundle identifier format
- Check Expo CLI version: `expo --version`

### Slow Builds
- EAS builds can take 10-30 minutes
- Check build queue: https://expo.dev/accounts/[username]/builds

### Testing Issues
- Clear Expo cache: `expo start -c`
- Clear metro bundler: `npx react-native start --reset-cache`
- Reinstall dependencies: `rm -rf node_modules && npm install`

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [App Store Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Play Store Guidelines](https://play.google.com/console/about/guides/releasewithconfidence/)
- [React Native Performance](https://reactnative.dev/docs/performance)

---

**Good luck with your launch! 🚀**

