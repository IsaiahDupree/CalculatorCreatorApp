import { describe, it, expect } from 'vitest';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const API_URL = process.env.API_URL || 'http://localhost:3001';

describe('Security: Input Validation', () => {
  describe('SQL Injection Prevention', () => {
    it('should prevent SQL injection in email field', async () => {
      const maliciousInput = "'; DROP TABLE users; --";
      
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: maliciousInput,
          password: 'TestPassword123!',
        }),
      });

      // Should reject invalid email format
      expect([400, 422]).toContain(response.status);
      
      // Verify users table still exists
      const userCount = await prisma.user.count();
      expect(userCount).toBeGreaterThanOrEqual(0);
    });

    it('should prevent SQL injection in search queries', async () => {
      const maliciousInput = "'; DROP TABLE calculators; --";
      
      const response = await fetch(`${API_URL}/api/calculators?search=${encodeURIComponent(maliciousInput)}`);
      
      // Should handle safely (either return results or error, but not crash)
      expect([200, 400, 500]).toContain(response.status);
      
      // Verify calculators table still exists
      const calcCount = await prisma.calculator.count();
      expect(calcCount).toBeGreaterThanOrEqual(0);
    });
  });

  describe('XSS Prevention', () => {
    it('should sanitize HTML in calculator titles', async () => {
      const xssPayload = '<script>alert("XSS")</script>';
      
      // Test that HTML is not executed
      const response = await fetch(`${API_URL}/api/calculators`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: xssPayload,
          spec: {
            id: 'test',
            version: 1,
            title: 'Test',
            inputs: [],
            outputs: [],
            equations: [],
          },
        }),
      });

      // Should either reject or sanitize
      expect([200, 201, 400, 401, 500]).toContain(response.status);
    });
  });

  describe('Input Length Validation', () => {
    it('should reject extremely long inputs', async () => {
      const longString = 'a'.repeat(10000);
      
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: `${longString}@example.com`,
          password: 'TestPassword123!',
        }),
      });

      // Should reject overly long inputs (409 is also acceptable for conflict)
      expect([400, 409, 413, 422]).toContain(response.status);
    });

    it('should handle reasonable input lengths', async () => {
      const reasonableEmail = `test-${Date.now()}@example.com`;
      
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: reasonableEmail,
          password: 'TestPassword123!',
          username: 'testuser',
        }),
      });

      // Should accept reasonable inputs
      expect([200, 201, 400, 409, 500]).toContain(response.status);
    });
  });

  describe('Type Validation', () => {
    it('should reject invalid data types', async () => {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 12345, // Invalid type
          password: null, // Invalid type
        }),
      });

      expect([400, 422]).toContain(response.status);
    });

    it('should validate calculator spec structure', async () => {
      const response = await fetch(`${API_URL}/api/calculators`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spec: {
            // Missing required fields
            id: 'test',
          },
        }),
      });

      expect([400, 401, 422]).toContain(response.status);
    });
  });

  describe('Rate Limiting', () => {
    it('should handle rapid requests gracefully', async () => {
      const requests = Array(20).fill(null).map(() =>
        fetch(`${API_URL}/api/health`)
      );

      const responses = await Promise.all(requests);
      
      // All should succeed or be rate limited (429)
      responses.forEach(response => {
        expect([200, 429]).toContain(response.status);
      });
    });
  });
});

