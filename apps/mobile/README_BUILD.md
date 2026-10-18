# Calculator Creator - Mobile App Build Guide

## 🎯 Custom Build Setup

This app uses **Expo Development Build** (custom development client) for full native control.

## 📋 Prerequisites

### For iOS
- Apple Developer account ($99/year)
- EAS Build account (free tier available)

### For Android
- Google Play Developer account ($25 one-time)
- EAS Build account (free tier available)

## 🚀 Quick Start

### 1. Install EAS CLI
```bash
npm install -g eas-cli
```

### 2. Login
```bash
eas login
```

### 3. Configure Project
```bash
cd apps/mobile
eas build:configure
```

### 4. Build Development Client

**iOS:**
```bash
eas build --profile development --platform ios
```

**Android:**
```bash
eas build --profile development --platform android
```

**Both:**
```bash
eas build --profile development --platform all
```

### 5. Install on Device

- **iOS**: Download from EAS dashboard or TestFlight
- **Android**: Download APK from EAS dashboard

### 6. Run Development

```bash
# Start Metro bundler
pnpm start

# Scan QR code in development client
# Or use deep link: calculator-creator://
```

## 🔄 Development Workflow

### Daily Development
1. Start Metro: `pnpm start`
2. Open development client on device
3. Code changes auto-reload (no rebuild needed!)

### When Native Code Changes
1. Rebuild development client: `eas build --profile development`
2. Install new build on device
3. Continue development

## 📦 Production Builds

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

## 🔧 Local Builds (Optional)

If you prefer local builds:

### iOS (requires macOS + Xcode)
```bash
npx expo prebuild
npx expo run:ios
```

### Android (requires Android Studio)
```bash
npx expo prebuild
npx expo run:android
```

## 📝 Configuration

- `app.json` - App configuration
- `eas.json` - Build profiles
- `.easignore` - Files to exclude from builds

## 🎯 Why Development Build?

- ✅ Custom native code support
- ✅ Full iOS/Android control
- ✅ OTA updates for JS/TS
- ✅ Native modules work
- ✅ Production-ready builds

---

**Note**: Can't use Expo Go. Must use custom development client.




