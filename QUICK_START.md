# Quick Start Guide - Calculator Creator App

## 🎯 Project Overview

Build a mobile-first calculator creator platform where users can:
- Describe calculators in natural language
- AI generates validated calculator specs
- Host and share calculators
- Earn revenue share from tutoring subscriptions

## 🛠️ Tech Stack Summary

- **Frontend**: Expo (React Native) - iOS, Android, Web
- **Backend**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL + Auth + Storage)
- **AI**: LangGraph for orchestration, OpenAI GPT-4
- **Payments**: Stripe
- **Monorepo**: Turborepo + pnpm workspaces

## 📦 Initial Setup

### Prerequisites
- Node.js 18+
- pnpm 9+
- Expo CLI
- Supabase account
- Stripe account
- OpenAI API key

### Step 1: Clone & Install

```bash
# Create project directory
mkdir calculator-creator-app
cd calculator-creator-app

# Initialize monorepo
pnpm init
pnpm add -D -w turbo

# Create workspace structure
mkdir -p apps/mobile apps/web packages/shared packages/calculator-spec packages/calculator-evaluator services/api services/ai-orchestrator
```

### Step 2: Workspace Configuration

**pnpm-workspace.yaml**
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'services/*'
```

**package.json** (root)
```json
{
  "name": "calculator-creator-app",
  "private": true,
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint"
  },
  "devDependencies": {
    "turbo": "^1.10.0"
  }
}
```

### Step 3: Set Up Expo App

```bash
cd apps/mobile
npx create-expo-app@latest . --template blank-typescript
```

**apps/mobile/package.json**
```json
{
  "name": "mobile",
  "version": "1.0.0",
  "main": "expo-entry.js",
  "scripts": {
    "start": "expo start",
    "dev": "expo start",
    "ios": "expo start --ios",
    "android": "expo start --android"
  },
  "dependencies": {
    "expo": "~51.0.0",
    "expo-router": "~3.5.0",
    "react": "18.2.0",
    "react-native": "0.74.3",
    "@react-navigation/native": "^6.1.0"
  }
}
```

### Step 4: Set Up Next.js API

```bash
cd services/api
npx create-next-app@latest . --typescript --app --no-tailwind
```

**services/api/package.json**
```json
{
  "name": "api",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^14.2.5",
    "react": "^18.2.0",
    "@prisma/client": "^5.7.0",
    "next-auth": "^4.24.0",
    "@supabase/supabase-js": "^2.38.0"
  }
}
```

### Step 5: Database Setup

```bash
cd services/api
npx prisma init
```

**prisma/schema.prisma** - Use schema from PROJECT_PLAN.md

```bash
# Generate Prisma client
npx prisma generate

# Push schema to Supabase
npx prisma db push
```

### Step 6: Environment Variables

**apps/mobile/.env**
```
EXPO_PUBLIC_API_URL=http://localhost:3001
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**services/api/.env**
```
DATABASE_URL=your_supabase_connection_string
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3001
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
OPENAI_API_KEY=your_openai_key
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

## 🚀 Running the App

### Development Mode

```bash
# Terminal 1: Start Next.js API
cd services/api
pnpm dev

# Terminal 2: Start Expo app
cd apps/mobile
pnpm start

# Terminal 3: Start AI orchestrator (if separate)
cd services/ai-orchestrator
pnpm dev
```

### Build for Production

```bash
# Build all packages
pnpm build

# Build Expo app
cd apps/mobile
eas build --platform ios
eas build --platform android

# Deploy Next.js
cd services/api
vercel deploy
```

## 📱 Key Features to Implement First

1. **Authentication** (Week 1)
   - Sign up / Login
   - Profile screen

2. **Calculator Spec** (Week 2)
   - Define CalculatorSpec schema
   - Create example calculators

3. **Calculator Runner** (Week 3)
   - Dynamic form from spec
   - Safe evaluation
   - Results display

4. **AI Generation** (Week 4)
   - LangGraph setup
   - Prompt → Spec pipeline
   - Preview generated calculator

## 🔗 Useful Commands

```bash
# Install dependencies across all workspaces
pnpm install

# Run command in specific workspace
pnpm -F mobile start
pnpm -F api dev

# Add dependency to workspace
pnpm -F mobile add react-native-paper
pnpm -F api add @prisma/client

# Run tests
pnpm test

# Lint
pnpm lint
```

## 📚 Next Steps

1. Review `PROJECT_PLAN.md` for detailed architecture
2. Set up Supabase project and configure auth
3. Implement CalculatorSpec schema
4. Build basic calculator runner
5. Integrate LangGraph for AI generation

## 🐛 Troubleshooting

### Expo Issues
- Clear cache: `expo start -c`
- Reset Metro: `npx react-native start --reset-cache`

### Prisma Issues
- Regenerate client: `npx prisma generate`
- Reset database: `npx prisma migrate reset`

### Workspace Issues
- Reinstall: `rm -rf node_modules && pnpm install`

---

**Need Help?** Check the main `PROJECT_PLAN.md` for detailed architecture and implementation details.




