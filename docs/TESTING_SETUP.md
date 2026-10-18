# Testing Setup & Knowledge Base

## 📚 Overview

This document captures the complete testing infrastructure for the Calculator Creator App, including database tests, API tests, and integration tests.

## 🏗️ Architecture

### Test Framework: Vitest
- **Why Vitest?** Fast, Vite-native, compatible with Jest API
- **Location:** `services/api/tests/`
- **Config:** `services/api/vitest.config.ts`

### Test Structure
```
services/api/tests/
├── setup.ts                    # Global test configuration
├── database/                   # Database layer tests
│   ├── connection.test.ts     # DB connection & health
│   └── schema.test.ts         # Schema validation & constraints
├── api/                        # API endpoint tests
│   ├── health.test.ts         # Health check endpoint
│   ├── calculators.test.ts    # Calculator CRUD operations
│   └── auth.test.ts           # Authentication endpoints
├── integration/                # End-to-end tests
│   └── database-api.test.ts   # Database + API integration
└── utils/                      # Test utilities
    └── test-helpers.ts        # Reusable test functions
```

## 🧪 Test Categories

### 1. Database Tests (`tests/database/`)

#### Connection Tests (`connection.test.ts`)
**Purpose:** Verify database connectivity and basic operations

**Tests:**
- ✅ Database connection
- ✅ Query execution
- ✅ Table existence (User, Calculator)

**Key Assertions:**
```typescript
await expect(prisma.$connect()).resolves.not.toThrow();
const count = await prisma.user.count();
expect(count).toBeGreaterThanOrEqual(0);
```

#### Schema Tests (`schema.test.ts`)
**Purpose:** Validate database schema integrity

**Tests:**
- ✅ All required tables exist
- ✅ Email uniqueness constraint
- ✅ Cascade delete behavior

**Key Scenarios:**
- User email uniqueness enforcement
- Calculator deletion when user is deleted
- Foreign key relationships

### 2. API Tests (`tests/api/`)

#### Health Check (`health.test.ts`)
**Purpose:** Verify API is running and responsive

**Tests:**
- ✅ Health endpoint returns 200
- ✅ Response contains expected fields
- ✅ API message is present

**Endpoint:** `GET /api/health`

#### Calculator Tests (`calculators.test.ts`)
**Purpose:** Test calculator CRUD operations

**Tests:**
- ✅ List calculators (GET)
- ✅ Pagination support
- ✅ Create calculator (POST)
- ✅ Get calculator by ID (GET)
- ✅ 404 for non-existent calculators

**Endpoints:**
- `GET /api/calculators`
- `POST /api/calculators`
- `GET /api/calculators/:id`

#### Authentication Tests (`auth.test.ts`)
**Purpose:** Test authentication flow

**Tests:**
- ✅ Signup requires email/password
- ✅ Signup creates user
- ✅ Login requires credentials
- ✅ Invalid credentials rejected

**Endpoints:**
- `POST /api/auth/signup`
- `POST /api/auth/login`

### 3. Integration Tests (`tests/integration/`)

#### Database + API Integration (`database-api.test.ts`)
**Purpose:** End-to-end flow validation

**Tests:**
- ✅ Create calculator in DB → Retrieve via API
- ✅ Calculator run tracking
- ✅ Data consistency

**Key Flow:**
1. Create test user in database
2. Create calculator via Prisma
3. Verify via API endpoint
4. Track calculator runs
5. Cleanup test data

## 🛠️ Test Utilities

### Test Helpers (`tests/utils/test-helpers.ts`)

**Functions:**
```typescript
// Create test user
createTestUser(email?: string): Promise<User>

// Create test calculator
createTestCalculator(userId: string, data?: any): Promise<Calculator>

// Cleanup test data
cleanupTestData(userId?: string, calculatorId?: string): Promise<void>
```

**Usage:**
```typescript
const user = await createTestUser();
const calc = await createTestCalculator(user.id);
// ... run tests ...
await cleanupTestData(user.id, calc.id);
```

## 📜 Scripts

### PowerShell Scripts (`scripts/`)

#### `test-db.ps1`
**Purpose:** Quick database health check

**Checks:**
1. Container running status
2. Database accepting connections
3. Query execution
4. Table existence

**Usage:**
```powershell
.\scripts\test-db.ps1
```

#### `test-backend.ps1`
**Purpose:** Quick API health check

**Checks:**
1. Health endpoint
2. Calculators endpoint
3. Database connection via API

**Usage:**
```powershell
.\scripts\test-backend.ps1
```

#### `run-all-tests.ps1`
**Purpose:** Run all test suites

**Runs:**
1. Database tests
2. Backend API tests
3. Unit tests (if available)

**Usage:**
```powershell
.\scripts\run-all-tests.ps1
```

## 🚀 Running Tests

### Prerequisites

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
   ```env
   DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:54321/postgres"
   API_URL="http://localhost:3001"
   ```

### Commands

#### All Tests
```bash
cd services/api
pnpm test
```

#### Watch Mode (Development)
```bash
pnpm test:watch
```

#### Specific Test Suite
```bash
pnpm test:db    # Database tests only
pnpm test:api   # API tests only
```

#### With Coverage
```bash
pnpm test:coverage
```

#### Single Test File
```bash
pnpm test tests/database/connection.test.ts
```

## ⚙️ Configuration

### Vitest Config (`vitest.config.ts`)

```typescript
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.config.*',
        '**/prisma/**',
      ],
    },
  },
});
```

### Test Setup (`tests/setup.ts`)

**Environment Variables:**
- `DATABASE_URL` - Database connection string
- `NEXTAUTH_SECRET` - Auth secret (test value)
- `NEXTAUTH_URL` - API base URL

**Hooks:**
- `beforeAll` - Setup before all tests
- `afterAll` - Cleanup after all tests

## 📊 Test Coverage

### Current Coverage

**Database:**
- ✅ Connection
- ✅ Schema validation
- ✅ Constraints
- ✅ Relationships

**API:**
- ✅ Health check
- ✅ Calculator CRUD
- ✅ Authentication
- ✅ Error handling

**Integration:**
- ✅ Database + API flow
- ✅ Data consistency
- ✅ Usage tracking

### Future Coverage

**Planned:**
- ⏳ Calculator evaluation
- ⏳ AI generation
- ⏳ Payment processing
- ⏳ Revenue share calculation
- ⏳ Analytics tracking

## 🔍 Best Practices

### Test Organization
1. **Group by feature** - Keep related tests together
2. **Use describe blocks** - Organize test suites
3. **Clear test names** - Describe what is being tested
4. **Isolate tests** - Each test should be independent

### Test Data
1. **Use factories** - `createTestUser()`, `createTestCalculator()`
2. **Cleanup** - Always clean up test data
3. **Unique data** - Use timestamps for uniqueness
4. **Isolated** - Don't share test data between tests

### Assertions
1. **Be specific** - Test exact behavior
2. **Test edge cases** - Empty, null, invalid inputs
3. **Test errors** - Verify error handling
4. **Test success** - Verify happy paths

### Performance
1. **Use transactions** - For database tests
2. **Mock external APIs** - Don't hit real services
3. **Parallel execution** - Vitest runs tests in parallel
4. **Fast cleanup** - Remove test data quickly

## 🐛 Troubleshooting

### Database Connection Issues

**Error:** `Can't reach database server`
```powershell
# Check database is running
.\scripts\check-db.ps1

# Restart database
.\scripts\restart-db.ps1
```

**Error:** `Table doesn't exist`
```bash
# Push schema
cd services/api
pnpm db:push
```

### API Connection Issues

**Error:** `API is not running`
```bash
# Start API
cd services/api
pnpm dev
```

**Error:** `Port already in use`
```bash
# Check what's using port 3001
netstat -ano | findstr :3001

# Kill process or change port in package.json
```

### Test Failures

**Error:** `Test timeout`
- Increase timeout in test: `it('...', async () => {...}, { timeout: 10000 })`

**Error:** `Prisma client not generated`
```bash
cd services/api
pnpm db:generate
```

## 📝 Writing New Tests

### Template for Database Test
```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';

describe('Feature Name', () => {
  let prisma: PrismaClient;

  beforeAll(() => {
    prisma = new PrismaClient();
  });

  it('should do something', async () => {
    // Arrange
    const data = { /* test data */ };
    
    // Act
    const result = await prisma.model.create({ data });
    
    // Assert
    expect(result).toBeDefined();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
```

### Template for API Test
```typescript
import { describe, it, expect } from 'vitest';

const API_URL = process.env.API_URL || 'http://localhost:3001';

describe('API Feature', () => {
  it('should return expected response', async () => {
    const response = await fetch(`${API_URL}/api/endpoint`);
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('expectedField');
  });
});
```

## 🎯 CI/CD Integration

### GitHub Actions Example
```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: pnpm install
      - run: pnpm test
```

## 📚 References

- [Vitest Documentation](https://vitest.dev/)
- [Prisma Testing Guide](https://www.prisma.io/docs/guides/testing)
- [Next.js Testing](https://nextjs.org/docs/app/building-your-application/testing)

---

**Last Updated:** 2025-01-27
**Maintained By:** Development Team




