# Why Things Fail - Common Issues & Fixes

## 🔍 Diagnostic Results

### ✅ What's Working
- **Database**: Running and healthy ✅
- **Docker**: Working ✅
- **Port 5432**: Accessible ✅
- **.env file**: Exists and configured ✅

### ❌ Common Failure Points

## Issue 1: pnpm Not Installed

**Error:**
```
pnpm: command not found
```

**Why it fails:**
- pnpm is not in your PATH
- Not installed globally

**Fix:**
```bash
npm install -g pnpm
```

**Verify:**
```bash
pnpm --version
```

---

## Issue 2: Dependencies Not Installed

**Error:**
```
node_modules missing
'prisma' is not recognized
```

**Why it fails:**
- Need to install dependencies first
- Workspace packages need to be built

**Fix:**
```bash
# From project root
pnpm install

# Then from services/api
cd services/api
pnpm db:generate
pnpm db:push
```

---

## Issue 3: Workspace Package Errors

**Error:**
```
@calc/shared: Not Found - 404
```

**Why it fails:**
- Workspace packages aren't linked
- Need to install from monorepo root

**Fix:**
```bash
# Always install from root
cd C:\Users\Isaia\Documents\Coding\CalculatorCreatorApp
pnpm install
```

---

## Issue 4: Database Not Running

**Error:**
```
Connection refused
ECONNREFUSED 127.0.0.1:5432
```

**Why it fails:**
- Container stopped
- Port conflict
- Docker not running

**Check:**
```powershell
.\scripts\check-db.ps1
```

**Fix:**
```powershell
.\scripts\start-db.ps1
```

---

## Issue 5: Prisma Client Not Generated

**Error:**
```
Cannot find module '@prisma/client'
```

**Why it fails:**
- Prisma client not generated
- node_modules missing

**Fix:**
```bash
cd services/api
pnpm db:generate
```

---

## 🎯 Complete Fix Sequence

### Step 1: Install pnpm (if needed)
```bash
npm install -g pnpm
```

### Step 2: Install All Dependencies
```bash
# From project root
cd C:\Users\Isaia\Documents\Coding\CalculatorCreatorApp
pnpm install
```

### Step 3: Ensure Database is Running
```powershell
.\scripts\check-db.ps1
```

### Step 4: Setup Database Schema
```bash
cd services/api
pnpm db:generate
pnpm db:push
```

### Step 5: Verify
```bash
pnpm db:studio
# Should open at http://localhost:5555
```

---

## 📊 Current Status Check

Run this to see what's working:
```powershell
.\scripts\diagnose.ps1
```

This checks:
- ✅ Docker status
- ✅ Database container
- ✅ Database health
- ✅ Connection test
- ✅ Port accessibility
- ✅ .env file
- ✅ pnpm installation

---

## 🚀 Quick Fix Script

Run this to fix everything automatically:
```powershell
.\scripts\fix-all.ps1
```

This will:
1. Start database if needed
2. Create .env if missing
3. Install pnpm if needed
4. Install dependencies
5. Generate Prisma client
6. Push database schema

---

## 💡 Why Setup Fails

**Root Cause:** Dependencies need to be installed from the monorepo root first, then workspace packages are linked.

**Solution:** Always run `pnpm install` from the project root before running any commands in subdirectories.

---

**Current Status:** Database is ready, just need to install dependencies and run migrations! 🚀




