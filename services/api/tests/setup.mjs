// Test setup file
import { beforeAll, afterAll } from 'vitest';

// Set test environment variables
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:54321/postgres';
process.env.NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || 'test-secret-key-min-32-characters-long';
process.env.NEXTAUTH_URL = process.env.NEXTAUTH_URL || 'http://localhost:3001';

beforeAll(async () => {
  // Setup before all tests
  console.log('🧪 Test environment setup');
});

afterAll(async () => {
  // Cleanup after all tests
  console.log('🧹 Test cleanup');
});




