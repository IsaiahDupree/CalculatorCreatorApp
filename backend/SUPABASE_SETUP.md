# Supabase Setup Guide

## Current Status
✅ Supabase CLI is installed
❌ Docker is required to run local Supabase

## Option 1: Local Supabase (with Docker)

### Prerequisites
- Docker Desktop for Windows

### Steps
1. Install Docker Desktop: https://www.docker.com/products/docker-desktop/
2. Start Docker Desktop
3. Run in `backend` folder:
   ```bash
   supabase start
   ```
4. Once started, you'll get:
   ```
   API URL: http://localhost:54321
   DB URL: postgresql://postgres:postgres@localhost:54322/postgres
   Studio URL: http://localhost:54323
   Anon key: <your-anon-key>
   Service role key: <your-service-key>
   ```
5. Update `backend/.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key-from-above>
   OPENAI_API_KEY=<your-openai-key>
   ```

### Benefits
- Fully offline development
- No cloud costs
- Fast iteration
- Full control

## Option 2: Supabase Cloud (No Docker Needed)

### Steps
1. Go to https://supabase.com and create account
2. Create a new project
3. Wait for project to provision (~2 minutes)
4. Go to Project Settings > API
5. Copy:
   - `URL` (Project URL)
   - `anon public` key
6. Update `backend/.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
   OPENAI_API_KEY=<your-openai-key>
   ```
7. Run migration:
   - Go to SQL Editor in Supabase dashboard
   - Copy contents of `backend/supabase/migrations/20251126000000_create_calculators.sql`
   - Paste and run

### Benefits
- No Docker installation needed
- Free tier available
- Always accessible
- Automatic backups

## Recommendation
- **For learning/testing**: Use Cloud (Option 2) - faster to get started
- **For serious development**: Use Local (Option 1) - better DX and no API limits
