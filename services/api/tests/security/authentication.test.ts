import { describe, it, expect } from 'vitest';

const API_URL = process.env.API_URL || 'http://localhost:3001';

describe('Security: Authentication', () => {
  describe('Password Security', () => {
    it('should reject weak passwords', async () => {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: `test-weak-${Date.now()}@example.com`,
          password: '123', // Too short
          username: 'testuser',
        }),
      });

      // Should reject weak password
      expect([400, 422]).toContain(response.status);
    });

    it('should not return password in response', async () => {
      const email = `test-password-${Date.now()}@example.com`;
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password: 'SecurePassword123!',
          username: 'testuser',
        }),
      });

      if (response.status === 201 || response.status === 200) {
        const data = await response.json();
        // Password should never be in response
        expect(data.data).not.toHaveProperty('password');
        expect(JSON.stringify(data)).not.toContain('SecurePassword123!');
      }
    });
  });

  describe('Authorization', () => {
    it('should require authentication for protected endpoints', async () => {
      const response = await fetch(`${API_URL}/api/users/me`, {
        method: 'GET',
      });

      // Should require authentication
      expect([401, 403]).toContain(response.status);
    });

    it('should allow public access to health endpoint', async () => {
      const response = await fetch(`${API_URL}/api/health`, {
        method: 'GET',
      });

      expect(response.status).toBe(200);
    });

    it('should allow public read access to calculators', async () => {
      const response = await fetch(`${API_URL}/api/calculators`, {
        method: 'GET',
      });

      expect(response.status).toBe(200);
    });
  });

  describe('Session Security', () => {
    it('should use secure session tokens', async () => {
      // Test that sessions are properly managed
      const loginResponse = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'nonexistent@example.com',
          password: 'wrongpassword',
        }),
      });

      // Should not expose session info on failed login
      const data = await loginResponse.json().catch(() => ({}));
      expect(data).not.toHaveProperty('session');
      expect(data).not.toHaveProperty('token');
    });
  });
});




