# Simple Local Database Setup

## 🎯 The Simplest Way

Just Postgres. No extra services. Perfect for development.

## 🚀 Quick Start

### Option 1: Use the Script (Easiest)

**Windows:**
```powershell
.\scripts\start-db.ps1
```

**Mac/Linux:**
```bash
chmod +x scripts/start-db.sh
./scripts/start-db.sh
```

### Option 2: Docker Compose Directly

```bash
docker-compose -f docker-compose.simple.yml up -d
```

## 📝 Update Your .env

After starting, update `services/api/.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/postgres"
```

## 🗄️ Setup Database

```bash
cd services/api
pnpm db:push
pnpm db:seed
```

## ✅ That's It!

Your database is running. No Supabase services, no analytics, no complications - just Postgres.

## 🛑 Stop Database

**Windows:**
```powershell
.\scripts\stop-db.ps1
```

**Mac/Linux:**
```bash
./scripts/stop-db.sh
```

Or:
```bash
docker-compose -f docker-compose.simple.yml down
```

## 🔄 Reset Database

```bash
docker-compose -f docker-compose.simple.yml down -v
docker-compose -f docker-compose.simple.yml up -d
```

## 📊 What You Get

- ✅ **Postgres 15** - Latest stable version
- ✅ **Port 5432** - Standard Postgres port
- ✅ **Persistent data** - Data survives restarts
- ✅ **Health checks** - Auto-restart if needed

## 🎯 Why This is Better

- ✅ **No Vector errors** - No analytics service
- ✅ **Fast startup** - Just one container
- ✅ **Simple** - No complex configuration
- ✅ **Works everywhere** - Windows, Mac, Linux

---

**That's it!** One command, one container, done. 🎉




