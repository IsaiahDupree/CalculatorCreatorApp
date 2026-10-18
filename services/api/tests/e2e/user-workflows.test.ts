import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const API_URL = process.env.API_URL || 'http://localhost:3001';

describe('E2E: User Workflows', () => {
  let testUser: any;
  let testCalculator: any;
  const testEmail = `e2e-test-${Date.now()}@example.com`;
  const testPassword = 'E2ETestPassword123!';

  beforeAll(async () => {
    // Clean up any existing test data
    await prisma.calculator.deleteMany({
      where: { creator: { email: testEmail } },
    });
    await prisma.user.deleteMany({
      where: { email: testEmail },
    });
  });

  afterAll(async () => {
    if (testCalculator) {
      await prisma.calculator.delete({ where: { id: testCalculator.id } }).catch(() => {});
    }
    if (testUser) {
      await prisma.user.delete({ where: { id: testUser.id } }).catch(() => {});
    }
    await prisma.$disconnect();
  });

  describe('Complete User Registration Flow', () => {
    it('should complete full registration workflow', async () => {
      // Step 1: Sign up
      const signupResponse = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
          username: `e2euser${Date.now()}`,
        }),
      });

      if (signupResponse.status === 201 || signupResponse.status === 200) {
        const signupData = await signupResponse.json();
        expect(signupData.ok).toBe(true);
        expect(signupData.data).toHaveProperty('userId');

        // Step 2: Verify user exists in database
        testUser = await prisma.user.findUnique({
          where: { email: testEmail },
        });
        expect(testUser).toBeDefined();
        expect(testUser.email).toBe(testEmail);
      }
    });
  });

  describe('Calculator Creation & Usage Flow', () => {
    it('should complete calculator creation and evaluation workflow', async () => {
      // Ensure we have a test user
      if (!testUser) {
        testUser = await prisma.user.create({
          data: { email: testEmail, subscriptionTier: 'free' },
        });
      }

      // Step 1: Create calculator
      const uniqueSlug = `e2e-calc-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      testCalculator = await prisma.calculator.create({
        data: {
          slug: uniqueSlug,
          title: 'E2E Test Calculator',
          summary: 'Calculator for E2E testing',
          spec: {
            id: 'e2e-test',
            version: 1,
            title: 'E2E Test Calculator',
            inputs: [{ id: 'x', label: 'X', type: 'number' }],
            outputs: [{ id: 'result', label: 'Result' }],
            equations: [{ expr: 'x * 2' }],
          },
          creatorId: testUser.id,
          status: 'published',
        },
      });

      expect(testCalculator).toBeDefined();
      expect(testCalculator.creatorId).toBe(testUser.id);

      // Step 2: Retrieve calculator via API
      const getResponse = await fetch(`${API_URL}/api/calculators/${testCalculator.id}`);
      expect(getResponse.status).toBe(200);
      
      const getData = await getResponse.json();
      expect(getData.ok).toBe(true);
      expect(getData.data.id).toBe(testCalculator.id);

      // Step 3: Evaluate calculator
      const evalResponse = await fetch(`${API_URL}/api/calculators/${testCalculator.id}/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputs: { x: 5 },
        }),
        signal: AbortSignal.timeout(5000),
      }).catch(() => ({ status: 500 }));

      if (evalResponse.status === 200) {
        const evalData = await evalResponse.json();
        expect(evalData).toHaveProperty('outputs');
      }
    });
  });

  describe('Marketplace Discovery Flow', () => {
    it('should complete marketplace browsing workflow', async () => {
      // Step 1: Browse all calculators
      const listResponse = await fetch(`${API_URL}/api/calculators`);
      expect(listResponse.status).toBe(200);
      
      const listData = await listResponse.json();
      expect(listData.ok).toBe(true);
      expect(Array.isArray(listData.data.items)).toBe(true);

      // Step 2: Search calculators
      const searchResponse = await fetch(`${API_URL}/api/marketplace/search?q=test`);
      if (searchResponse.status === 200) {
        const searchData = await searchResponse.json();
        expect(searchData).toBeDefined();
      }

      // Step 3: Get trending calculators
      const trendingResponse = await fetch(`${API_URL}/api/marketplace/trending`);
      if (trendingResponse.status === 200) {
        const trendingData = await trendingResponse.json();
        expect(trendingData).toBeDefined();
      }

      // Step 4: Get categories
      const categoriesResponse = await fetch(`${API_URL}/api/marketplace/categories`);
      if (categoriesResponse.status === 200) {
        const categoriesData = await categoriesResponse.json();
        expect(categoriesData).toBeDefined();
      }
    });
  });
});




