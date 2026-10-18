# Local Database - Quick Start Guide

## 🎯 Simplest Setup (Recommended)

### 1. Start Database

```bash
# Windows
.\scripts\start-db.ps1

# Mac/Linux
./scripts/start-db.sh
```

### 2. Update .env

Add to `services/api/.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/postgres"
```

### 3. Run Migrations

```bash
cd services/api
pnpm db:push
```

## ✅ Done!

Your local database is ready. No Supabase CLI, no complex setup - just Postgres.

## 🛑 Stop

```bash
# Windows
.\scripts\stop-db.ps1

# Mac/Linux
./scripts/stop-db.sh
```

---

**That's literally it.** 3 steps, 30 seconds. 🚀




