// Application constants

export const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  PRO: 'pro',
  BUSINESS: 'business',
} as const;

export const CALCULATOR_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  APPROVED: 'approved',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const;

export const REVIEW_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

export const REVENUE_SHARE_PERCENTAGE = 0.3; // 30% to creators
export const PLATFORM_SHARE_PERCENTAGE = 0.7; // 70% to platform

export const HOSTING_FEE = 35; // One-time fee per calculator

export const SUBSCRIPTION_PRICES = {
  [SUBSCRIPTION_TIERS.FREE]: 0,
  [SUBSCRIPTION_TIERS.PRO]: 10,
  [SUBSCRIPTION_TIERS.BUSINESS]: 39,
} as const;

export const CALCULATOR_LIMITS = {
  [SUBSCRIPTION_TIERS.FREE]: 2,
  [SUBSCRIPTION_TIERS.PRO]: Infinity,
  [SUBSCRIPTION_TIERS.BUSINESS]: Infinity,
} as const;




