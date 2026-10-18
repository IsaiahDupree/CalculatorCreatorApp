import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Phase 1: MVP Setup', () => {
  describe('Project Initialization', () => {
    it('should have database connection', async () => {
      await expect(prisma.$connect()).resolves.not.toThrow();
    });

    it('should have required tables', async () => {
      const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
        SELECT tablename FROM pg_tables WHERE schemaname = 'public'
      `;
      
      const tableNames = tables.map(t => t.tablename);
      expect(tableNames).toContain('User');
      expect(tableNames).toContain('Calculator');
    });
  });

  describe('Mock APIs & Schema', () => {
    it('should have CalculatorSpec schema defined', async () => {
      // Verify we can create a calculator with spec
      const testSpec = {
        id: 'test-calc',
        version: 1,
        title: 'Test Calculator',
        summary: 'Test summary',
        inputs: [{ id: 'x', label: 'X', type: 'number' }],
        outputs: [{ id: 'result', label: 'Result' }],
        equations: [{ expr: 'x * 2' }],
      };

      const user = await prisma.user.create({
        data: { email: `test-${Date.now()}@example.com`, subscriptionTier: 'free' },
      });

      const uniqueSlug = `test-mvp-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      const calculator = await prisma.calculator.create({
        data: {
          slug: uniqueSlug,
          title: testSpec.title,
          summary: testSpec.summary,
          spec: testSpec as any,
          creatorId: user.id,
          status: 'draft',
        },
      });

      expect(calculator).toBeDefined();
      expect(calculator.spec).toBeDefined();

      // Cleanup
      await prisma.calculator.delete({ where: { id: calculator.id } });
      await prisma.user.delete({ where: { id: user.id } });
    });
  });

  describe('Basic Frontend UI', () => {
    it('should have health endpoint for frontend', async () => {
      const response = await fetch('http://localhost:3001/api/health');
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.ok).toBe(true);
    });

    it('should have calculators list endpoint', async () => {
      const response = await fetch('http://localhost:3001/api/calculators');
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.ok).toBe(true);
      expect(data.data).toHaveProperty('items');
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});

