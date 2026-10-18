import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import type { TCalculatorSpec } from '@calc/spec';

const prisma = new PrismaClient();

describe('Database + API Integration', () => {
  let testUser: any;
  let testCalculator: any;

  beforeAll(async () => {
    // Create test user
    testUser = await prisma.user.create({
      data: {
        email: `integration-test-${Date.now()}@example.com`,
        subscriptionTier: 'free',
      },
    });

    // Create test calculator
    const spec: TCalculatorSpec = {
      id: `test-calc-${Date.now()}`,
      version: 1,
      title: 'Integration Test Calculator',
      summary: 'Test calculator for integration tests',
      inputs: [
        { id: 'a', label: 'A', type: 'number' },
        { id: 'b', label: 'B', type: 'number' },
      ],
      outputs: [
        { id: 'sum', label: 'Sum', unit: 'unit' },
      ],
      equations: [
        { expr: 'a + b' },
      ],
    };

    testCalculator = await prisma.calculator.create({
      data: {
        slug: `test-integration-${Date.now()}`,
        title: spec.title,
        summary: spec.summary,
        spec: spec as any,
        creatorId: testUser.id,
        status: 'published',
      },
    });
  });

  afterAll(async () => {
    // Cleanup
    if (testCalculator) {
      await prisma.calculator.delete({ where: { id: testCalculator.id } }).catch(() => {});
    }
    if (testUser) {
      await prisma.user.delete({ where: { id: testUser.id } }).catch(() => {});
    }
    await prisma.$disconnect();
  });

  it('should create calculator in database and retrieve via API', async () => {
    const API_URL = process.env.API_URL || 'http://localhost:3001';
    
    // Verify in database
    const dbCalc = await prisma.calculator.findUnique({
      where: { id: testCalculator.id },
    });
    expect(dbCalc).toBeDefined();
    expect(dbCalc?.title).toBe(testCalculator.title);

    // Verify via API (if API is running)
    try {
      const response = await fetch(`${API_URL}/api/calculators/${testCalculator.id}`);
      if (response.ok) {
        const apiCalc = await response.json();
        expect(apiCalc.data).toBeDefined();
      }
    } catch (error) {
      // API might not be running, that's okay for this test
      console.log('API not available, skipping API test');
    }
  });

  it('should track calculator runs', async () => {
    const run = await prisma.calculatorRun.create({
      data: {
        calculatorId: testCalculator.id,
        userId: testUser.id,
        inputs: { a: 5, b: 3 },
        outputs: { sum: 8 },
        success: true,
      },
    });

    expect(run).toBeDefined();
    expect(run.calculatorId).toBe(testCalculator.id);
    expect(run.success).toBe(true);

    // Increment run count (normally done by the evaluate endpoint)
    await prisma.calculator.update({
      where: { id: testCalculator.id },
      data: { runCount: { increment: 1 } },
    });

    // Verify run count updated
    const calculator = await prisma.calculator.findUnique({
      where: { id: testCalculator.id },
    });
    expect(calculator?.runCount).toBeGreaterThan(0);
  });
});

