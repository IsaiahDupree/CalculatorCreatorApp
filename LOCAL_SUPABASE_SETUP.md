# Local Supabase Setup with Docker

## ✅ What's Configured

A complete local Supabase instance running in Docker with:
- ✅ **PostgreSQL** - Database (port 54322)
- ✅ **PostgREST** - REST API
- ✅ **GoTrue** - Authentication
- ✅ **Storage** - File storage
- ✅ **Realtime** - Real-time subscriptions
- ✅ **Studio** - Admin UI (port 54323)
- ✅ **Kong** - API Gateway (port 8000)
- ✅ **Functions** - Edge functions

## 🚀 Quick Start

### 1. Start Supabase

```bash
# Using Docker Compose
docker-compose up -d

# Or use the script
chmod +x scripts/start-supabase.sh
./scripts/start-supabase.sh
```

### 2. Wait for Services

Services take ~30 seconds to start. Check status:

```bash
docker-compose ps
```

### 3. Access Services

- **Studio (Admin UI)**: http://127.0.0.1:54323
- **API URL**: http://127.0.0.1:8000
- **Database**: `postgresql://postgres:your-super-secret-jwt-token-with-at-least-32-characters-long@127.0.0.1:54322/postgres`

## 🔑 API Keys

### Anon Key (Public)
```
${API_TOKEN}
```

### Service Role Key (Private)
```
${API_TOKEN}
```

## 📝 Update Environment Variables

### Backend API (`services/api/.env`)
```env
DATABASE_URL="postgresql://postgres:your-super-secret-jwt-token-with-at-least-32-characters-long@127.0.0.1:54322/postgres"
SUPABASE_URL="http://127.0.0.1:8000"
SUPABASE_SERVICE_KEY="${SUPABASE_SERVICE_KEY}"
SUPABASE_ANON_KEY="${SUPABASE_ANON_KEY}"
```

### Mobile App (`apps/mobile/.env`)
```env
EXPO_PUBLIC_SUPABASE_URL="http://127.0.0.1:8000"
EXPO_PUBLIC_SUPABASE_ANON_KEY="${EXPO_PUBLIC_SUPABASE_ANON_KEY}"
EXPO_PUBLIC_API_URL="http://localhost:3001"
```

**Note**: For mobile app, use your computer's IP address instead of `127.0.0.1`:
```env
EXPO_PUBLIC_SUPABASE_URL="http://192.168.1.XXX:8000"
```

## 🔧 Database Setup

### 1. Run Prisma Migrations

```bash
cd services/api
pnpm db:push
```

### 2. Seed Database

```bash
pnpm db:seed
```

### 3. Verify in Studio

Open http://127.0.0.1:54323 and check tables.

## 📊 Service Ports

| Service | Port | URL |
|---------|------|-----|
| Kong (API Gateway) | 8000 | http://127.0.0.1:8000 |
| Studio (Admin UI) | 54323 | http://127.0.0.1:54323 |
| PostgreSQL | 54322 | postgresql://...@127.0.0.1:54322 |

## 🛠️ Management Commands

### Start Services
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f
```

### Reset (Remove All Data)
```bash
docker-compose down -v
docker-compose up -d
```

### Check Status
```bash
docker-compose ps
```

## 🔍 Troubleshooting

### Services Won't Start
```bash
# Check Docker is running
docker info

# Check port conflicts
netstat -an | grep 8000
netstat -an | grep 54322
netstat -an | grep 54323
```

### Database Connection Issues
- Verify password matches in `.env` files
- Check database is healthy: `docker-compose ps`
- Wait 30 seconds after starting for full initialization

### Mobile App Can't Connect
- Use computer's IP address, not `127.0.0.1`
- Ensure mobile device is on same network
- Check firewall settings

## 📁 Files Created

- ✅ `docker-compose.yml` - Supabase services
- ✅ `supabase/kong.yml` - API gateway config
- ✅ `supabase/.env` - Environment variables
- ✅ `scripts/start-supabase.sh` - Start script
- ✅ `scripts/stop-supabase.sh` - Stop script
- ✅ `scripts/reset-supabase.sh` - Reset script

## 🎯 Next Steps

1. **Start Supabase**: `docker-compose up -d`
2. **Update .env files** with connection strings
3. **Run migrations**: `cd services/api && pnpm db:push`
4. **Seed data**: `pnpm db:seed`
5. **Start developing!**

---

**Status**: Local Supabase ready! Start with `docker-compose up -d` 🐳




