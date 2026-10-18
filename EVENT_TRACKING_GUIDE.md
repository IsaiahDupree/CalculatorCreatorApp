# Event Tracking Guide

## ✅ Implementation Complete

All pages and user actions throughout the app now track events automatically.

## 📊 Tracked Events

### Screen Views (Automatic)
- ✅ Root layout
- ✅ Marketplace
- ✅ Create
- ✅ Profile
- ✅ Calculator Detail
- ✅ Tutor Chat
- ✅ Sign In
- ✅ Sign Up

### User Actions
- ✅ Calculator viewed
- ✅ Calculator evaluated
- ✅ Calculator created
- ✅ Calculator shared
- ✅ Search performed
- ✅ Category filtered
- ✅ AI generation started/completed
- ✅ Tutoring session started
- ✅ Tutoring messages sent
- ✅ User signed up/in/out
- ✅ Button clicks
- ✅ Navigation events

## 🔧 How It Works

### Automatic Tracking

Events are tracked automatically using React hooks:

```typescript
// Screen tracking
useFocusEffect(() => {
  analytics.screen('Screen Name', '/path');
});

// User action tracking
analytics.calculatorViewed(id, title, source, category);
```

### Event Flow

```
User Action
    ↓
Analytics Library (apps/mobile/lib/analytics.ts)
    ↓
API Endpoint (/api/analytics/track)
    ↓
Database/Storage
    ↓
Analytics Dashboard
```

## 📝 Event Properties

Each event includes:
- `name`: Event type
- `properties`: Event-specific data
- `userId`: User identifier (if logged in)
- `timestamp`: When event occurred
- `sessionId`: Session identifier

## 🎯 Integration Points

### All Screens
- `app/_layout.tsx` - Root tracking
- `app/(tabs)/index.tsx` - Marketplace
- `app/(tabs)/create.tsx` - Calculator creation
- `app/(tabs)/profile.tsx` - User profile
- `app/calculator/[id].tsx` - Calculator detail
- `app/calculator/[id]/tutor.tsx` - Tutoring
- `app/(auth)/signin.tsx` - Sign in
- `app/(auth)/signup.tsx` - Sign up

### Key Actions
- Calculator evaluation
- AI generation
- Tutoring messages
- Search and filters
- Authentication
- Navigation

## 📊 Analytics Dashboard

Events can be viewed in:
1. **Admin Dashboard** - Platform analytics
2. **User Analytics** - Personal stats
3. **Superwall** - Paywall optimization

## 🔗 Superwall Integration

Events automatically feed into Superwall for:
- Paywall triggers
- A/B testing
- Conversion optimization
- User segmentation

---

**Status**: Complete event tracking throughout the entire app! 📈




