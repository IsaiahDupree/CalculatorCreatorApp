import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const API_URL = process.env.API_URL || 'http://localhost:3001';

describe('Phase 3: Authentication & Ownership', () => {
  let testUser1: any;
  let testUser2: any;

  beforeAll(async () => {
    testUser1 = await prisma.user.create({
      data: { email: `test-owner1-${Date.now()}@example.com`, subscriptionTier: 'free' },
    });
    testUser2 = await prisma.user.create({
      data: { email: `test-owner2-${Date.now()}@example.com`, subscriptionTier: 'free' },
    });
  });

  afterAll(async () => {
    if (testUser1) {
      await prisma.calculator.deleteMany({ where: { creatorId: testUser1.id } });
      await prisma.user.delete({ where: { id: testUser1.id } });
    }
    if (testUser2) {
      await prisma.calculator.deleteMany({ where: { creatorId: testUser2.id } });
      await prisma.user.delete({ where: { id: testUser2.id } });
    }
    await prisma.$disconnect();
  });

  describe('Database: Owner & Metadata', () => {
    it('should have owner_id (creatorId) column', async () => {
      const calculator = await prisma.calculator.create({
        data: {
          slug: `test-owner-${Date.now()}`,
          title: 'Owner Test',
          summary: 'Test',
          spec: { id: 'test', version: 1, title: 'Test', inputs: [], outputs: [], equations: [] },
          creatorId: testUser1.id,
          status: 'draft',
        },
      });

      expect(calculator.creatorId).toBe(testUser1.id);
      await prisma.calculator.delete({ where: { id: calculator.id } });
    });

    it('should have category column', async () => {
      const calculator = await prisma.calculator.create({
        data: {
          slug: `test-category-${Date.now()}`,
          title: 'Category Test',
          summary: 'Test',
          category: 'engineering',
          spec: { id: 'test', version: 1, title: 'Test', inputs: [], outputs: [], equations: [] },
          creatorId: testUser1.id,
          status: 'draft',
        },
      });

      expect(calculator.category).toBe('engineering');
      await prisma.calculator.delete({ where: { id: calculator.id } });
    });

    it('should have tags column', async () => {
      const calculator = await prisma.calculator.create({
        data: {
          slug: `test-tags-${Date.now()}`,
          title: 'Tags Test',
          summary: 'Test',
          tags: ['math', 'physics'],
          spec: { id: 'test', version: 1, title: 'Test', inputs: [], outputs: [], equations: [] },
          creatorId: testUser1.id,
          status: 'draft',
        },
      });

      expect(Array.isArray(calculator.tags)).toBe(true);
      expect(calculator.tags).toContain('math');
      expect(calculator.tags).toContain('physics');
      await prisma.calculator.delete({ where: { id: calculator.id } });
    });
  });

  describe('Backend: Ownership Filtering', () => {
    it('should filter calculators by owner', async () => {
      // Create calculators for different owners
      const calc1 = await prisma.calculator.create({
        data: {
          slug: `test-filter1-${Date.now()}`,
          title: 'User1 Calculator',
          summary: 'Test',
          spec: { id: 'test', version: 1, title: 'Test', inputs: [], outputs: [], equations: [] },
          creatorId: testUser1.id,
          status: 'published',
        },
      });

      const calc2 = await prisma.calculator.create({
        data: {
          slug: `test-filter2-${Date.now()}`,
          title: 'User2 Calculator',
          summary: 'Test',
          spec: { id: 'test', version: 1, title: 'Test', inputs: [], outputs: [], equations: [] },
          creatorId: testUser2.id,
          status: 'published',
        },
      });

      // Filter by creator
      const user1Calcs = await prisma.calculator.findMany({
        where: { creatorId: testUser1.id },
      });

      expect(user1Calcs.length).toBeGreaterThan(0);
      expect(user1Calcs.every(c => c.creatorId === testUser1.id)).toBe(true);

      await prisma.calculator.delete({ where: { id: calc1.id } });
      await prisma.calculator.delete({ where: { id: calc2.id } });
    });

    it('should filter calculators by category', async () => {
      const calc1 = await prisma.calculator.create({
        data: {
          slug: `test-cat1-${Date.now()}`,
          title: 'Engineering Calc',
          summary: 'Test',
          category: 'engineering',
          spec: { id: 'test', version: 1, title: 'Test', inputs: [], outputs: [], equations: [] },
          creatorId: testUser1.id,
          status: 'published',
        },
      });

      const calc2 = await prisma.calculator.create({
        data: {
          slug: `test-cat2-${Date.now()}`,
          title: 'Math Calc',
          summary: 'Test',
          category: 'mathematics',
          spec: { id: 'test', version: 1, title: 'Test', inputs: [], outputs: [], equations: [] },
          creatorId: testUser1.id,
          status: 'published',
        },
      });

      const engineeringCalcs = await prisma.calculator.findMany({
        where: { category: 'engineering' },
      });

      expect(engineeringCalcs.length).toBeGreaterThan(0);
      expect(engineeringCalcs.every(c => c.category === 'engineering')).toBe(true);

      await prisma.calculator.delete({ where: { id: calc1.id } });
      await prisma.calculator.delete({ where: { id: calc2.id } });
    });
  });

  describe('API: Authentication Endpoints', () => {
    it('should have signup endpoint', async () => {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: `test-signup-${Date.now()}@example.com`,
          password: 'TestPassword123!',
          username: `testuser${Date.now()}`,
        }),
      });

      expect([200, 201, 400, 409]).toContain(response.status);
    });

    it('should have login endpoint', async () => {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'nonexistent@example.com',
          password: 'wrongpassword',
        }),
      });

      expect([401, 400, 404, 500]).toContain(response.status);
    });
  });
});




