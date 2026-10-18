// Test helper utilities

import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export async function createTestUser(email?: string) {
  return await prisma.user.create({
    data: {
      email: email || `test-${Date.now()}@example.com`,
      subscriptionTier: 'free',
    },
  });
}

export async function createTestCalculator(userId: string, data?: any) {
  return await prisma.calculator.create({
    data: {
      slug: `test-${Date.now()}`,
      title: data?.title || 'Test Calculator',
      summary: data?.summary || 'Test summary',
      spec: data?.spec || {
        id: `test-${Date.now()}`,
        version: 1,
        title: 'Test Calculator',
        inputs: [{ id: 'x', label: 'X', type: 'number' }],
        outputs: [{ id: 'result', label: 'Result' }],
        equations: [{ expr: 'x * 2' }],
      },
      creatorId: userId,
      status: data?.status || 'published',
      ...data,
    },
  });
}

export async function cleanupTestData(userId?: string, calculatorId?: string) {
  if (calculatorId) {
    await prisma.calculator.delete({ where: { id: calculatorId } }).catch(() => {});
  }
  if (userId) {
    await prisma.user.delete({ where: { id: userId } }).catch(() => {});
  }
}

export const API_URL = process.env.API_URL || 'http://localhost:3001';




