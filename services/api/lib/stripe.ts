import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
});

// Subscription tier prices (in cents)
export const SUBSCRIPTION_PRICES = {
  free: 0,
  pro: 1000, // $10/month
  business: 3900, // $39/month
} as const;

// Subscription tier features
export const SUBSCRIPTION_FEATURES = {
  free: {
    calculatorLimit: 2,
    aiGeneration: false,
    tutoring: false,
    analytics: false,
  },
  pro: {
    calculatorLimit: Infinity,
    aiGeneration: true,
    tutoring: true,
    analytics: false,
  },
  business: {
    calculatorLimit: Infinity,
    aiGeneration: true,
    tutoring: true,
    analytics: true,
    apiAccess: true,
  },
} as const;




