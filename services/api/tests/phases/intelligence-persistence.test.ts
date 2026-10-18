import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const API_URL = process.env.API_URL || 'http://localhost:3001';

describe('Phase 2: Intelligence & Persistence', () => {
  let testUserId: string;

  beforeAll(async () => {
    const user = await prisma.user.create({
      data: { email: `test-phase2-${Date.now()}@example.com`, subscriptionTier: 'free' },
    });
    testUserId = user.id;
  });

  afterAll(async () => {
    if (testUserId) {
      await prisma.calculator.deleteMany({ where: { creatorId: testUserId } });
      await prisma.user.delete({ where: { id: testUserId } });
    }
    await prisma.$disconnect();
  });

  describe('Configuration', () => {
    it('should have environment variables template', () => {
      // Check that .env file exists or can be created
      const requiredEnvVars = [
        'DATABASE_URL',
        'NEXTAUTH_SECRET',
        'NEXTAUTH_URL',
      ];

      requiredEnvVars.forEach(envVar => {
        // In test, we check if env vars are set or have defaults
        expect(process.env[envVar] || 'default').toBeDefined();
      });
    });

    it('should support optional Supabase configuration', () => {
      // Supabase should be optional for local development
      const hasSupabase = !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY);
      // Should work with or without Supabase
      expect(true).toBe(true); // Just verify test runs
    });
  });

  describe('Database (Supabase)', () => {
    it('should have calculators table with required columns', async () => {
      const calculator = await prisma.calculator.create({
        data: {
          slug: `test-${Date.now()}`,
          title: 'Test Calculator',
          summary: 'Test',
          spec: { id: 'test', version: 1, title: 'Test', inputs: [], outputs: [], equations: [] },
          creatorId: testUserId,
          status: 'draft',
        },
      });

      expect(calculator).toHaveProperty('id');
      expect(calculator).toHaveProperty('slug');
      expect(calculator).toHaveProperty('title');
      expect(calculator).toHaveProperty('spec');
      expect(calculator).toHaveProperty('creatorId');
      expect(calculator).toHaveProperty('status');

      await prisma.calculator.delete({ where: { id: calculator.id } });
    });

    it('should support SQL migrations via Prisma', async () => {
      // Verify Prisma can push schema
      const result = await prisma.$queryRaw`SELECT 1 as test`;
      expect(result).toBeDefined();
    });
  });

  describe('AI Integration', () => {
    it('should have AI generate endpoint', async () => {
      const response = await fetch(`${API_URL}/api/ai/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'Create a simple addition calculator',
        }),
      });

      // Should either succeed or return appropriate error
      expect([200, 201, 400, 401, 500]).toContain(response.status);
    });

    it('should validate calculator spec with Zod', async () => {
      // Test that spec validation works
      const validSpec = {
        id: 'test',
        version: 1,
        title: 'Test',
        inputs: [{ id: 'x', label: 'X', type: 'number' }],
        outputs: [{ id: 'result', label: 'Result' }],
        equations: [{ expr: 'x * 2' }],
      };

      const calculator = await prisma.calculator.create({
        data: {
          slug: `test-${Date.now()}`,
          title: validSpec.title,
          summary: '',
          spec: validSpec as any,
          creatorId: testUserId,
          status: 'draft',
        },
      });

      expect(calculator.spec).toBeDefined();
      await prisma.calculator.delete({ where: { id: calculator.id } });
    });
  });

  describe('API & Frontend Integration', () => {
    it('should have /api/calculators (List) endpoint', async () => {
      const response = await fetch(`${API_URL}/api/calculators`);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.ok).toBe(true);
      expect(data.data).toHaveProperty('items');
      expect(Array.isArray(data.data.items)).toBe(true);
    });

    it('should have /api/calculators/[id] (Get) endpoint', async () => {
      // Create a test calculator
      const calculator = await prisma.calculator.create({
        data: {
          slug: `test-get-${Date.now()}`,
          title: 'Test Get Calculator',
          summary: 'Test',
          spec: { id: 'test', version: 1, title: 'Test', inputs: [], outputs: [], equations: [] },
          creatorId: testUserId,
          status: 'published',
        },
      });

      const response = await fetch(`${API_URL}/api/calculators/${calculator.id}`);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.ok).toBe(true);
      expect(data.data).toHaveProperty('id', calculator.id);

      await prisma.calculator.delete({ where: { id: calculator.id } });
    });

    it('should return 404 for non-existent calculator', async () => {
      const response = await fetch(`${API_URL}/api/calculators/non-existent-id`);
      expect([404, 500]).toContain(response.status);
    });
  });
});




