# Setup Instructions

## Prerequisites

- Node.js 18+ installed
- pnpm 9+ installed (`npm install -g pnpm`)
- Expo CLI (optional, but recommended)
- Supabase account (for database)
- OpenAI API key (for AI features)

## Step 1: Install Dependencies

```bash
# Install all workspace dependencies
pnpm install
```

## Step 2: Set Up Environment Variables

### Backend API (.env in services/api/)

```env
# Database
DATABASE_URL="your_supabase_connection_string"

# NextAuth
NEXTAUTH_SECRET="generate_a_random_secret"
NEXTAUTH_URL="http://localhost:3001"

# Supabase
SUPABASE_URL="your_supabase_url"
SUPABASE_SERVICE_KEY="your_supabase_service_key"

# OpenAI (for AI features)
OPENAI_API_KEY="your_openai_api_key"

# Stripe (for payments)
STRIPE_SECRET_KEY="your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="your_stripe_webhook_secret"
```

### Mobile App (.env in apps/mobile/)

```env
EXPO_PUBLIC_API_URL="http://localhost:3001"
EXPO_PUBLIC_SUPABASE_URL="your_supabase_url"
EXPO_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
```

## Step 3: Set Up Supabase

1. Create a new Supabase project
2. Copy the connection string to `DATABASE_URL`
3. Copy the URL and anon key to mobile app env
4. Run Prisma migrations (when schema is ready)

## Step 4: Run Development Servers

### Terminal 1: Backend API
```bash
cd services/api
pnpm dev
# Runs on http://localhost:3001
```

### Terminal 2: Mobile App
```bash
cd apps/mobile
pnpm start
# Opens Expo dev tools
# Press 'i' for iOS simulator
# Press 'a' for Android emulator
# Press 'w' for web
```

## Step 5: Test the Setup

### Test API Health
```bash
curl http://localhost:3001/api/health
```

### Test Calculator Evaluation
```bash
# First, create a calculator via API
# Then evaluate it:
curl -X POST http://localhost:3001/api/calculators/{id}/evaluate \
  -H "Content-Type: application/json" \
  -d '{"inputs": {"V": 12, "R": 6}}'
```

## Troubleshooting

### pnpm install fails
- Make sure you're using pnpm 9+
- Try deleting `node_modules` and `pnpm-lock.yaml`, then `pnpm install`

### Expo won't start
- Clear Expo cache: `expo start -c`
- Make sure you have the Expo Go app installed on your device

### API connection errors
- Check that the API is running on port 3001
- Verify `EXPO_PUBLIC_API_URL` in mobile app .env
- For iOS simulator, use `http://localhost:3001`
- For Android emulator, use `http://10.0.2.2:3001`
- For physical device, use your computer's IP address

### TypeScript errors
- Run `pnpm build` in each package to generate types
- Make sure all packages are linked correctly

## Next Steps

1. Set up Prisma schema and database
2. Implement authentication
3. Connect API to database
4. Test calculator creation and evaluation
5. Set up AI generation (LangGraph)

See `DEVELOPMENT_STATUS.md` for current progress.




