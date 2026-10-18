# Testing Knowledge Base

## 🎓 Core Concepts

### Why Testing?

1. **Reliability** - Catch bugs before production
2. **Confidence** - Refactor without fear
3. **Documentation** - Tests describe behavior
4. **Regression Prevention** - Don't break existing features

### Test Pyramid

```
        /\
       /  \      E2E Tests (Few)
      /____\
     /      \    Integration Tests (Some)
    /________\
   /          \  Unit Tests (Many)
  /____________\
```

**Our Focus:**
- ✅ Unit Tests (Database, API endpoints)
- ✅ Integration Tests (Database + API)
- ⏳ E2E Tests (Full user flows - future)

## 🔧 Technical Details

### Database Testing Strategy

**Approach:** Direct Prisma Client usage

**Why?**
- Fast execution
- Direct schema validation
- No HTTP overhead
- Easy cleanup

**Pattern:**
```typescript
// Setup
const prisma = new PrismaClient();

// Test
await prisma.user.create({ data: {...} });

// Cleanup
await prisma.user.delete({ where: { id } });
await prisma.$disconnect();
```

### API Testing Strategy

**Approach:** HTTP requests to running API

**Why?**
- Tests real endpoints
- Validates request/response
- Tests middleware
- Tests authentication

**Pattern:**
```typescript
const response = await fetch(`${API_URL}/api/endpoint`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});

expect(response.status).toBe(200);
const data = await response.json();
expect(data).toHaveProperty('field');
```

### Integration Testing Strategy

**Approach:** Combine database and API

**Why?**
- Tests full flow
- Validates data consistency
- Tests real-world scenarios

**Pattern:**
```typescript
// 1. Create in database
const user = await prisma.user.create({...});

// 2. Verify via API
const response = await fetch(`${API_URL}/api/users/${user.id}`);
const apiUser = await response.json();

// 3. Assert consistency
expect(apiUser.id).toBe(user.id);
```

## 📋 Test Patterns

### Arrange-Act-Assert (AAA)

```typescript
it('should calculate sum', async () => {
  // Arrange - Set up test data
  const a = 5;
  const b = 3;
  
  // Act - Execute the code
  const result = a + b;
  
  // Assert - Verify the result
  expect(result).toBe(8);
});
```

### Test Isolation

**Each test should:**
- ✅ Be independent
- ✅ Not rely on other tests
- ✅ Clean up after itself
- ✅ Use unique test data

**Bad:**
```typescript
let sharedUser; // ❌ Shared state

it('test 1', () => {
  sharedUser = createUser();
});

it('test 2', () => {
  useUser(sharedUser); // ❌ Depends on test 1
});
```

**Good:**
```typescript
it('test 1', async () => {
  const user = await createTestUser(); // ✅ Isolated
  // ... test ...
  await cleanupTestData(user.id); // ✅ Cleanup
});

it('test 2', async () => {
  const user = await createTestUser(); // ✅ Isolated
  // ... test ...
  await cleanupTestData(user.id); // ✅ Cleanup
});
```

### Test Data Factories

**Why?** Consistent, reusable test data

```typescript
// Helper function
export async function createTestUser(email?: string) {
  return await prisma.user.create({
    data: {
      email: email || `test-${Date.now()}@example.com`,
      subscriptionTier: 'free',
    },
  });
}

// Usage
const user = await createTestUser();
```

## 🎯 Testing Checklist

### Before Writing Tests

- [ ] Understand what you're testing
- [ ] Identify edge cases
- [ ] Plan test data
- [ ] Plan cleanup strategy

### While Writing Tests

- [ ] Use descriptive test names
- [ ] Follow AAA pattern
- [ ] Test both success and failure
- [ ] Test edge cases (empty, null, invalid)
- [ ] Keep tests focused (one assertion per test)

### After Writing Tests

- [ ] Run tests locally
- [ ] Verify cleanup works
- [ ] Check test coverage
- [ ] Review test readability

## 🐛 Common Issues & Solutions

### Issue: Tests Interfere with Each Other

**Symptom:** Tests pass individually but fail together

**Solution:**
- Use unique test data (timestamps)
- Clean up in `afterEach` or `afterAll`
- Use database transactions for isolation

### Issue: Slow Tests

**Symptom:** Tests take too long to run

**Solution:**
- Mock external services
- Use in-memory database for unit tests
- Run tests in parallel
- Optimize database queries

### Issue: Flaky Tests

**Symptom:** Tests sometimes pass, sometimes fail

**Solution:**
- Remove timing dependencies
- Use deterministic test data
- Wait for async operations properly
- Check for race conditions

### Issue: Test Data Pollution

**Symptom:** Tests fail due to leftover data

**Solution:**
- Always clean up test data
- Use unique identifiers
- Run cleanup in `afterAll`
- Consider database transactions

## 📊 Coverage Goals

### Current Coverage
- Database: ~80%
- API Endpoints: ~60%
- Integration: ~40%

### Target Coverage
- Database: 90%+
- API Endpoints: 80%+
- Integration: 60%+

### What to Test

**Must Test:**
- ✅ Critical business logic
- ✅ Authentication flows
- ✅ Data validation
- ✅ Error handling

**Should Test:**
- ⚠️ Utility functions
- ⚠️ Edge cases
- ⚠️ Integration points

**Nice to Test:**
- 💡 UI components (future)
- 💡 Performance (future)
- 💡 Accessibility (future)

## 🔄 Test Maintenance

### When to Update Tests

1. **Feature Changes** - Update tests when features change
2. **Bug Fixes** - Add tests for fixed bugs
3. **Refactoring** - Update tests to match new structure
4. **New Requirements** - Add tests for new features

### Test Review Checklist

- [ ] Tests are readable
- [ ] Tests are maintainable
- [ ] Tests are fast
- [ ] Tests are reliable
- [ ] Tests cover edge cases
- [ ] Tests clean up properly

## 🚀 Advanced Topics

### Test Doubles (Mocks/Stubs)

**When to Mock:**
- External APIs (Stripe, OpenAI)
- File system operations
- Time-dependent code
- Expensive operations

**Example:**
```typescript
// Mock external API
vi.mock('@langchain/openai', () => ({
  ChatOpenAI: vi.fn(() => ({
    invoke: vi.fn(() => Promise.resolve('mocked response')),
  })),
}));
```

### Parameterized Tests

**When:** Testing multiple inputs with same logic

```typescript
it.each([
  [2, 3, 5],
  [5, 7, 12],
  [10, 20, 30],
])('should add %i + %i = %i', (a, b, expected) => {
  expect(a + b).toBe(expected);
});
```

### Snapshot Testing

**When:** Testing complex objects

```typescript
it('should match snapshot', () => {
  const result = complexFunction();
  expect(result).toMatchSnapshot();
});
```

## 📚 Learning Resources

### Documentation
- [Vitest Guide](https://vitest.dev/guide/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Prisma Testing](https://www.prisma.io/docs/guides/testing)

### Articles
- "Testing Trophy" by Kent C. Dodds
- "The Testing Pyramid" by Martin Fowler
- "Test-Driven Development" by Robert C. Martin

---

**This knowledge base is a living document. Update it as you learn!** 📝




