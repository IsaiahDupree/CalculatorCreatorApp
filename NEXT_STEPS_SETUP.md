# Next Steps - Complete Setup Guide

## ✅ Step 1: Database is Running!

Your local Postgres database is already running at:
```
postgresql://postgres:postgres@127.0.0.1:5432/postgres
```

## 📝 Step 2: Create .env File

Create `services/api/.env` with this content:

```env
# Database (Local Postgres)
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/postgres"

# NextAuth
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="your-secret-key-change-in-production-min-32-chars"

# Supabase (optional for now - can use local or cloud)
SUPABASE_URL="http://127.0.0.1:54321"
SUPABASE_SERVICE_KEY="your-service-key"
SUPABASE_ANON_KEY="your-anon-key"

# OpenAI (for AI generation - get from https://platform.openai.com/api-keys)
OPENAI_API_KEY="your-openai-api-key"

# Stripe (optional for now - get from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"
STRIPE_PUBLISHABLE_KEY="pk_test_your-stripe-publishable-key"
STRIPE_WEBHOOK_SECRET="whsec_your-webhook-secret"

# OAuth (optional for now)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# Admin Users
ADMIN_USER_IDS=""
```

**Quick Copy:**
```bash
# Windows PowerShell
cd services/api
@"
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/postgres"
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="dev-secret-key-min-32-characters-long-change-in-production"
"@ | Out-File -FilePath .env -Encoding utf8
```

## 🗄️ Step 3: Setup Database Schema

```bash
cd services/api

# Generate Prisma client
pnpm db:generate

# Push schema to database
pnpm db:push

# (Optional) Seed with example data
pnpm db:seed
```

## ✅ Step 4: Verify Setup

```bash
# Check database connection
pnpm db:studio
# This opens Prisma Studio at http://localhost:5555
```

## 🚀 Step 5: Start Development Servers

### Terminal 1: Backend API
```bash
cd services/api
pnpm dev
# Runs on http://localhost:3001
```

### Terminal 2: AI Orchestrator (Optional)
```bash
cd services/ai-orchestrator
pnpm dev
# Runs on http://localhost:8787
```

### Terminal 3: Mobile App
```bash
cd apps/mobile
pnpm start
# Opens Expo dev tools
```

## 🧪 Step 6: Test the Setup

### Test Database Connection
```bash
cd services/api
pnpm db:studio
# Should open Prisma Studio showing your tables
```

### Test API
```bash
# Health check
curl http://localhost:3001/api/health

# Should return: {"ok":true,"message":"API is healthy"}
```

## 📋 Checklist

- [ ] Database running (`calc-creator-db` container)
- [ ] `.env` file created in `services/api/`
- [ ] Prisma client generated (`pnpm db:generate`)
- [ ] Database schema pushed (`pnpm db:push`)
- [ ] (Optional) Database seeded (`pnpm db:seed`)
- [ ] Backend API starts (`pnpm dev` in services/api)
- [ ] Health check works (`/api/health`)

## 🎯 What You'll Have

After completing these steps:

✅ **Database** - Postgres with all tables
✅ **API** - Backend running on port 3001
✅ **Schema** - All models created
✅ **Example Data** - (if seeded) Test user and calculators

## 🔧 Troubleshooting

### Database Connection Issues
```bash
# Check if database is running
docker ps | findstr calc-creator-db

# Restart database
.\scripts\start-db.ps1
```

### Prisma Issues
```bash
# Reset Prisma client
cd services/api
pnpm db:generate

# Reset database (WARNING: deletes all data)
pnpm db:push --force-reset
```

### Port Already in Use
```bash
# Change port in services/api/package.json
# "dev": "next dev -p 3002"  # Use different port
```

---

**Ready to go!** Follow these steps and you'll have everything running. 🚀




