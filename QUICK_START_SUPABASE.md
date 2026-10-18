# Quick Start: Local Supabase

## 🚀 Start Supabase (One Command)

```bash
docker-compose up -d
```

Or use the script:
```bash
# Windows PowerShell
.\scripts\start-supabase.ps1

# Linux/Mac
./scripts/start-supabase.sh
```

## ⏳ Wait 30 Seconds

Services need time to initialize. Check status:

```bash
docker-compose ps
```

## 🌐 Access Services

- **Studio (Admin UI)**: http://127.0.0.1:54323
- **API**: http://127.0.0.1:8000
- **Database**: `postgresql://postgres:your-super-secret-jwt-token-with-at-least-32-characters-long@127.0.0.1:54322/postgres`

## 🔑 API Keys (Copy These!)

**Anon Key (Public):**
```
${API_TOKEN}
```

**Service Role Key (Private):**
```
${API_TOKEN}
```

## 📝 Update Your .env Files

### `services/api/.env`
```env
DATABASE_URL="postgresql://postgres:your-super-secret-jwt-token-with-at-least-32-characters-long@127.0.0.1:54322/postgres"
SUPABASE_URL="http://127.0.0.1:8000"
SUPABASE_SERVICE_KEY="${SUPABASE_SERVICE_KEY}"
SUPABASE_ANON_KEY="${SUPABASE_ANON_KEY}"
```

### `apps/mobile/.env`
```env
EXPO_PUBLIC_SUPABASE_URL="http://127.0.0.1:8000"
EXPO_PUBLIC_SUPABASE_ANON_KEY="${EXPO_PUBLIC_SUPABASE_ANON_KEY}"
```

**Note**: For mobile, use your computer's IP (e.g., `192.168.1.XXX`) instead of `127.0.0.1`

## 🗄️ Setup Database

```bash
cd services/api
pnpm db:push
pnpm db:seed
```

## ✅ Verify

1. Open Studio: http://127.0.0.1:54323
2. Check tables are created
3. Test API: `curl http://127.0.0.1:8000/rest/v1/`

## 🛑 Stop Supabase

```bash
docker-compose down
```

---

**That's it!** Your local Supabase is ready. 🎉




