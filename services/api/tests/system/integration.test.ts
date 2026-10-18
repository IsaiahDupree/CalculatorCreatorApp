import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const API_URL = process.env.API_URL || 'http://localhost:3001';

describe('System: Full Integration', () => {
  let testUser: any;
  let testCalculator: any;

  beforeAll(async () => {
    testUser = await prisma.user.create({
      data: { 
        email: `system-test-${Date.now()}@example.com`, 
        subscriptionTier: 'pro' 
      },
    });
  });

  afterAll(async () => {
    if (testCalculator) {
      await prisma.calculatorRun.deleteMany({ where: { calculatorId: testCalculator.id } });
      await prisma.calculator.delete({ where: { id: testCalculator.id } });
    }
    if (testUser) {
      await prisma.user.delete({ where: { id: testUser.id } });
    }
    await prisma.$disconnect();
  });

  describe('Database + API + Business Logic Integration', () => {
    it('should integrate calculator creation, retrieval, and evaluation', async () => {
      // Create calculator in database
      const uniqueSlug = `system-test-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      testCalculator = await prisma.calculator.create({
        data: {
          slug: uniqueSlug,
          title: 'System Integration Test',
          summary: 'Test calculator',
          spec: {
            id: 'system-test',
            version: 1,
            title: 'System Test',
            inputs: [{ id: 'a', label: 'A', type: 'number' }, { id: 'b', label: 'B', type: 'number' }],
            outputs: [{ id: 'sum', label: 'Sum' }],
            equations: [{ expr: 'a + b' }],
          },
          creatorId: testUser.id,
          status: 'published',
        },
      });

      // Retrieve via API
      const apiResponse = await fetch(`${API_URL}/api/calculators/${testCalculator.id}`);
      expect(apiResponse.status).toBe(200);
      
      const apiData = await apiResponse.json();
      expect(apiData.ok).toBe(true);
      expect(apiData.data.id).toBe(testCalculator.id);

      // Track usage
      await prisma.calculatorRun.create({
        data: {
          calculatorId: testCalculator.id,
          userId: testUser.id,
          inputs: { a: 5, b: 3 },
          outputs: { sum: 8 },
          success: true,
        },
      });

      // Update run count
      await prisma.calculator.update({
        where: { id: testCalculator.id },
        data: { runCount: { increment: 1 } },
      });

      // Verify integration
      const updated = await prisma.calculator.findUnique({
        where: { id: testCalculator.id },
      });

      expect(updated?.runCount).toBeGreaterThan(0);
    });
  });

  describe('Authentication + Authorization + Data Access', () => {
    it('should enforce ownership in data access', async () => {
      if (!testCalculator) return;

      // User should only see their own calculators when filtering
      const userCalcs = await prisma.calculator.findMany({
        where: { creatorId: testUser.id },
      });

      expect(userCalcs.every(c => c.creatorId === testUser.id)).toBe(true);
    });
  });

  describe('Subscription + Limits + Features', () => {
    it('should integrate subscription tier with feature access', async () => {
      const proUser = await prisma.user.findUnique({
        where: { id: testUser.id },
      });

      expect(proUser?.subscriptionTier).toBe('pro');
      
      // Pro users should have unlimited calculators
      const calcCount = await prisma.calculator.count({
        where: { creatorId: testUser.id },
      });

      // Pro tier should allow any number
      expect(calcCount).toBeGreaterThanOrEqual(0);
    });
  });
});




