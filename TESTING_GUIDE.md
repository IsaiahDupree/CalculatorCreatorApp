# Complete Testing Guide

## ✅ What's Set Up

### Test Framework
- ✅ **Vitest** - Fast test runner
- ✅ **Test Structure** - Organized test files
- ✅ **Coverage** - Code coverage support
- ✅ **Helpers** - Reusable test utilities

### Test Scripts
- ✅ `test-db.ps1` - Database connection tests
- ✅ `test-backend.ps1` - API endpoint tests
- ✅ `run-all-tests.ps1` - Run everything

## 🧪 Test Categories

### 1. Database Tests
**Location:** `services/api/tests/database/`

- ✅ Connection tests
- ✅ Schema validation
- ✅ Constraint tests
- ✅ Cascade delete tests

**Run:**
```bash
cd services/api
pnpm test:db
```

### 2. API Tests
**Location:** `services/api/tests/api/`

- ✅ Health endpoint
- ✅ Calculator endpoints
- ✅ Authentication endpoints
- ✅ Error handling

**Run:**
```bash
cd services/api
pnpm test:api
```

### 3. Integration Tests
**Location:** `services/api/tests/integration/`

- ✅ Database + API flow
- ✅ End-to-end scenarios
- ✅ Data consistency

**Run:**
```bash
cd services/api
pnpm test
```

## 🚀 Quick Test Commands

### Test Database Connection
```powershell
.\scripts\test-db.ps1
```

### Test Backend API
```powershell
.\scripts\test-backend.ps1
```

### Run All Tests
```powershell
.\scripts\run-all-tests.ps1
```

### Run Unit Tests
```bash
cd services/api
pnpm test
```

## 📋 Prerequisites

1. **Database Running**
   ```powershell
   .\scripts\start-db.ps1
   ```

2. **Dependencies Installed**
   ```bash
   cd services/api
   pnpm install
   ```

3. **Environment Variables**
   - `DATABASE_URL` in `services/api/.env`

## 🎯 Test Coverage

### Current Tests
- ✅ Database connection
- ✅ Database schema
- ✅ API health check
- ✅ Calculator endpoints
- ✅ Authentication endpoints
- ✅ Integration flows

### Future Tests
- ⏳ Calculator evaluation
- ⏳ AI generation
- ⏳ Payment processing
- ⏳ Revenue share calculation

## 📊 Running Tests

### Development
```bash
# Watch mode (auto-rerun on changes)
pnpm test:watch
```

### CI/CD
```bash
# Run once with coverage
pnpm test:coverage
```

### Specific Test
```bash
# Run single test file
pnpm test tests/database/connection.test.ts
```

---

**Tests are ready!** Run `.\scripts\run-all-tests.ps1` to verify everything. 🧪




