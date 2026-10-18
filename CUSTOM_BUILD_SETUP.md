# Custom Build Setup Guide

## 🎯 Build Strategy

Since you're building a custom app (not using Expo Go), we'll use **Expo Development Build** (custom development client) which allows:
- ✅ Custom native code
- ✅ Native modules
- ✅ Full iOS/Android customization
- ✅ Still use Expo tooling and updates

## 📱 Build Options

### Option 1: Expo Development Build (Recommended)
- Custom development client with your native code
- Over-the-air updates for JS/TS
- Full native module support
- Works for both iOS and Android

### Option 2: Bare React Native
- Complete native control
- No Expo tooling
- More setup required
- Full customization

## 🔧 Setup for Custom Builds

### 1. Install EAS CLI

```bash
npm install -g eas-cli
```

### 2. Login to Expo

```bash
eas login
```

### 3. Configure Project

```bash
cd apps/mobile
eas build:configure
```

This creates `eas.json` (already created for you).

### 4. Build Development Client

**For iOS (requires Apple Developer account):**
```bash
eas build --profile development --platform ios
```

**For Android:**
```bash
eas build --profile development --platform android
```

**For both:**
```bash
eas build --profile development --platform all
```

### 5. Install Development Client

- **iOS**: Download from EAS or TestFlight
- **Android**: Download APK from EAS

### 6. Run Development

```bash
# Start Metro bundler
pnpm start

# In development client, scan QR code or use deep link
```

## 🍎 iOS Custom Build

### Requirements
- Apple Developer account ($99/year)
- Xcode (for local builds) or EAS Build (cloud)
- macOS (for local builds)

### Build Commands

**Development Build (Simulator):**
```bash
eas build --profile development --platform ios
```

**Production Build:**
```bash
eas build --profile production --platform ios
```

**Local Build (if you have Xcode):**
```bash
# Generate native code
npx expo prebuild

# Open in Xcode
npx expo run:ios
```

### iOS Configuration

The `app.json` is configured with:
- Bundle identifier: `com.calculatorcreator.app`
- Info.plist permissions
- Build number management

## 🤖 Android Custom Build

### Requirements
- Google Play Developer account ($25 one-time)
- Android Studio (for local builds) or EAS Build (cloud)

### Build Commands

**Development Build:**
```bash
eas build --profile development --platform android
```

**Production Build:**
```bash
eas build --profile production --platform android
```

**Local Build (if you have Android Studio):**
```bash
# Generate native code
npx expo prebuild

# Run on device/emulator
npx expo run:android
```

### Android Configuration

The `app.json` is configured with:
- Package name: `com.calculatorcreator.app`
- Permissions (camera, storage)
- Version code management

## 🔄 Development Workflow

### 1. Initial Setup
```bash
# Install dependencies
pnpm install

# Configure EAS
cd apps/mobile
eas build:configure
```

### 2. Build Development Client
```bash
# Build once
eas build --profile development --platform all

# Install on device
# iOS: TestFlight or direct download
# Android: APK download
```

### 3. Daily Development
```bash
# Start Metro
pnpm start

# Development client auto-updates JS/TS
# No rebuild needed for code changes!
```

### 4. When Native Code Changes
```bash
# Rebuild development client
eas build --profile development --platform ios
eas build --profile development --platform android
```

## 📦 Native Modules

### Current Native Dependencies
- `expo-router` - Navigation
- `expo-image-picker` - Image selection
- `expo-camera` - Camera access
- `@react-native-async-storage/async-storage` - Storage
- `expo-web-browser` - OAuth flows

### Adding More Native Modules

1. Install package:
```bash
pnpm add expo-module-name
```

2. If it requires native code:
```bash
# Rebuild development client
eas build --profile development --platform all
```

## 🚀 Production Builds

### iOS App Store
```bash
eas build --profile production --platform ios
eas submit --platform ios
```

### Google Play Store
```bash
eas build --profile production --platform android
eas submit --platform android
```

## 🔧 Custom Native Code

### If You Need Custom Native Code

1. **Generate native projects:**
```bash
npx expo prebuild
```

2. **Edit native code:**
- iOS: `ios/` directory (Xcode)
- Android: `android/` directory (Android Studio)

3. **Rebuild:**
```bash
eas build --profile development --platform all
```

## 📝 Configuration Files

### `eas.json`
- Build profiles (development, preview, production)
- Platform-specific settings
- Distribution settings

### `app.json`
- App metadata
- Permissions
- Bundle identifiers
- Icons and splash screens

## 🎯 Recommended Approach

For your custom build:

1. **Use Expo Development Build** (not Expo Go)
2. **Build with EAS** (cloud builds, easier)
3. **Use OTA updates** for JS/TS changes
4. **Rebuild only when** native code changes

## ⚠️ Important Notes

### iOS
- Requires Apple Developer account
- Must build with EAS or Xcode
- Can't use Expo Go
- Development builds work great

### Android
- Can build locally or with EAS
- APK for testing, AAB for Play Store
- Development builds work great

## 🔗 Resources

- [EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [Development Builds](https://docs.expo.dev/development/introduction/)
- [Custom Native Code](https://docs.expo.dev/bare/overview/)

---

**Status**: Configured for custom builds! Use EAS Build for iOS and Android. 🚀




