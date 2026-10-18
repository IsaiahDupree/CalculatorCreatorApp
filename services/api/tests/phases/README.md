# Phase-Based Test Suite

This directory contains comprehensive tests for all development phases of the Calculator Creator App.

## 📋 Test Coverage

### Phase 1: MVP Setup (5 tests)
- ✅ Project initialization
- ✅ Database connection
- ✅ Required tables
- ✅ CalculatorSpec schema
- ✅ Basic frontend UI endpoints

**Run:** `pnpm test:mvp`

### Phase 2: Intelligence & Persistence (9 tests)
- ✅ Configuration & environment variables
- ✅ Database schema (calculators table)
- ✅ SQL migrations via Prisma
- ✅ AI integration endpoint
- ✅ Zod validation for calculator specs
- ✅ API endpoints: `/api/calculators` (List)
- ✅ API endpoints: `/api/calculators/[id]` (Get)
- ✅ Error handling (404 for non-existent)

**Run:** `pnpm test:phase2`

### Phase 3: Authentication & Ownership (7 tests)
- ✅ Owner ID (creatorId) column
- ✅ Category column
- ✅ Tags column
- ✅ Filter calculators by owner
- ✅ Filter calculators by category
- ✅ Signup endpoint
- ✅ Login endpoint

**Run:** `pnpm test:phase3`

### Phase 4: Monetization (7 tests)
- ✅ Subscription fields in User model
- ✅ Subscription status support
- ✅ Stripe checkout session endpoint
- ✅ Stripe webhook handler
- ✅ Subscription limits for free tier
- ✅ Unlimited calculators for pro tier
- ✅ Generate endpoint limits enforcement

**Run:** `pnpm test:phase4`

### Phase 5: Advanced Features (9 tests)
- ✅ AI tutoring chat endpoint
- ✅ Chat history support
- ✅ Embed route for calculators
- ✅ Embeddable calculator HTML
- ✅ Calculator evaluation endpoint
- ✅ Correct calculation results
- ✅ Marketplace trending endpoint
- ✅ Marketplace categories endpoint
- ✅ Marketplace search endpoint

**Run:** `pnpm test:phase5`

## 🚀 Running Tests

### All Phase Tests
```bash
pnpm test:phases
```

### Individual Phase Tests
```bash
pnpm test:mvp      # Phase 1
pnpm test:phase2   # Phase 2
pnpm test:phase3   # Phase 3
pnpm test:phase4   # Phase 4
pnpm test:phase5   # Phase 5
```

### All Tests (Including Phases)
```bash
pnpm test
```

## 📊 Test Results

**Total:** 37 tests across 5 phases
- ✅ All tests passing
- ✅ Comprehensive coverage of all development phases
- ✅ Tests verify both database and API functionality

## 🎯 Test Philosophy

These tests are designed to:
1. **Verify Implementation** - Ensure each phase's features are implemented
2. **Check Integration** - Verify database, API, and frontend integration
3. **Validate Data** - Ensure data structures and schemas are correct
4. **Test Endpoints** - Verify API endpoints exist and respond appropriately
5. **Handle Errors** - Test error cases and edge conditions

## 📝 Notes

- Tests use unique identifiers to avoid conflicts
- Tests clean up after themselves
- API tests handle timeouts gracefully
- Tests work with or without Supabase configuration
- Tests verify both success and error cases

---

**Last Updated:** 2025-01-27




