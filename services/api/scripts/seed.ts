// Seed script to populate database with example calculators
// Run with: npx tsx scripts/seed.ts

import { PrismaClient } from '@prisma/client';
import { OHMS_SPEC } from '@calc/spec/src/examples/ohms';
import { KINETIC_SPEC } from '@calc/spec/src/examples/kinetic';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create a test user
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      username: 'testuser',
      name: 'Test User',
      subscriptionTier: 'free',
    },
  });

  console.log('✅ Created test user:', user.email);

  // Create Ohm's Law calculator
  const ohmsCalculator = await prisma.calculator.upsert({
    where: { slug: OHMS_SPEC.id },
    update: {},
    create: {
      slug: OHMS_SPEC.id,
      title: OHMS_SPEC.title,
      summary: OHMS_SPEC.summary,
      category: OHMS_SPEC.category,
      tags: OHMS_SPEC.tags,
      spec: OHMS_SPEC as any,
      status: 'published',
      creatorId: user.id,
      version: OHMS_SPEC.version,
      physicsVetted: true,
      reviewStatus: 'approved',
      publishedAt: new Date(),
    },
  });

  console.log('✅ Created calculator:', ohmsCalculator.title);

  // Create Kinetic Energy calculator
  const kineticCalculator = await prisma.calculator.upsert({
    where: { slug: KINETIC_SPEC.id },
    update: {},
    create: {
      slug: KINETIC_SPEC.id,
      title: KINETIC_SPEC.title,
      summary: KINETIC_SPEC.summary,
      category: KINETIC_SPEC.category,
      tags: KINETIC_SPEC.tags,
      spec: KINETIC_SPEC as any,
      status: 'published',
      creatorId: user.id,
      version: KINETIC_SPEC.version,
      physicsVetted: true,
      reviewStatus: 'approved',
      publishedAt: new Date(),
    },
  });

  console.log('✅ Created calculator:', kineticCalculator.title);

  // Create examples
  for (const example of OHMS_SPEC.examples) {
    await prisma.calculatorExample.create({
      data: {
        calculatorId: ohmsCalculator.id,
        inputs: example.inputs,
        outputs: example.outputs,
        description: example.description,
      },
    });
  }

  for (const example of KINETIC_SPEC.examples) {
    await prisma.calculatorExample.create({
      data: {
        calculatorId: kineticCalculator.id,
        inputs: example.inputs,
        outputs: example.outputs,
        description: example.description,
      },
    });
  }

  console.log('✅ Created examples');

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });




