# Calculator Creator App - Comprehensive Development Plan

## 📋 Executive Summary

A mobile-first, AI-powered platform for creating, hosting, and sharing engineering calculators. Users describe calculators in natural language, AI generates validated calculator specs, and the platform hosts them with a freemium model. Core monetization is $10/month tutoring subscriptions with revenue sharing to calculator creators.

---

## 🏗️ Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    EXPO MOBILE APP (Frontend)                │
│  - Calculator Creator UI                                     │
│  - Marketplace/Browse                                        │
│  - Calculator Runner                                         │
│  - User Profile & Analytics                                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ REST API / GraphQL
                       │
┌──────────────────────▼──────────────────────────────────────┐
│              NEXT.JS BACKEND (API Server)                   │
│  - API Routes (REST/GraphQL)                                │
│  - Authentication (NextAuth + Supabase)                     │
│  - Calculator CRUD                                           │
│  - Payment Processing (Stripe)                              │
│  - Analytics & Usage Tracking                               │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
┌───────▼──────┐ ┌─────▼──────┐ ┌───▼──────────┐
│   SUPABASE   │ │  LANGGRAPH  │ │   STRIPE     │
│   (Database) │ │  (AI Agent) │ │  (Payments)  │
│   - Postgres │ │  - Vetting  │ │  - Subscriptions│
│   - Auth     │ │  - Generation│ │  - Webhooks │
│   - Storage  │ │  - Docs     │ │              │
│   - RLS      │ │             │ │              │
└──────────────┘ └─────────────┘ └──────────────┘
```

### Technology Stack

#### Frontend (Expo)
- **Framework**: Expo SDK 51+ with Expo Router
- **Language**: TypeScript
- **UI Library**: React Native Paper / Tamagui
- **State Management**: Zustand / React Query
- **Forms**: React Hook Form
- **Charts**: Victory Native / Recharts
- **Navigation**: Expo Router (file-based)
- **Image/Media**: Expo Image Picker, Camera
- **Offline**: Expo SQLite (local cache)

#### Backend (Next.js)
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **API**: Next.js API Routes + tRPC (optional)
- **Database**: Supabase (PostgreSQL)
- **ORM**: Prisma / Drizzle ORM
- **Auth**: NextAuth.js + Supabase Auth
- **File Storage**: Supabase Storage / AWS S3
- **Queue**: BullMQ / Vercel Queue
- **Search**: Postgres Full-Text + pgvector

#### AI/ML Stack
- **Orchestration**: LangGraph / LangChain
- **LLM**: OpenAI GPT-4 / Anthropic Claude
- **Embeddings**: OpenAI text-embedding-3
- **Vector DB**: pgvector (Supabase)
- **Math Engine**: mathjs (safe evaluation)
- **Testing**: fast-check (property-based)

#### Infrastructure
- **Hosting**: Vercel (Next.js) + EAS (Expo)
- **CDN**: Cloudflare
- **Monitoring**: Sentry
- **Analytics**: PostHog / Mixpanel
- **Payments**: Stripe
- **Email**: Resend / SendGrid

---

## 📁 Project Structure (Monorepo)

```
calculator-creator-app/
├── apps/
│   ├── mobile/                 # Expo app
│   │   ├── app/               # Expo Router pages
│   │   │   ├── (auth)/
│   │   │   ├── (tabs)/
│   │   │   │   ├── index.tsx  # Marketplace
│   │   │   │   ├── create.tsx # Creator
│   │   │   │   ├── profile.tsx
│   │   │   │   └── calculator/[id].tsx
│   │   │   └── _layout.tsx
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── services/
│   │   └── package.json
│   │
│   └── web/                    # Next.js admin/builder (optional)
│       ├── app/
│       ├── components/
│       └── package.json
│
├── packages/
│   ├── shared/                 # Shared types & utils
│   │   ├── src/
│   │   │   ├── types/
│   │   │   ├── constants/
│   │   │   └── utils/
│   │   └── package.json
│   │
│   ├── calculator-spec/       # CalculatorSpec schema
│   │   ├── src/
│   │   │   ├── spec.ts         # Zod schema
│   │   │   ├── examples/
│   │   │   └── validators.ts
│   │   └── package.json
│   │
│   ├── calculator-evaluator/  # Safe math evaluator
│   │   ├── src/
│   │   │   ├── evaluator.ts
│   │   │   ├── units.ts
│   │   │   └── constraints.ts
│   │   └── package.json
│   │
│   └── ui/                     # Shared UI components
│       └── package.json
│
├── services/
│   ├── api/                    # Next.js API
│   │   ├── app/
│   │   │   ├── api/
│   │   │   │   ├── calculators/
│   │   │   │   ├── users/
│   │   │   │   ├── payments/
│   │   │   │   ├── ai/
│   │   │   │   └── webhooks/
│   │   │   ├── (auth)/
│   │   │   └── layout.tsx
│   │   ├── lib/
│   │   │   ├── db/
│   │   │   ├── auth/
│   │   │   ├── ai/
│   │   │   └── stripe/
│   │   └── package.json
│   │
│   └── ai-orchestrator/        # LangGraph service
│       ├── src/
│       │   ├── graph.ts        # LangGraph workflow
│       │   ├── nodes/
│       │   │   ├── vet-idea.ts
│       │   │   ├── generate-spec.ts
│       │   │   ├── validate.ts
│       │   │   └── generate-docs.ts
│       │   └── server.ts
│       └── package.json
│
├── database/
│   ├── migrations/
│   ├── schema.prisma           # Prisma schema
│   └── seeds/
│
├── infrastructure/
│   ├── docker-compose.yml
│   └── terraform/              # Optional
│
├── docs/
│   ├── api.md
│   ├── database.md
│   └── deployment.md
│
├── package.json                # Root workspace
├── pnpm-workspace.yaml
├── turbo.json                  # Turborepo config
└── README.md
```

---

## 🗄️ Database Schema

### Core Tables

```prisma
// Prisma Schema

model User {
  id            String   @id @default(cuid())
  email         String   @unique
  username      String?  @unique
  name          String?
  avatar        String?
  bio           String?
  verified      Boolean  @default(false)
  
  // Subscription
  subscriptionTier String @default("free") // free, pro, business
  subscriptionId   String? // Stripe subscription ID
  subscriptionStatus String? // active, canceled, past_due
  
  // Gamification
  xp            Int      @default(0)
  level         Int      @default(1)
  badges        String[] @default([])
  
  // Timestamps
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  // Relations
  calculators   Calculator[]
  ideas         Idea[]
  runs          CalculatorRun[]
  feedback      Feedback[]
  earnings      Earnings[]
}

model Calculator {
  id            String   @id @default(cuid())
  slug          String   @unique
  title         String
  summary       String?
  category      String
  tags          String[]
  
  // Spec (JSON)
  spec          Json     // CalculatorSpec JSON
  
  // Status
  status        String   @default("draft") // draft, pending, approved, published, archived
  reviewStatus  String?  // pending, approved, rejected
  reviewNotes   String?
  
  // Attribution
  creatorId     String
  creator       User     @relation(fields: [creatorId], references: [id])
  
  // Versioning
  version       Int      @default(1)
  parentId      String?  // For versioning
  
  // Physics Vetting
  physicsVetted Boolean  @default(false)
  vettingChecks Json?    // Array of check results
  
  // Analytics
  viewCount     Int      @default(0)
  runCount      Int      @default(0)
  shareCount    Int      @default(0)
  favoriteCount Int     @default(0)
  
  // Ranking
  trendingScore Float   @default(0)
  qualityScore  Float   @default(0)
  
  // SEO
  seoTitle      String?
  seoDescription String?
  
  // Timestamps
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  publishedAt   DateTime?
  
  // Relations
  versions      CalculatorVersion[]
  runs          CalculatorRun[]
  feedback      Feedback[]
  examples      CalculatorExample[]
}

model CalculatorVersion {
  id            String   @id @default(cuid())
  calculatorId  String
  calculator    Calculator @relation(fields: [calculatorId], references: [id])
  version       Int
  spec          Json
  changelog     String?
  createdAt     DateTime @default(now())
}

model Idea {
  id            String   @id @default(cuid())
  prompt        String
  imageUrl      String?  // If from photo
  status        String   @default("submitted") // submitted, vetting, approved, rejected, generated
  vettingResult Json?    // AI vetting analysis
  calculatorId  String?  // If generated
  creatorId     String
  creator       User     @relation(fields: [creatorId], references: [id])
  createdAt     DateTime @default(now())
}

model CalculatorRun {
  id            String   @id @default(cuid())
  calculatorId  String
  calculator    Calculator @relation(fields: [calculatorId], references: [id])
  userId        String?
  user          User?    @relation(fields: [userId], references: [id])
  
  inputs        Json
  outputs       Json
  duration      Int?     // milliseconds
  success       Boolean  @default(true)
  error         String?
  
  createdAt     DateTime @default(now())
}

model Feedback {
  id            String   @id @default(cuid())
  calculatorId  String
  calculator    Calculator @relation(fields: [calculatorId], references: [id])
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  
  rating        Int      // 1-5
  comment       String?
  helpful       Boolean?
  
  createdAt     DateTime @default(now())
}

model CalculatorExample {
  id            String   @id @default(cuid())
  calculatorId  String
  calculator    Calculator @relation(fields: [calculatorId], references: [id])
  inputs        Json
  outputs       Json
  description   String?
}

model Earnings {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  
  period        String   // "2024-01"
  calculatorId  String?
  amount        Decimal  // Revenue share amount
  usageCount    Int      // Calculator runs attributed
  
  createdAt     DateTime @default(now())
}

model Subscription {
  id            String   @id @default(cuid())
  userId        String   @unique
  stripeId      String   @unique
  tier          String
  status        String
  currentPeriodEnd DateTime?
  cancelAtPeriodEnd Boolean @default(false)
  createdAt     DateTime @default(now())
}

model TutoringSession {
  id            String   @id @default(cuid())
  userId        String
  calculatorId  String
  messages      Json     // Chat messages
  startedAt     DateTime @default(now())
  endedAt       DateTime?
}
```

### Indexes

```sql
-- Performance indexes
CREATE INDEX idx_calculator_status ON "Calculator"(status);
CREATE INDEX idx_calculator_category ON "Calculator"(category);
CREATE INDEX idx_calculator_trending ON "Calculator"(trending_score DESC);
CREATE INDEX idx_calculator_created ON "Calculator"(created_at DESC);

-- Full-text search
CREATE INDEX idx_calculator_search ON "Calculator" 
  USING gin(to_tsvector('english', title || ' ' || COALESCE(summary, '')));

-- Vector similarity (pgvector)
CREATE INDEX idx_calculator_embedding ON "Calculator" 
  USING ivfflat (embedding vector_cosine_ops);
```

---

## 🔌 API Design

### REST API Endpoints

#### Authentication
```
POST   /api/auth/signup
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
POST   /api/auth/refresh
```

#### Calculators
```
GET    /api/calculators              # List (with filters, pagination)
GET    /api/calculators/:id          # Get one
POST   /api/calculators               # Create (requires auth)
PUT    /api/calculators/:id          # Update (owner only)
DELETE /api/calculators/:id          # Delete (owner only)
GET    /api/calculators/:id/schema   # Get JSON Schema for AI agents
POST   /api/calculators/:id/evaluate  # Run calculator
GET    /api/calculators/:id/versions # Version history
POST   /api/calculators/:id/publish  # Publish (triggers review)
```

#### Ideas & AI
```
POST   /api/ideas                     # Submit idea
GET    /api/ideas/:id                # Get idea status
POST   /api/ai/generate               # Generate calculator from prompt
POST   /api/ai/vet-idea               # Vet idea (AI)
GET    /api/ai/status/:jobId          # Check generation status
```

#### Marketplace
```
GET    /api/marketplace/trending      # Trending calculators
GET    /api/marketplace/categories    # Categories list
GET    /api/marketplace/search        # Search (full-text + vector)
GET    /api/marketplace/related/:id   # Related calculators
```

#### User & Profile
```
GET    /api/users/:id                 # Get user profile
PUT    /api/users/:id                 # Update profile
GET    /api/users/:id/calculators     # User's calculators
GET    /api/users/:id/earnings         # Revenue share earnings
```

#### Payments & Subscriptions
```
POST   /api/payments/create-checkout  # Stripe checkout
POST   /api/payments/webhook          # Stripe webhook
GET    /api/subscriptions/me          # Current subscription
POST   /api/subscriptions/cancel      # Cancel subscription
```

#### Analytics
```
GET    /api/analytics/calculator/:id  # Calculator analytics
GET    /api/analytics/user            # User analytics
```

### AI Agent Endpoints

```
GET    /.well-known/ai-actions.json  # AI manifest
GET    /openapi.json                 # OpenAPI spec
GET    /v1/calculators                # List (for agents)
GET    /v1/calculators/:id/schema    # JSON Schema
POST   /v1/calculators/:id/evaluate   # Evaluate (with version pinning)
POST   /v1/calculators/:id/batch      # Batch evaluation
```

### GraphQL (Optional)

```graphql
type Query {
  calculators(
    filter: CalculatorFilter
    pagination: Pagination
  ): CalculatorConnection
  
  calculator(id: ID!): Calculator
  user(id: ID!): User
}

type Mutation {
  createCalculator(input: CreateCalculatorInput!): Calculator
  evaluateCalculator(id: ID!, inputs: JSON!): EvaluationResult
  submitIdea(prompt: String!): Idea
}
```

---

## 🎨 Frontend Features (Expo App)

### Screens & Navigation

#### Tab Navigation
1. **Marketplace** (`/`)
   - Trending calculators
   - Categories
   - Search
   - Filters (category, tags, verified)

2. **Create** (`/create`)
   - Text input for prompt
   - Photo capture/upload
   - Live preview
   - Save as draft / Publish

3. **Profile** (`/profile`)
   - User stats (XP, level, badges)
   - My calculators
   - Earnings dashboard
   - Settings

4. **Calculator Detail** (`/calculator/[id]`)
   - Calculator UI (inputs/outputs)
   - Documentation
   - Share button (LinkedIn)
   - Tutor button (if subscribed)
   - Feedback (rating, comment)

### Key Components

- `CalculatorForm` - Dynamic form from spec
- `CalculatorOutput` - Results display
- `MarketplaceCard` - Calculator card with trending badge
- `CreatorWizard` - Step-by-step creation flow
- `TutorChat` - AI tutoring interface
- `ShareSheet` - Social sharing (LinkedIn, etc.)

### State Management

- **Zustand** stores:
  - Auth state
  - User profile
  - Calculator cache
  - Offline queue

- **React Query** for:
  - Server state
  - Caching
  - Optimistic updates

---

## ⚙️ Backend Features (Next.js)

### API Routes

#### `/api/calculators`
- CRUD operations
- Validation (Zod)
- Authorization (middleware)
- Rate limiting

#### `/api/ai/*`
- LangGraph integration
- Job queue for async generation
- WebSocket for progress updates

#### `/api/payments/*`
- Stripe integration
- Webhook handling
- Subscription management

### Middleware

- Auth verification
- Rate limiting (per user/IP)
- Request logging
- Error handling

### Background Jobs

- Calculator generation (queue)
- Trending score calculation (cron)
- Revenue share calculation (monthly)
- Email notifications

---

## 🤖 AI Integration (LangGraph)

### Workflow Graph

```
┌─────────────┐
│  START      │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  Parse Prompt   │ (LLM extracts variables, formulas)
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Vet Idea       │ (Check originality, complexity, demand)
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Generate Spec  │ (Create CalculatorSpec JSON)
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Validate       │ (Schema, units, constraints)
└──────┬──────────┘
       │
    ┌──┴──┐
    │ Pass│
    └──┬──┘
       │
       ▼
┌─────────────────┐
│  Generate Docs  │ (Variables, theory, accuracy)
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Run Tests      │ (Property-based, examples)
└──────┬──────────┘
       │
    ┌──┴──┐
    │ Pass│
    └──┬──┘
       │
       ▼
┌─────────────────┐
│  END            │ (Save to DB, notify user)
└─────────────────┘
```

### LangGraph Nodes

1. **ParsePromptNode**
   - Input: User prompt (text/image)
   - Output: Structured data (variables, formulas, units)
   - LLM: GPT-4 with structured output

2. **VetIdeaNode**
   - Check against existing calculators (vector similarity)
   - Assess complexity
   - Estimate market demand
   - Output: Vetting result + suggestions

3. **GenerateSpecNode**
   - Create CalculatorSpec JSON
   - Validate against Zod schema
   - Output: Valid spec or errors

4. **ValidateNode**
   - Dimensional analysis
   - Unit consistency
   - Domain constraints
   - Output: Validation result

5. **GenerateDocsNode**
   - Write documentation (variables, theory, accuracy)
   - SEO optimization
   - Output: Markdown/HTML

6. **RunTestsNode**
   - Property-based tests (fast-check)
   - Example verification
   - Numerical stability
   - Output: Test results

---

## 💰 Monetization Flow

### Subscription Tiers

| Tier | Monthly | Features |
|------|---------|----------|
| **Free** | $0 | 2 hosted calculators, basic templates |
| **Pro** | $10 | Unlimited calculators, AI tutoring access, SEO docs |
| **Business** | $39 | Advanced analytics, private branding, API access |

### Revenue Share Model

- **70/30 Split** (Platform/Creator)
- Based on tutoring engagement (users who start tutoring from a calculator)
- Monthly payout to creators
- Minimum payout: $10

### Hosting Fees

- **One-time fee**: $35 per calculator (CAC + margin)
- Covers hosting, CDN, moderation

### Payment Flow

```
User subscribes ($10/mo)
  ↓
Stripe webhook → Update subscription in DB
  ↓
User uses calculator → Clicks "Get Tutoring"
  ↓
Tutoring session tracked
  ↓
Monthly: Calculate revenue share
  ↓
Payout to calculator creators
```

---

## 🚀 Development Phases

### Phase 1: Foundation (Weeks 1-2)
- [ ] Monorepo setup (Turborepo/pnpm)
- [ ] Database schema (Prisma + Supabase)
- [ ] Auth system (NextAuth + Supabase)
- [ ] Basic API routes
- [ ] Expo app shell (navigation, auth screens)

### Phase 2: Calculator Core (Weeks 3-4)
- [ ] CalculatorSpec schema (Zod)
- [ ] Safe evaluator (mathjs)
- [ ] Calculator renderer (dynamic forms)
- [ ] Basic CRUD (create, read, update)
- [ ] Calculator runner UI

### Phase 3: AI Integration (Weeks 5-6)
- [ ] LangGraph setup
- [ ] Prompt parsing node
- [ ] Spec generation node
- [ ] Validation node
- [ ] End-to-end generation flow

### Phase 4: Marketplace (Weeks 7-8)
- [ ] Browse/trending UI
- [ ] Search (full-text + vector)
- [ ] Categories & tags
- [ ] Ranking algorithm (Wilson score, trending)
- [ ] Share functionality (LinkedIn)

### Phase 5: Monetization (Weeks 9-10)
- [ ] Stripe integration
- [ ] Subscription management
- [ ] Payment webhooks
- [ ] Revenue share calculation
- [ ] Earnings dashboard

### Phase 6: Tutoring (Weeks 11-12)
- [ ] AI tutoring chat interface
- [ ] Context-aware responses
- [ ] Session tracking
- [ ] Attribution to calculators

### Phase 7: Gamification (Weeks 13-14)
- [ ] XP system
- [ ] Badges
- [ ] Leaderboards
- [ ] Achievement unlocks

### Phase 8: Polish & Launch (Weeks 15-16)
- [ ] Performance optimization
- [ ] Error handling
- [ ] Analytics integration
- [ ] Beta testing
- [ ] Launch preparation

---

## 📊 Success Metrics

### User Metrics
- DAU/MAU
- Calculator creation rate
- Calculator usage rate
- Subscription conversion rate

### Business Metrics
- MRR (Monthly Recurring Revenue)
- CAC (Customer Acquisition Cost)
- LTV (Lifetime Value)
- Revenue share payouts

### Product Metrics
- Time to generate calculator
- Calculator quality score
- Tutoring engagement rate
- Share rate

---

## 🔒 Security & Compliance

### Security
- Input sanitization (calculator inputs)
- Safe expression evaluation (no eval)
- Rate limiting
- SQL injection prevention (Prisma)
- XSS protection
- CSRF tokens

### Compliance
- GDPR compliance (EU users)
- Data retention policies
- User data export
- Privacy policy
- Terms of service

---

## 📝 Next Steps

1. **Set up monorepo** with Turborepo
2. **Initialize Supabase project** and database
3. **Create Prisma schema** from design above
4. **Set up Expo app** with basic navigation
5. **Set up Next.js API** with auth
6. **Implement CalculatorSpec** schema
7. **Build safe evaluator** with mathjs
8. **Integrate LangGraph** for AI workflow

---

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Next.js Documentation](https://nextjs.org/docs)
- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/)
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe API](https://stripe.com/docs/api)

---

**Last Updated**: 2024
**Version**: 1.0




