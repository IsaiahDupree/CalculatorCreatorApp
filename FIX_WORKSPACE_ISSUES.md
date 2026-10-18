# Fixing Workspace Package Issues

## 🔍 The Problem

pnpm is trying to fetch `@calc/shared`, `@calc/spec`, and `@calc/evaluator` from npm, but they're local workspace packages.

## ✅ Solution: Install Packages First

### Option 1: Install Workspace Packages First

```bash
# Install workspace packages
cd packages/shared
pnpm install

cd ../calculator-spec
pnpm install

cd ../calculator-evaluator
pnpm install

# Then install API
cd ../../services/api
pnpm install
pnpm db:generate
pnpm db:push
```

### Option 2: Use pnpm link (Recommended)

```bash
# From project root
cd C:\Users\Isaia\Documents\Coding\CalculatorCreatorApp

# Build workspace packages first
cd packages/shared
pnpm install
pnpm build

cd ../calculator-spec
pnpm install
pnpm build

cd ../calculator-evaluator
pnpm install
pnpm build

# Then install API (it will link to workspace packages)
cd ../../services/api
pnpm install
pnpm db:generate
pnpm db:push
```

### Option 3: Skip Workspace Packages for Now

If you just need the database setup, you can temporarily remove workspace dependencies:

```bash
# Edit services/api/package.json
# Comment out:
# "@calc/spec": "*",
# "@calc/evaluator": "*",
# "@calc/shared": "*",

# Then install
cd services/api
pnpm install
pnpm db:generate
pnpm db:push
```

## 🎯 Quick Fix for Database Setup

Since you just need the database working, let's focus on that:

```bash
# 1. Install API dependencies (skip workspace packages for now)
cd services/api

# 2. Temporarily remove workspace deps from package.json
# (or just install what's needed)

# 3. Install Prisma
pnpm add -D prisma
pnpm add @prisma/client

# 4. Generate and push
pnpm db:generate
pnpm db:push
```

---

**The database is ready!** The workspace package issue is separate and can be fixed later. 🚀




