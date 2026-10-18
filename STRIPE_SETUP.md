# Stripe Payments Setup Guide

## ✅ What's Implemented

### Payment Features
- ✅ **Stripe Integration** - Server-side Stripe client
- ✅ **Checkout Sessions** - Create subscription checkout
- ✅ **Webhooks** - Handle subscription events
- ✅ **Revenue Share** - Calculate and distribute earnings
- ✅ **Earnings API** - Get user earnings history

## 🔧 Setup Instructions

### 1. Create Stripe Account

1. Sign up at https://stripe.com
2. Get your API keys from Dashboard → Developers → API keys
3. Get webhook secret from Webhooks section

### 2. Create Products and Prices

In Stripe Dashboard:

1. **Create Product: Pro Subscription**
   - Name: "Pro Subscription"
   - Price: $10/month (recurring)
   - Copy the Price ID (starts with `price_`)

2. **Create Product: Business Subscription**
   - Name: "Business Subscription"
   - Price: $39/month (recurring)
   - Copy the Price ID

### 3. Configure Webhook

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://your-domain.com/api/payments/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy webhook signing secret

### 4. Environment Variables

Add to `services/api/.env`:

```env
# Stripe
STRIPE_SECRET_KEY="sk_test_your_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
STRIPE_PRICE_ID_PRO="price_your_pro_price_id"
STRIPE_PRICE_ID_BUSINESS="price_your_business_price_id"
```

### 5. Test Payments

Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0027 6000 3184`

## 📝 API Endpoints

### Create Checkout Session

```bash
POST /api/payments/create-checkout
Authorization: Bearer <token>

{
  "tier": "pro" // or "business"
}
```

Response:
```json
{
  "ok": true,
  "data": {
    "url": "https://checkout.stripe.com/..."
  }
}
```

### Revenue Share Calculation

```bash
POST /api/revenue-share/calculate
Authorization: Bearer <admin_token>

{
  "period": "2024-01"
}
```

### Get Earnings

```bash
GET /api/revenue-share/earnings?limit=12
Authorization: Bearer <token>
```

## 💰 Revenue Share Model

- **Platform Share**: 70% of subscription revenue
- **Creator Share**: 30% distributed based on usage
- **Calculation**: Monthly based on tutoring engagement
- **Payout**: Tracked in Earnings table

## 🎯 Subscription Tiers

### Free
- 2 calculators
- No AI generation
- No tutoring

### Pro ($10/month)
- Unlimited calculators
- AI generation
- Tutoring access
- Basic analytics

### Business ($39/month)
- Everything in Pro
- Advanced analytics
- API access
- Private branding

## 🚀 Next Steps

1. **Add Payment UI** to mobile app
2. **Implement Payout System** (Stripe Connect)
3. **Add Usage Tracking** for revenue attribution
4. **Create Admin Dashboard** for revenue management

---

**Status**: Stripe integration ready! Configure products and webhooks to enable payments. 💳




