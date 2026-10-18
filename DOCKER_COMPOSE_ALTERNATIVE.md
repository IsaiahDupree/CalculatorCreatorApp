# Docker Compose Alternative Setup

If you prefer to use docker-compose directly, here's a working configuration using standard Postgres and Supabase-compatible services.

## ⚠️ Note

The official Supabase CLI (`supabase start`) is recommended as it:
- Handles all Docker setup automatically
- Uses correct image versions
- Manages migrations easily
- Provides better tooling

## 🔧 Manual Docker Setup

If you still want to use docker-compose, you can:

1. **Use Supabase CLI** (recommended):
   ```bash
   npm install -g supabase
   supabase start
   ```

2. **Or use a simpler Postgres-only setup** for development:
   ```yaml
   # Simple postgres for development
   services:
     postgres:
       image: postgres:15
       ports:
         - "5432:5432"
       environment:
         POSTGRES_PASSWORD: postgres
         POSTGRES_DB: postgres
   ```

## 🎯 Recommendation

**Use Supabase CLI** - it's the official way and much easier!

```bash
npm install -g supabase
supabase start
```

---

See `SUPABASE_CLI_SETUP.md` for CLI setup instructions.




