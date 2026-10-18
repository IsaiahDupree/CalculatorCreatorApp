# Local Database - Super Simple Setup

## ✅ What You Have

A **simple Postgres database** running in Docker. No Supabase services, no analytics, no complications.

## 🚀 Start Database

**One command:**

```powershell
# Windows
.\scripts\start-db.ps1

# Mac/Linux  
./scripts/start-db.sh
```

Or directly:
```bash
docker-compose -f docker-compose.simple.yml up -d
```

## 📝 Connection String

```
postgresql://postgres:postgres@127.0.0.1:5432/postgres
```

## 🔧 Update Your .env

Add to `services/api/.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/postgres"
```

## 🗄️ Setup Schema

```bash
cd services/api
pnpm db:push
```

## ✅ Done!

Your database is ready. That's it.

## 🛑 Stop

```powershell
.\scripts\stop-db.ps1
```

Or:
```bash
docker-compose -f docker-compose.simple.yml down
```

## 🔄 Reset (Delete All Data)

```bash
docker-compose -f docker-compose.simple.yml down -v
docker-compose -f docker-compose.simple.yml up -d
```

---

**That's literally all you need.** One container, one command, done. 🎉




