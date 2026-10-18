# API Tests

## 🧪 Test Structure

```
tests/
├── setup.ts              # Test configuration
├── database/             # Database tests
│   ├── connection.test.ts
│   └── schema.test.ts
├── api/                  # API endpoint tests
│   ├── health.test.ts
│   ├── calculators.test.ts
│   └── auth.test.ts
├── integration/          # Integration tests
│   └── database-api.test.ts
└── utils/                # Test helpers
    └── test-helpers.ts
```

## 🚀 Running Tests

### All Tests
```bash
pnpm test
```

### Watch Mode
```bash
pnpm test:watch
```

### Specific Test Suite
```bash
pnpm test:db    # Database tests only
pnpm test:api   # API tests only
```

### With Coverage
```bash
pnpm test:coverage
```

## 📋 Test Requirements

1. **Database Running**
   ```powershell
   .\scripts\start-db.ps1
   ```

2. **Environment Variables**
   - `DATABASE_URL` - Database connection string
   - `API_URL` - API base URL (default: http://localhost:3001)

3. **Dependencies Installed**
   ```bash
   pnpm install
   ```

## 🎯 What's Tested

### Database Tests
- ✅ Connection
- ✅ Schema validation
- ✅ Constraints (uniqueness, cascades)
- ✅ Table existence

### API Tests
- ✅ Health endpoint
- ✅ Calculator CRUD
- ✅ Authentication
- ✅ Error handling

### Integration Tests
- ✅ Database + API flow
- ✅ Calculator creation and retrieval
- ✅ Usage tracking

---

**Run tests to verify everything works!** 🧪




