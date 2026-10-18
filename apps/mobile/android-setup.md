# Android Build Setup

## 🤖 Requirements

1. **Google Play Developer Account** ($25 one-time)
   - Sign up at [play.google.com/console](https://play.google.com/console)
   - Needed for Play Store publishing

2. **Android Studio** (for local builds - optional)
   - Download from [developer.android.com](https://developer.android.com/studio)
   - Java/Kotlin development

3. **EAS Build Account** (for cloud builds)
   - Free tier available
   - Sign up at [expo.dev](https://expo.dev)

## 🚀 Build Options

### Option 1: EAS Build (Cloud - Recommended)
No Android Studio required! Builds in the cloud.

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Build
cd apps/mobile
eas build --profile development --platform android
```

**Advantages:**
- ✅ No Android Studio needed
- ✅ No local setup
- ✅ Automatic signing
- ✅ Fast builds

### Option 2: Local Build (Android Studio)
Requires Android Studio setup.

```bash
# Generate native project
npx expo prebuild

# Run on device/emulator
npx expo run:android

# Or open in Android Studio
# File → Open → android/
```

**Advantages:**
- ✅ Full control
- ✅ Faster iteration
- ✅ Debug native code

## 📝 Configuration

### Package Name
Already set in `app.json`:
```json
"package": "com.calculatorcreator.app"
```

### Permissions
Already configured in `app.json`:
- Camera
- Read/Write external storage

### Signing
EAS Build handles automatically, or configure in `android/app/build.gradle`:
```gradle
android {
    signingConfigs {
        release {
            storeFile file('keystore.jks')
            storePassword 'password'
            keyAlias 'key'
            keyPassword 'password'
        }
    }
}
```

## 🔧 Development Workflow

### First Time
1. Build development client: `eas build --profile development --platform android`
2. Download APK from EAS dashboard
3. Install on device: `adb install app.apk`
4. Start Metro: `pnpm start`
5. Open app and connect

### Daily Development
1. `pnpm start` (Metro bundler)
2. Code changes auto-reload
3. No rebuild needed!

### When Native Code Changes
1. Rebuild: `eas build --profile development --platform android`
2. Install new APK
3. Continue development

## 📦 Production Build

```bash
# Build for Play Store (AAB format)
eas build --profile production --platform android

# Submit to Play Store
eas submit --platform android
```

## 🎯 Why EAS Build?

- ✅ Works without Android Studio
- ✅ Automatic signing
- ✅ No local setup needed
- ✅ Fast cloud builds
- ✅ Production ready (AAB format)

## 📱 Testing

### Development APK
- Download from EAS dashboard
- Install on any Android device
- No Play Store needed

### Internal Testing
- Upload to Play Console
- Share with testers
- Track crashes and analytics

---

**Status**: Configured for Android custom builds! Use EAS Build for easiest setup. 🤖




