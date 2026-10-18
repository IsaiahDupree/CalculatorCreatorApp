// Event tracking types and constants

export type EventName =
  // Authentication Events
  | 'user_signed_up'
  | 'user_signed_in'
  | 'user_signed_out'
  | 'password_reset_requested'
  | 'email_verified'
  | 'social_auth_completed'
  
  // Calculator Events
  | 'calculator_viewed'
  | 'calculator_created'
  | 'calculator_updated'
  | 'calculator_deleted'
  | 'calculator_published'
  | 'calculator_evaluated'
  | 'calculator_shared'
  | 'calculator_favorited'
  
  // Marketplace Events
  | 'marketplace_viewed'
  | 'calculator_searched'
  | 'category_filtered'
  | 'trending_viewed'
  
  // AI Events
  | 'ai_generation_started'
  | 'ai_generation_completed'
  | 'ai_generation_failed'
  | 'tutoring_session_started'
  | 'tutoring_message_sent'
  | 'tutoring_session_ended'
  
  // Payment Events
  | 'subscription_checkout_started'
  | 'subscription_purchased'
  | 'subscription_cancelled'
  | 'payment_failed'
  
  // Revenue Share Events
  | 'revenue_share_calculated'
  | 'earnings_viewed'
  
  // Profile Events
  | 'profile_viewed'
  | 'profile_updated'
  | 'settings_changed'
  
  // Navigation Events
  | 'screen_viewed'
  | 'button_clicked'
  | 'link_clicked';

export interface EventProperties {
  [key: string]: any;
}

export interface BaseEvent {
  name: EventName;
  properties?: EventProperties;
  userId?: string;
  timestamp: string;
  sessionId?: string;
}

// Event-specific property types
export interface CalculatorViewedEvent extends BaseEvent {
  name: 'calculator_viewed';
  properties: {
    calculatorId: string;
    calculatorTitle: string;
    category?: string;
    source: 'marketplace' | 'search' | 'direct' | 'share';
  };
}

export interface CalculatorEvaluatedEvent extends BaseEvent {
  name: 'calculator_evaluated';
  properties: {
    calculatorId: string;
    success: boolean;
    duration?: number;
    error?: string;
  };
}

export interface AIGenerationStartedEvent extends BaseEvent {
  name: 'ai_generation_started';
  properties: {
    prompt: string;
    hasImage: boolean;
  };
}

export interface SubscriptionCheckoutStartedEvent extends BaseEvent {
  name: 'subscription_checkout_started';
  properties: {
    tier: 'pro' | 'business';
    source: string;
  };
}

export interface ScreenViewedEvent extends BaseEvent {
  name: 'screen_viewed';
  properties: {
    screenName: string;
    screenPath: string;
  };
}

export type TrackedEvent =
  | BaseEvent
  | CalculatorViewedEvent
  | CalculatorEvaluatedEvent
  | AIGenerationStartedEvent
  | SubscriptionCheckoutStartedEvent
  | ScreenViewedEvent;




