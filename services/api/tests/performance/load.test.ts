import { describe, it, expect } from 'vitest';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const API_URL = process.env.API_URL || 'http://localhost:3001';

describe('Performance Tests', () => {
  describe('API Response Times', () => {
    it('health endpoint should respond within 500ms', async () => {
      const start = Date.now();
      const response = await fetch(`${API_URL}/api/health`, {
        signal: AbortSignal.timeout(5000),
      });
      const duration = Date.now() - start;

      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(500); // More realistic for local dev
    }, { timeout: 10000 });

    it('calculators list should respond within 500ms', async () => {
      const start = Date.now();
      const response = await fetch(`${API_URL}/api/calculators`);
      const duration = Date.now() - start;

      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(500);
    });

    it('calculators list with pagination should respond within 2000ms', async () => {
      const start = Date.now();
      const response = await fetch(`${API_URL}/api/calculators?page=1&limit=20`, {
        signal: AbortSignal.timeout(5000),
      });
      const duration = Date.now() - start;

      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(2000); // More realistic for database queries
    }, { timeout: 10000 });
  });

  describe('Database Query Performance', () => {
    it('should query calculators efficiently', async () => {
      const start = Date.now();
      const calculators = await prisma.calculator.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
      });
      const duration = Date.now() - start;

      expect(Array.isArray(calculators)).toBe(true);
      expect(duration).toBeLessThan(200); // Should be fast even with data
    });

    it('should query with filters efficiently', async () => {
      const start = Date.now();
      const calculators = await prisma.calculator.findMany({
        where: { status: 'published' },
        take: 10,
      });
      const duration = Date.now() - start;

      expect(Array.isArray(calculators)).toBe(true);
      expect(duration).toBeLessThan(200);
    });

    it('should handle large result sets efficiently', async () => {
      const start = Date.now();
      const count = await prisma.calculator.count();
      const duration = Date.now() - start;

      expect(count).toBeGreaterThanOrEqual(0);
      expect(duration).toBeLessThan(100); // Count should be very fast
    });
  });

  describe('Concurrent Requests', () => {
    it('should handle 10 concurrent health checks', async () => {
      const requests = Array(10).fill(null).map(() =>
        fetch(`${API_URL}/api/health`, {
          signal: AbortSignal.timeout(5000),
        })
      );

      const start = Date.now();
      const responses = await Promise.all(requests);
      const duration = Date.now() - start;

      responses.forEach(response => {
        expect(response.status).toBe(200);
      });

      // All 10 requests should complete within reasonable time (5 seconds for local dev)
      expect(duration).toBeLessThan(5000);
    }, { timeout: 10000 });

    it('should handle concurrent database queries', async () => {
      const queries = Array(5).fill(null).map(() =>
        prisma.calculator.findMany({ take: 5 })
      );

      const start = Date.now();
      const results = await Promise.all(queries);
      const duration = Date.now() - start;

      results.forEach(result => {
        expect(Array.isArray(result)).toBe(true);
      });

      expect(duration).toBeLessThan(500);
    });
  });

  describe('Memory & Resource Usage', () => {
    it('should not leak memory on repeated requests', async () => {
      const initialMemory = process.memoryUsage().heapUsed;

      // Make 50 requests
      for (let i = 0; i < 50; i++) {
        await fetch(`${API_URL}/api/health`);
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;

      // Memory increase should be reasonable (less than 50MB)
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
    });
  });
});

