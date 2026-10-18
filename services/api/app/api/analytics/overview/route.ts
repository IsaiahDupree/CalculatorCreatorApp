import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import type { ApiResponse } from '@calc/shared';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { ok: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get('days') || '30');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get user's calculators
    const calculators = await prisma.calculator.findMany({
      where: {
        creatorId: session.user.id,
      },
      select: {
        id: true,
        title: true,
      },
    });

    const calculatorIds = calculators.map((c) => c.id);

    // Get analytics data
    const [totalViews, totalRuns, totalShares, recentRuns, topCalculators] = await Promise.all([
      // Total views
      prisma.calculator.aggregate({
        where: {
          id: { in: calculatorIds },
        },
        _sum: {
          viewCount: true,
        },
      }),

      // Total runs
      prisma.calculatorRun.count({
        where: {
          calculatorId: { in: calculatorIds },
          createdAt: { gte: startDate },
        },
      }),

      // Total shares
      prisma.calculator.aggregate({
        where: {
          id: { in: calculatorIds },
        },
        _sum: {
          shareCount: true,
        },
      }),

      // Recent runs (last 7 days)
      prisma.calculatorRun.findMany({
        where: {
          calculatorId: { in: calculatorIds },
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
        include: {
          calculator: {
            select: {
              title: true,
            },
          },
        },
      }),

      // Top calculators by runs
      prisma.calculator.findMany({
        where: {
          id: { in: calculatorIds },
        },
        orderBy: {
          runCount: 'desc',
        },
        take: 5,
        select: {
          id: true,
          title: true,
          runCount: true,
          viewCount: true,
        },
      }),
    ]);

    // Calculate growth
    const previousPeriodStart = new Date(startDate);
    previousPeriodStart.setDate(previousPeriodStart.getDate() - days);

    const previousRuns = await prisma.calculatorRun.count({
      where: {
        calculatorId: { in: calculatorIds },
        createdAt: {
          gte: previousPeriodStart,
          lt: startDate,
        },
      },
    });

    const runGrowth = previousRuns > 0
      ? ((totalRuns - previousRuns) / previousRuns) * 100
      : totalRuns > 0 ? 100 : 0;

    const response: ApiResponse<{
      overview: {
        totalViews: number;
        totalRuns: number;
        totalShares: number;
        runGrowth: number;
      };
      recentRuns: typeof recentRuns;
      topCalculators: typeof topCalculators;
    }> = {
      ok: true,
      data: {
        overview: {
          totalViews: totalViews._sum.viewCount || 0,
          totalRuns,
          totalShares: totalShares._sum.shareCount || 0,
          runGrowth: Math.round(runGrowth * 100) / 100,
        },
        recentRuns,
        topCalculators,
      },
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      {
        ok: false,
        error: error.message || 'Failed to fetch analytics',
      },
      { status: 500 }
    );
  }
}




