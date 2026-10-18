# Supabase CLI Setup (Recommended)

The official Supabase CLI is the easiest way to run Supabase locally. It handles all Docker setup automatically.

## 🚀 Quick Start

### 1. Install Supabase CLI

**Windows (PowerShell):**
```powershell
# Using Scoop
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Or using npm
npm install -g supabase
```

**Mac/Linux:**
```bash
brew install supabase/tap/supabase
```

### 2. Start Supabase

```bash
supabase start
```

This will:
- ✅ Pull all required Docker images
- ✅ Start all services
- ✅ Set up the database
- ✅ Show you connection details

### 3. Get Connection Info

After starting, you'll see:
```
API URL: http://127.0.0.1:54321
GraphQL URL: http://127.0.0.1:54321/graphql/v1
DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
Studio URL: http://127.0.0.1:54323
anon key: ${API_KEY}
service_role key: ${API_KEY}
```

### 4. Stop Supabase

```bash
supabase stop
```

### 5. Reset Database

```bash
supabase db reset
```

## 📝 Update Your .env Files

Use the keys shown by `supabase start`:

### `services/api/.env`
```env
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"
SUPABASE_URL="http://127.0.0.1:54321"
SUPABASE_SERVICE_KEY="<service_role key from supabase start>"
SUPABASE_ANON_KEY="<anon key from supabase start>"
```

### `apps/mobile/.env`
```env
EXPO_PUBLIC_SUPABASE_URL="http://127.0.0.1:54321"
EXPO_PUBLIC_SUPABASE_ANON_KEY="<anon key from supabase start>"
```

## 🎯 Why Use CLI?

- ✅ Automatic Docker management
- ✅ Always uses correct image versions
- ✅ Easy database migrations
- ✅ Built-in Studio access
- ✅ Official and maintained

---

**Recommended**: Use Supabase CLI instead of manual docker-compose! 🚀




