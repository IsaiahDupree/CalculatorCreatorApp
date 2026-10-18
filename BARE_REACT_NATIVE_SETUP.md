# Bare React Native Setup (Alternative)

If you need **complete native control** and want to eject from Expo entirely, here's how:

## 🔄 Ejecting from Expo

### Option 1: Prebuild (Recommended)
Generates native projects but keeps Expo tooling:

```bash
cd apps/mobile
npx expo prebuild
```

This creates:
- `ios/` - Xcode project
- `android/` - Android Studio project

### Option 2: Full Eject (Not Recommended)
Completely removes Expo (lose OTA updates, Expo tooling):

```bash
npx expo eject
```

## 📱 After Prebuild

### iOS Development
```bash
# Open in Xcode
npx expo run:ios

# Or open manually
open ios/CalculatorCreator.xcworkspace
```

### Android Development
```bash
# Run on device/emulator
npx expo run:android

# Or open in Android Studio
# File → Open → android/
```

## 🔧 Custom Native Code

### iOS (Swift/Objective-C)
Edit files in `ios/CalculatorCreator/`:
- `AppDelegate.swift` - App lifecycle
- Custom native modules
- Native UI components

### Android (Kotlin/Java)
Edit files in `android/app/src/main/`:
- `MainActivity.kt` - Main activity
- Custom native modules
- Native UI components

## ⚠️ Trade-offs

### Prebuild (Keep Expo)
✅ Keep Expo tooling
✅ OTA updates still work
✅ Easy to add Expo modules
❌ Less native control

### Full Eject
✅ Complete native control
✅ No Expo dependencies
❌ Lose OTA updates
❌ Lose Expo tooling
❌ More maintenance

## 🎯 Recommendation

**Use Expo Development Build** (current setup):
- Best of both worlds
- Custom native code when needed
- OTA updates for JS/TS
- Production ready

Only eject if you need:
- Custom native UI
- Complex native integrations
- Full control over build process

---

**Current Setup**: Expo Development Build (recommended) ✅




