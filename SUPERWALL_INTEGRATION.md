# Superwall Integration Guide

## Overview

This app integrates with [Superwall](https://github.com/superwall/expo-superwall) for paywall management and A/B testing. The Superwall example app has been cloned to `superwallexampleapp/` for reference.

## ✅ What's Implemented

### Event Tracking System
- ✅ **Event Types** - Comprehensive event definitions
- ✅ **Analytics Library** - Track events throughout app
- ✅ **Screen Tracking** - Automatic screen view tracking
- ✅ **User Action Tracking** - Button clicks, navigation, etc.
- ✅ **API Endpoint** - `/api/analytics/track` for event storage

### Superwall Integration
- ✅ **Superwall Wrapper** - Initialization and configuration
- ✅ **User Identification** - Link users to Superwall
- ✅ **Placement Registration** - Ready for paywall triggers
- ✅ **Event Integration** - Events feed into Superwall

## 🔧 Setup Instructions

### 1. Install Superwall SDK

```bash
cd apps/mobile
pnpm add expo-superwall
```

### 2. Get Superwall API Key

1. Sign up at [superwall.com](https://superwall.com)
2. Create a project
3. Get your API key from dashboard

### 3. Configure Environment

Add to `apps/mobile/.env`:

```env
EXPO_PUBLIC_SUPERWALL_API_KEY="your_superwall_api_key"
```

### 4. Update Superwall Integration

The wrapper in `apps/mobile/lib/superwall.ts` is ready. Update it to use the actual SDK:

```typescript
import Superwall from 'expo-superwall';

export async function initializeSuperwall(config: SuperwallConfig) {
  await Superwall.configure(config.apiKey);
  if (config.userId) {
    await Superwall.identify(config.userId, config.userAttributes);
  }
}
```

## 📊 Event Tracking

### Automatic Events

Events are automatically tracked on:
- ✅ Screen views (all screens)
- ✅ Calculator views
- ✅ Calculator evaluations
- ✅ AI generation
- ✅ Tutoring sessions
- ✅ User authentication
- ✅ Button clicks
- ✅ Search and filters

### Manual Events

Track custom events:

```typescript
import { analytics } from '@/lib/analytics';

analytics.trackEvent('custom_event', {
  customProperty: 'value',
});
```

## 🎯 Superwall Placements

### Recommended Placements

1. **Calculator Creation** - After free limit reached
2. **Tutoring Access** - When non-subscriber tries tutoring
3. **Advanced Features** - For premium features
4. **Marketplace** - Upsell to Pro/Business

### Usage Example

```typescript
import { registerPlacement } from '@/lib/superwall';

// Register placement (triggers paywall if needed)
const presented = await registerPlacement('calculator_creation', {
  calculatorCount: userCalculatorCount,
});

if (!presented) {
  // User can proceed (already subscribed or in holdout)
  createCalculator();
}
```

## 📝 Event Types

All events are defined in `packages/shared/src/events.ts`:

- Authentication events
- Calculator events
- Marketplace events
- AI events
- Payment events
- Revenue share events
- Profile events
- Navigation events

## 🔗 Superwall Example App

The example app is in `superwallexampleapp/` for reference:
- SDK usage patterns
- Hook implementations
- Event handling
- Configuration examples

## 🚀 Next Steps

1. **Complete Superwall Setup**:
   - Install SDK
   - Configure API key
   - Set up placements in Superwall dashboard

2. **Add Paywall Triggers**:
   - Calculator creation limit
   - Tutoring access
   - Advanced features

3. **A/B Testing**:
   - Test different paywall designs
   - Optimize conversion rates
   - Track performance

## 📚 Resources

- [Superwall Expo SDK](https://github.com/superwall/expo-superwall)
- [Superwall Documentation](https://docs.superwall.com)
- [Example App](./superwallexampleapp/)

---

**Status**: Event tracking complete! Superwall integration ready for SDK configuration. 🎯




