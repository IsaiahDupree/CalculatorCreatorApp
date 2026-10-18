# Calculator Creator App

> AI-powered platform for creating, hosting, and sharing engineering calculators

## 🎯 Vision

A mobile-first platform where users describe calculators in natural language, AI generates validated calculator specs, and creators earn revenue share from tutoring subscriptions.

## ✨ Key Features

- **AI-Powered Creation**: Describe a calculator in text or upload a photo, AI generates a validated calculator
- **Physics Vetting**: Automated validation of formulas, units, and dimensional consistency
- **Marketplace**: Browse trending calculators by category, search, and discover
- **Tutoring Layer**: $10/month subscription for AI-powered step-by-step tutoring
- **Revenue Share**: Creators earn 30% of tutoring revenue based on usage
- **Gamification**: XP, badges, levels, and leaderboards
- **Social Sharing**: Share calculators to LinkedIn and other platforms
- **AI Agent Access**: Expose calculators as API endpoints for AI agents

## 🏗️ Architecture

- **Frontend**: Expo (React Native) - iOS, Android, Web
- **Backend**: Next.js 14 (App Router) - API routes, serverless
- **Database**: Supabase (PostgreSQL + Auth + Storage)
- **AI**: LangGraph orchestration + OpenAI GPT-4
- **Payments**: Stripe subscriptions
- **Monorepo**: Turborepo + pnpm workspaces

## 📁 Project Structure

```
calculator-creator-app/
├── apps/
│   ├── mobile/          # Expo app
│   └── web/             # Next.js web (optional)
├── packages/
│   ├── shared/          # Shared types & utils
│   ├── calculator-spec/ # CalculatorSpec schema
│   └── calculator-evaluator/ # Safe math evaluator
└── services/
    ├── api/             # Next.js API
    └── ai-orchestrator/ # LangGraph service
```

## 🚀 Quick Start

See [QUICK_START.md](./QUICK_START.md) for setup instructions.

```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev
```

## 📖 Documentation

- **[PROJECT_PLAN.md](./PROJECT_PLAN.md)** - Comprehensive development plan
- **[QUICK_START.md](./QUICK_START.md)** - Setup and getting started guide
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Quick testing reference
- **[docs/TESTING_SETUP.md](./docs/TESTING_SETUP.md)** - Complete testing setup & architecture
- **[docs/TESTING_KNOWLEDGE_BASE.md](./docs/TESTING_KNOWLEDGE_BASE.md)** - Testing concepts & best practices

## 🗺️ Development Roadmap

### Phase 1: Foundation (Weeks 1-2)
- Monorepo setup
- Database schema
- Auth system
- Basic API routes

### Phase 2: Calculator Core (Weeks 3-4)
- CalculatorSpec schema
- Safe evaluator
- Calculator renderer
- Basic CRUD

### Phase 3: AI Integration (Weeks 5-6)
- LangGraph setup
- Prompt parsing
- Spec generation
- Validation

### Phase 4: Marketplace (Weeks 7-8)
- Browse/trending UI
- Search
- Categories & tags
- Ranking algorithm

### Phase 5: Monetization (Weeks 9-10)
- Stripe integration
- Subscriptions
- Revenue share
- Earnings dashboard

### Phase 6: Tutoring (Weeks 11-12)
- AI tutoring chat
- Session tracking
- Attribution

### Phase 7: Gamification (Weeks 13-14)
- XP system
- Badges
- Leaderboards

### Phase 8: Launch (Weeks 15-16)
- Polish
- Testing
- Launch

## 💰 Business Model

- **Free Tier**: 2 hosted calculators
- **Pro Tier**: $10/month - Unlimited calculators + AI tutoring
- **Business Tier**: $39/month - Advanced features + API access
- **Revenue Share**: 30% to creators based on tutoring engagement
- **Hosting Fee**: $35 one-time per calculator

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Expo SDK 51, React Native, TypeScript |
| Backend | Next.js 14, TypeScript |
| Database | Supabase (PostgreSQL) |
| Auth | NextAuth.js + Supabase Auth |
| AI | LangGraph, OpenAI GPT-4 |
| Payments | Stripe |
| Math | mathjs (safe evaluation) |
| Testing | Vitest, fast-check (property-based) |

## 📊 Key Metrics

- DAU/MAU
- Calculator creation rate
- Subscription conversion rate
- MRR (Monthly Recurring Revenue)
- Revenue share payouts

## 🤝 Contributing

This is a private project. For questions or suggestions, please contact the team.

## 📄 License

Proprietary - All rights reserved

---

**Status**: 🚧 In Development  
**Version**: 0.1.0

