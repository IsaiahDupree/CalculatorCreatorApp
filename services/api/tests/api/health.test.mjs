import { describe, it, expect } from 'vitest';

const API_URL = process.env.API_URL || 'http://localhost:3001';

describe('API Health Check', () => {
  it('should return health status', async () => {
    const response = await fetch(`${API_URL}/api/health`);
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('ok');
    expect(data.ok).toBe(true);
  });

  it('should return API message', async () => {
    const response = await fetch(`${API_URL}/api/health`);
    const data = await response.json();
    
    expect(data).toHaveProperty('message');
    expect(typeof data.message).toBe('string');
  });
});




