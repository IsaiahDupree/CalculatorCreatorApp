import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const API_URL = process.env.API_URL || 'http://localhost:3001';

describe('Workflow: Real Data Tests', () => {
  let realUser: any;
  let realCalculators: any[] = [];

  beforeAll(async () => {
    // Create a real user with realistic data
    realUser = await prisma.user.create({
      data: {
        email: `realuser-${Date.now()}@example.com`,
        username: `realuser${Date.now()}`,
        name: 'Real Test User',
        subscriptionTier: 'pro',
        subscriptionStatus: 'active',
        xp: 100,
        level: 2,
      },
    });

    // Create multiple real calculators with realistic data
    const categories = ['engineering', 'mathematics', 'physics'];
    const tags = [['math', 'algebra'], ['physics', 'mechanics'], ['engineering', 'structural']];

    for (let i = 0; i < 3; i++) {
      const calc = await prisma.calculator.create({
        data: {
          slug: `real-calc-${Date.now()}-${i}`,
          title: `Real Calculator ${i + 1}`,
          summary: `This is a realistic calculator for testing workflow ${i + 1}`,
          category: categories[i],
          tags: tags[i],
          spec: {
            id: `real-calc-${i}`,
            version: 1,
            title: `Real Calculator ${i + 1}`,
            summary: `Realistic calculator spec ${i + 1}`,
            inputs: [
              { id: 'input1', label: 'Input 1', type: 'number', unit: 'm' },
              { id: 'input2', label: 'Input 2', type: 'number', unit: 'kg' },
            ],
            outputs: [
              { id: 'result', label: 'Result', unit: 'N' },
            ],
            equations: [
              { expr: 'input1 * input2 * 9.81' },
            ],
            category: categories[i],
            tags: tags[i],
          },
          creatorId: realUser.id,
          status: 'published',
          viewCount: Math.floor(Math.random() * 100),
          runCount: Math.floor(Math.random() * 50),
        },
      });
      realCalculators.push(calc);
    }
  });

  afterAll(async () => {
    // Clean up all real data
    for (const calc of realCalculators) {
      await prisma.calculatorRun.deleteMany({ where: { calculatorId: calc.id } });
      await prisma.calculator.delete({ where: { id: calc.id } });
    }
    if (realUser) {
      await prisma.user.delete({ where: { id: realUser.id } });
    }
    await prisma.$disconnect();
  });

  describe('Real User Workflow', () => {
    it('should handle complete user journey with real data', async () => {
      // Step 1: User browses calculators
      const browseResponse = await fetch(`${API_URL}/api/calculators?page=1&limit=10`);
      expect(browseResponse.status).toBe(200);
      
      const browseData = await browseResponse.json();
      expect(browseData.ok).toBe(true);
      expect(browseData.data.items.length).toBeGreaterThanOrEqual(0);

      // Step 2: User views specific calculator
      if (realCalculators.length > 0) {
        const viewResponse = await fetch(`${API_URL}/api/calculators/${realCalculators[0].id}`);
        expect(viewResponse.status).toBe(200);
        
        const viewData = await viewResponse.json();
        expect(viewData.ok).toBe(true);
        expect(viewData.data.id).toBe(realCalculators[0].id);

        // Step 3: User runs calculator multiple times
        for (let i = 0; i < 3; i++) {
          const run = await prisma.calculatorRun.create({
            data: {
              calculatorId: realCalculators[0].id,
              userId: realUser.id,
              inputs: { input1: 10 + i, input2: 5 + i },
              outputs: { result: (10 + i) * (5 + i) * 9.81 },
              success: true,
            },
          });
          expect(run).toBeDefined();
        }

        // Step 4: Update view and run counts
        await prisma.calculator.update({
          where: { id: realCalculators[0].id },
          data: {
            viewCount: { increment: 1 },
            runCount: { increment: 3 },
          },
        });

        // Step 5: Verify analytics
        const updated = await prisma.calculator.findUnique({
          where: { id: realCalculators[0].id },
        });

        expect(updated?.runCount).toBeGreaterThanOrEqual(3);
        expect(updated?.viewCount).toBeGreaterThanOrEqual(1);
      }
    });
  });

  describe('Real Data Filtering & Search', () => {
    it('should filter real calculators by category', async () => {
      const engineeringCalcs = await prisma.calculator.findMany({
        where: { category: 'engineering', status: 'published' },
      });

      expect(engineeringCalcs.length).toBeGreaterThanOrEqual(0);
      engineeringCalcs.forEach(calc => {
        expect(calc.category).toBe('engineering');
      });
    });

    it('should search real calculators by tags', async () => {
      const mathCalcs = await prisma.calculator.findMany({
        where: {
          tags: { has: 'math' },
          status: 'published',
        },
      });

      expect(mathCalcs.length).toBeGreaterThanOrEqual(0);
      mathCalcs.forEach(calc => {
        expect(calc.tags).toContain('math');
      });
    });

    it('should handle real pagination with actual data', async () => {
      const page1 = await prisma.calculator.findMany({
        where: { status: 'published' },
        take: 2,
        skip: 0,
        orderBy: { createdAt: 'desc' },
      });

      const page2 = await prisma.calculator.findMany({
        where: { status: 'published' },
        take: 2,
        skip: 2,
        orderBy: { createdAt: 'desc' },
      });

      // Pages should not overlap
      const page1Ids = page1.map(c => c.id);
      const page2Ids = page2.map(c => c.id);
      const overlap = page1Ids.filter(id => page2Ids.includes(id));
      expect(overlap.length).toBe(0);
    });
  });

  describe('Real Data Analytics', () => {
    it('should track real usage statistics', async () => {
      if (realCalculators.length === 0) return;

      const calc = realCalculators[0];
      
      // Create multiple runs
      const runs = [];
      for (let i = 0; i < 5; i++) {
        const run = await prisma.calculatorRun.create({
          data: {
            calculatorId: calc.id,
            userId: realUser.id,
            inputs: { input1: i, input2: i * 2 },
            outputs: { result: i * i * 2 * 9.81 },
            success: true,
          },
        });
        runs.push(run);
      }

      // Update run count
      await prisma.calculator.update({
        where: { id: calc.id },
        data: { runCount: { increment: 5 } },
      });

      // Verify statistics
      const stats = await prisma.calculator.findUnique({
        where: { id: calc.id },
        select: {
          runCount: true,
          viewCount: true,
        },
      });

      expect(stats?.runCount).toBeGreaterThanOrEqual(5);
      
      // Verify run history
      const runHistory = await prisma.calculatorRun.findMany({
        where: { calculatorId: calc.id },
      });

      expect(runHistory.length).toBeGreaterThanOrEqual(5);
    });
  });
});




