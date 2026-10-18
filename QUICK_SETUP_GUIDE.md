# Quick Setup Guide - Next Steps

## ✅ Database is Running!

Your Postgres database is already running. Now let's set up the rest.

## 📝 Step 1: Create .env File

**Location:** `services/api/.env`

**Content:**
```env
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/postgres"
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="dev-secret-key-min-32-characters-long-change-in-production"
```

**Quick Create (PowerShell):**
```powershell
cd services/api
@"
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/postgres"
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="dev-secret-key-min-32-characters-long-change-in-production"
"@ | Out-File -FilePath .env -Encoding utf8
```

## 🔧 Step 2: Install Dependencies (if needed)

```bash
# Install pnpm if not installed
npm install -g pnpm

# Install all dependencies
pnpm install
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

## ✅ Step 4: Verify

```bash
# Open Prisma Studio to see your database
pnpm db:studio
# Opens at http://localhost:5555
```

## 🚀 Step 5: Start Development

```bash
# Terminal 1: Backend API
cd services/api
pnpm dev
# Runs on http://localhost:3001

# Terminal 2: Mobile App
cd apps/mobile
pnpm start
# Opens Expo dev tools
```

## 🧪 Test It

```bash
# Test API health
curl http://localhost:3001/api/health

# Should return: {"ok":true,"message":"API is healthy"}
```

## 📋 Manual Steps (if scripts don't work)

1. **Create .env manually:**
   - Go to `services/api/`
   - Create `.env` file
   - Add the DATABASE_URL and NEXTAUTH_URL

2. **Run commands manually:**
   ```bash
   cd services/api
   pnpm install        # Install dependencies
   pnpm db:generate   # Generate Prisma client
   pnpm db:push       # Create database tables
   ```

3. **Verify:**
   ```bash
   pnpm db:studio     # Opens database viewer
   ```

---

**That's it!** Your database is ready, just need to set up the schema. 🎉




