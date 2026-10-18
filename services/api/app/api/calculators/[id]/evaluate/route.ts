import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { evaluateSpec } from '@calc/evaluator';
import type { ApiResponse } from '@calc/shared';
import type { TCalculatorSpec } from '@calc/spec';

const EvaluateRequestSchema = z.object({
  inputs: z.record(z.union([z.string(), z.number(), z.boolean()])),
  version: z.string().optional(),
});

// POST /api/calculators/[id]/evaluate - Evaluate calculator
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    // Validate request
    const validated = EvaluateRequestSchema.parse(body);

    // Fetch calculator from database
    const calculator = await prisma.calculator.findFirst({
      where: {
        OR: [
          { id },
          { slug: id },
        ],
        status: 'published', // Only allow evaluation of published calculators
      },
    });

    if (!calculator) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Calculator not found or not published',
        },
        { status: 404 }
      );
    }

    const spec = calculator.spec as TCalculatorSpec;

    // Evaluate calculator
    const startTime = Date.now();
    const result = evaluateSpec(spec, validated.inputs);
    const duration = Date.now() - startTime;

    // Log the run
    const session = await getServerSession(authOptions);
    await prisma.calculatorRun.create({
      data: {
        calculatorId: calculator.id,
        userId: session?.user?.id,
        inputs: validated.inputs,
        outputs: result.outputs,
        duration,
        success: result.errors.length === 0,
        error: result.errors.length > 0 ? result.errors.join(', ') : null,
      },
    });

    // Increment run count
    await prisma.calculator.update({
      where: { id: calculator.id },
      data: { runCount: { increment: 1 } },
    });

    if (result.errors.length > 0) {
      return NextResponse.json(
        {
          ok: false,
          error: result.errors.join(', '),
          data: result,
        },
        { status: 400 }
      );
    }

    const response: ApiResponse<typeof result> = {
      ok: true,
      data: result,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Invalid request body',
          data: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        ok: false,
        error: error.message || 'Failed to evaluate calculator',
      },
      { status: 500 }
    );
  }
}

