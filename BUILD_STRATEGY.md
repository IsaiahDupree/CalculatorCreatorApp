# Build Strategy for Custom App

## 🎯 Decision: Expo Development Build

Since you're building a custom app (not using Expo Go), we're using **Expo Development Build** which gives you:

✅ **Full native control** - Custom native code
✅ **Native modules** - All native dependencies work
✅ **OTA updates** - Update JS/TS without rebuilding
✅ **Production ready** - App Store & Play Store compatible
✅ **Works for both iOS and Android**

## 📱 Build Approach

### iOS
- **Cannot use Expo Go** (custom native code)
- **Use EAS Build** (cloud builds) or local Xcode builds
- **Development client** for testing
- **Production builds** for App Store

### Android
- **Cannot use Expo Go** (custom native code)
- **Use EAS Build** (cloud builds) or local Android Studio builds
- **Development client** for testing
- **Production builds** for Play Store

## 🔧 What's Configured

### 1. EAS Build Configuration (`eas.json`)
- ✅ Development profile (for testing)
- ✅ Preview profile (for internal testing)
- ✅ Production profile (for stores)
- ✅ Platform-specific settings

### 2. App Configuration (`app.json`)
- ✅ Bundle identifiers
- ✅ Permissions (camera, photos)
- ✅ Icons and splash screens
- ✅ Runtime version for OTA updates

### 3. Native Modules
- ✅ Image picker (for calculator creation from photos)
- ✅ Camera (for photo capture)
- ✅ AsyncStorage (for session persistence)
- ✅ WebBrowser (for OAuth)

## 🚀 Build Commands

### Development Build (First Time)
```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Build development client
cd apps/mobile
eas build --profile development --platform all
```

### Daily Development
```bash
# Just start Metro (no rebuild needed!)
pnpm start

# Development client auto-updates
```

### Production Build
```bash
# iOS
eas build --profile production --platform ios

# Android
eas build --profile production --platform android
```

## 📦 What Gets Built

### Development Build
- Custom development client with your native code
- Can install on devices/simulators
- Auto-updates JS/TS via Metro
- Perfect for development

### Production Build
- Full app binary
- Ready for App Store/Play Store
- Includes all native code
- Optimized and signed

## 🔄 Workflow

### Initial Setup
1. Build development client once
2. Install on device
3. Start developing!

### Daily Development
1. `pnpm start` (Metro bundler)
2. Open development client
3. Code changes auto-reload
4. **No rebuild needed** for JS/TS changes

### When Native Code Changes
1. Rebuild development client
2. Install new build
3. Continue development

## ⚠️ Important Notes

### iOS
- ✅ EAS Build works great (cloud builds)
- ✅ Local builds require macOS + Xcode
- ✅ Must have Apple Developer account
- ✅ Development builds work perfectly

### Android
- ✅ EAS Build works great (cloud builds)
- ✅ Local builds require Android Studio
- ✅ APK for testing, AAB for Play Store
- ✅ Development builds work perfectly

## 🎯 Why This Approach?

1. **Flexibility** - Full native control when needed
2. **Speed** - OTA updates for JS/TS (no rebuild)
3. **Compatibility** - Works with all native modules
4. **Production Ready** - Store-ready builds
5. **Both Platforms** - iOS and Android supported

## 📚 Next Steps

1. **Set up EAS account** at [expo.dev](https://expo.dev)
2. **Build development client** (one time)
3. **Install on device** and start developing
4. **Use OTA updates** for daily development
5. **Rebuild only when** native code changes

---

**Status**: Configured for custom builds! Ready for EAS Build setup. 🚀




