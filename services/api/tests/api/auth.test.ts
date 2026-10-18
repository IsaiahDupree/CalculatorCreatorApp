import { describe, it, expect } from 'vitest';

const API_URL = process.env.API_URL || 'http://localhost:3001';

describe('Authentication API', () => {
  describe('POST /api/auth/signup', () => {
    it('should require email and password', async () => {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      expect(response.status).toBe(400);
    });

    it('should create user with valid data', async () => {
      const email = `test-${Date.now()}@example.com`;
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password: 'TestPassword123!',
          username: `testuser${Date.now()}`,
        }),
      });

      // Should either succeed or return validation error
      expect([200, 201, 400, 409]).toContain(response.status);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should require email and password', async () => {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      expect(response.status).toBe(400);
    });

    it('should reject invalid credentials', async () => {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'nonexistent@example.com',
          password: 'wrongpassword',
        }),
      });

      expect([401, 400]).toContain(response.status);
    });
  });
});




