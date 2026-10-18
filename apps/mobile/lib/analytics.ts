import { EventName, EventProperties, TrackedEvent } from '@calc/shared/src/events';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

// Session tracking
let sessionId: string | null = null;
let userId: string | null = null;

export function initializeAnalytics(userId?: string) {
  sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  if (userId) {
    setUserId(userId);
  }
}

export function setUserId(newUserId: string) {
  userId = newUserId;
}

export function getSessionId(): string | null {
  return sessionId;
}

export async function trackEvent(
  name: EventName,
  properties?: EventProperties
): Promise<void> {
  try {
    const event: TrackedEvent = {
      name,
      properties,
      userId: userId || undefined,
      timestamp: new Date().toISOString(),
      sessionId: sessionId || undefined,
    };

    // Send to backend analytics endpoint
    await fetch(`${API_URL}/api/analytics/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });

    // Also log locally for debugging
    if (__DEV__) {
      console.log('[Analytics]', name, properties);
    }
  } catch (error) {
    // Fail silently in production, log in dev
    if (__DEV__) {
      console.error('[Analytics Error]', error);
    }
  }
}

// Convenience functions for common events
export const analytics = {
  // Screen tracking
  screen: (screenName: string, screenPath: string) => {
    trackEvent('screen_viewed', { screenName, screenPath });
  },

  // Calculator events
  calculatorViewed: (calculatorId: string, calculatorTitle: string, source: string, category?: string) => {
    trackEvent('calculator_viewed', {
      calculatorId,
      calculatorTitle,
      source,
      category,
    });
  },

  calculatorEvaluated: (calculatorId: string, success: boolean, duration?: number, error?: string) => {
    trackEvent('calculator_evaluated', {
      calculatorId,
      success,
      duration,
      error,
    });
  },

  calculatorCreated: (calculatorId: string, title: string) => {
    trackEvent('calculator_created', { calculatorId, title });
  },

  calculatorShared: (calculatorId: string, method: string) => {
    trackEvent('calculator_shared', { calculatorId, method });
  },

  // AI events
  aiGenerationStarted: (prompt: string, hasImage: boolean = false) => {
    trackEvent('ai_generation_started', { prompt, hasImage });
  },

  aiGenerationCompleted: (calculatorId: string, success: boolean) => {
    trackEvent('ai_generation_completed', { calculatorId, success });
  },

  tutoringStarted: (calculatorId: string) => {
    trackEvent('tutoring_session_started', { calculatorId });
  },

  tutoringMessageSent: (calculatorId: string, messageLength: number) => {
    trackEvent('tutoring_message_sent', { calculatorId, messageLength });
  },

  // Marketplace events
  marketplaceViewed: () => {
    trackEvent('marketplace_viewed');
  },

  calculatorSearched: (query: string, resultsCount: number) => {
    trackEvent('calculator_searched', { query, resultsCount });
  },

  categoryFiltered: (category: string) => {
    trackEvent('category_filtered', { category });
  },

  // Payment events
  subscriptionCheckoutStarted: (tier: 'pro' | 'business', source: string) => {
    trackEvent('subscription_checkout_started', { tier, source });
  },

  subscriptionPurchased: (tier: string, amount: number) => {
    trackEvent('subscription_purchased', { tier, amount });
  },

  // User events
  userSignedUp: (method: 'email' | 'google' | 'github') => {
    trackEvent('user_signed_up', { method });
  },

  userSignedIn: (method: 'email' | 'google' | 'github') => {
    trackEvent('user_signed_in', { method });
  },

  // Button clicks
  buttonClicked: (buttonName: string, location: string) => {
    trackEvent('button_clicked', { buttonName, location });
  },

  // Generic track function
  trackEvent: (name: EventName, properties?: EventProperties) => {
    trackEvent(name, properties);
  },
};

