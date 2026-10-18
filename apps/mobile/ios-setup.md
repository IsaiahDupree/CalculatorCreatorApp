# iOS Build Setup

## 🍎 Requirements

1. **Apple Developer Account** ($99/year)
   - Sign up at [developer.apple.com](https://developer.apple.com)
   - Needed for device testing and App Store

2. **macOS** (for local builds)
   - macOS 12+ recommended
   - Xcode 14+ required

3. **EAS Build Account** (for cloud builds)
   - Free tier available
   - Sign up at [expo.dev](https://expo.dev)

## 🚀 Build Options

### Option 1: EAS Build (Cloud - Recommended)
No macOS required! Builds in the cloud.

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Build
cd apps/mobile
eas build --profile development --platform ios
```

**Advantages:**
- ✅ No macOS needed
- ✅ No Xcode needed
- ✅ Automatic signing
- ✅ Fast builds

### Option 2: Local Build (Xcode)
Requires macOS and Xcode.

```bash
# Generate native project
npx expo prebuild

# Open in Xcode
npx expo run:ios

# Or manually
open ios/CalculatorCreator.xcworkspace
```

**Advantages:**
- ✅ Full control
- ✅ Faster iteration
- ✅ Debug native code

## 📝 Configuration

### Bundle Identifier
Already set in `app.json`:
```json
"bundleIdentifier": "com.calculatorcreator.app"
```

### Signing
EAS Build handles automatically, or configure in Xcode:
1. Open project in Xcode
2. Select target
3. Signing & Capabilities
4. Select team and provisioning profile

### Permissions
Already configured in `app.json`:
- Camera access
- Photo library access

## 🔧 Development Workflow

### First Time
1. Build development client: `eas build --profile development --platform ios`
2. Install on device (TestFlight or direct download)
3. Start Metro: `pnpm start`
4. Open app and connect

### Daily Development
1. `pnpm start` (Metro bundler)
2. Code changes auto-reload
3. No rebuild needed!

### When Native Code Changes
1. Rebuild: `eas build --profile development --platform ios`
2. Install new build
3. Continue development

## 📦 Production Build

```bash
# Build for App Store
eas build --profile production --platform ios

# Submit to App Store
eas submit --platform ios
```

## 🎯 Why EAS Build?

- ✅ Works without macOS
- ✅ Automatic code signing
- ✅ No Xcode setup needed
- ✅ Fast cloud builds
- ✅ Production ready

---

**Status**: Configured for iOS custom builds! Use EAS Build for easiest setup. 🍎




