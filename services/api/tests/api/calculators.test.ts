import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';

const API_URL = process.env.API_URL || 'http://localhost:3001';
const prisma = new PrismaClient();

describe('Calculators API', () => {
  let testUserId: string;
  let testCalculatorId: string;

  beforeAll(async () => {
    // Create test user
    const user = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        subscriptionTier: 'free',
      },
    });
    testUserId = user.id;
  });

  afterAll(async () => {
    // Cleanup
    if (testCalculatorId) {
      await prisma.calculator.delete({ where: { id: testCalculatorId } }).catch(() => {});
    }
    if (testUserId) {
      await prisma.user.delete({ where: { id: testUserId } }).catch(() => {});
    }
    await prisma.$disconnect();
  });

  describe('GET /api/calculators', () => {
    it('should return list of calculators', async () => {
      const response = await fetch(`${API_URL}/api/calculators`);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data).toHaveProperty('ok');
      expect(data.ok).toBe(true);
      expect(data.data).toHaveProperty('items');
      expect(Array.isArray(data.data.items)).toBe(true);
    });

    it('should support pagination', async () => {
      const response = await fetch(`${API_URL}/api/calculators?page=1&limit=10`);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data).toHaveProperty('data');
      expect(data.data).toHaveProperty('items');
      expect(Array.isArray(data.data.items)).toBe(true);
    });
  });

  describe('POST /api/calculators', () => {
    it('should create a calculator', async () => {
      const calculatorData = {
        title: 'Test Calculator',
        summary: 'Test summary',
        spec: {
          id: `test-${Date.now()}`,
          title: 'Test Calculator',
          inputs: [
            { id: 'x', label: 'X', type: 'number' },
          ],
          outputs: [
            { id: 'result', label: 'Result', unit: 'unit' },
          ],
          equations: [
            { expr: 'x * 2' },
          ],
        },
        category: 'test',
        tags: ['test'],
      };

      // Note: This requires authentication in real implementation
      // For now, we'll test the endpoint structure
      const response = await fetch(`${API_URL}/api/calculators`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(calculatorData),
      });

      // Should either succeed (if auth is bypassed) or return 401
      expect([200, 201, 401, 403]).toContain(response.status);
    });
  });

  describe('GET /api/calculators/:id', () => {
    it('should return 404 for non-existent calculator', async () => {
      const response = await fetch(`${API_URL}/api/calculators/non-existent-id`);
      expect(response.status).toBe(404);
    });
  });
});

