import { describe, it, expect, beforeAll } from 'vitest';
import { PrismaClient } from '@prisma/client';

describe('Database Schema', () => {
  let prisma: PrismaClient;

  beforeAll(() => {
    prisma = new PrismaClient();
  });

  it('should have all required tables', async () => {
    // Check User table
    await expect(prisma.user.findMany()).resolves.toBeDefined();
    
    // Check Calculator table
    await expect(prisma.calculator.findMany()).resolves.toBeDefined();
    
    // Check CalculatorRun table
    await expect(prisma.calculatorRun.findMany()).resolves.toBeDefined();
    
    // Check Feedback table
    await expect(prisma.feedback.findMany()).resolves.toBeDefined();
    
    // Check Subscription table
    await expect(prisma.subscription.findMany()).resolves.toBeDefined();
  });

  it('should enforce User email uniqueness', async () => {
    const email = `test-${Date.now()}@example.com`;
    
    // Create first user
    const user1 = await prisma.user.create({
      data: { email, subscriptionTier: 'free' },
    });
    
    expect(user1).toBeDefined();
    
    // Try to create duplicate email (should fail)
    await expect(
      prisma.user.create({
        data: { email, subscriptionTier: 'free' },
      })
    ).rejects.toThrow();
    
    // Cleanup
    await prisma.user.delete({ where: { id: user1.id } });
  });

  it('should cascade delete calculators when user is deleted', async () => {
    const email = `test-cascade-${Date.now()}@example.com`;
    
    // Create user
    const user = await prisma.user.create({
      data: { email, subscriptionTier: 'free' },
    });
    
    // Create calculator
    const calculator = await prisma.calculator.create({
      data: {
        slug: `test-${Date.now()}`,
        title: 'Test Calculator',
        spec: { inputs: [], outputs: [], equations: [] },
        creatorId: user.id,
        status: 'draft',
      },
    });
    
    expect(calculator).toBeDefined();
    
    // Delete user (should cascade delete calculator)
    await prisma.user.delete({ where: { id: user.id } });
    
    // Calculator should be deleted
    const deleted = await prisma.calculator.findUnique({
      where: { id: calculator.id },
    });
    
    expect(deleted).toBeNull();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});




