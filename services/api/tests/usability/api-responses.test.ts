import { describe, it, expect } from 'vitest';

const API_URL = process.env.API_URL || 'http://localhost:3001';

describe('Usability: API Responses', () => {
  describe('Response Format Consistency', () => {
    it('should return consistent response format', async () => {
      const response = await fetch(`${API_URL}/api/health`);
      const data = await response.json();

      expect(data).toHaveProperty('ok');
      expect(typeof data.ok).toBe('boolean');
    });

    it('should include error messages in error responses', async () => {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'invalid',
          password: 'wrong',
        }),
      });

      if (response.status >= 400) {
        const data = await response.json();
        expect(data).toHaveProperty('error');
        expect(typeof data.error).toBe('string');
        expect(data.error.length).toBeGreaterThan(0);
      }
    });

    it('should return helpful validation errors', async () => {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'invalid-email',
          password: '123',
        }),
      });

      if (response.status === 400 || response.status === 422) {
        const data = await response.json();
        // Should provide specific validation errors
        expect(data).toHaveProperty('error');
      }
    });
  });

  describe('Error Codes', () => {
    it('should use appropriate HTTP status codes', async () => {
      const testCases = [
        { endpoint: '/api/health', method: 'GET', expectedStatus: 200 },
        { endpoint: '/api/calculators/non-existent', method: 'GET', expectedStatus: [404, 500] },
        { endpoint: '/api/users/me', method: 'GET', expectedStatus: [401, 403] },
      ];

      for (const testCase of testCases) {
        const response = await fetch(`${API_URL}${testCase.endpoint}`, {
          method: testCase.method,
        });

        if (Array.isArray(testCase.expectedStatus)) {
          expect(testCase.expectedStatus).toContain(response.status);
        } else {
          expect(response.status).toBe(testCase.expectedStatus);
        }
      }
    });
  });

  describe('Pagination', () => {
    it('should provide pagination metadata', async () => {
      const response = await fetch(`${API_URL}/api/calculators?page=1&limit=10`);
      const data = await response.json();

      if (data.ok && data.data) {
        expect(data.data).toHaveProperty('items');
        expect(data.data).toHaveProperty('total');
        expect(data.data).toHaveProperty('page');
        expect(data.data).toHaveProperty('limit');
        expect(data.data).toHaveProperty('hasMore');
      }
    });

    it('should handle invalid pagination gracefully', async () => {
      const response = await fetch(`${API_URL}/api/calculators?page=-1&limit=0`);
      
      // Should either use defaults or return error
      expect([200, 400]).toContain(response.status);
    });
  });

  describe('Content-Type Headers', () => {
    it('should return JSON content type', async () => {
      const response = await fetch(`${API_URL}/api/health`);
      const contentType = response.headers.get('content-type');

      expect(contentType).toContain('application/json');
    });
  });
});




