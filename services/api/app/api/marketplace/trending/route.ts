import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import type { ApiResponse } from '@calc/shared';

// Calculate trending score using Wilson score + time decay
function calculateTrendingScore(
  positive: number,
  total: number,
  createdAt: Date
): number {
  // Wilson score interval (lower bound)
  const z = 1.96; // 95% confidence
  const p = total > 0 ? positive / total : 0;
  const n = total;

  const denominator = 1 + (z * z) / n;
  const numerator = p + (z * z) / (2 * n) - z * Math.sqrt((p * (1 - p) + z * z / (4 * n)) / n);
  const wilsonScore = numerator / denominator;

  // Time decay (half-life of 7 days)
  const daysSinceCreation = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
  const decayFactor = Math.exp(-daysSinceCreation / 7);

  return wilsonScore * decayFactor;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);

    // Get calculators with their stats
    const calculators = await prisma.calculator.findMany({
      where: {
        status: 'published',
      },
      include: {
        feedback: {
          select: {
            rating: true,
          },
        },
        _count: {
          select: {
            runs: true,
            feedback: true,
          },
        },
      },
      orderBy: {
        trendingScore: 'desc',
      },
      take: limit,
    });

    // Calculate and update trending scores
    const updates = calculators.map((calc) => {
      const positive = calc.feedback.filter((f) => f.rating >= 4).length;
      const total = calc._count.feedback || 1;
      const score = calculateTrendingScore(
        positive,
        total,
        calc.createdAt
      );

      return prisma.calculator.update({
        where: { id: calc.id },
        data: { trendingScore: score },
      });
    });

    await Promise.all(updates);

    // Return updated calculators
    const updated = calculators.map((calc) => ({
      ...calc,
      trendingScore: calculateTrendingScore(
        calc.feedback.filter((f) => f.rating >= 4).length,
        calc._count.feedback || 1,
        calc.createdAt
      ),
    }));

    const response: ApiResponse<any> = {
      ok: true,
      data: updated,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error fetching trending calculators:', error);
    return NextResponse.json(
      {
        ok: false,
        error: error.message || 'Failed to fetch trending calculators',
      },
      { status: 500 }
    );
  }
}




