import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import type { ApiResponse } from '@calc/shared';

// TODO: Add admin role check
const ADMIN_USER_IDS = process.env.ADMIN_USER_IDS?.split(',') || [];

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !ADMIN_USER_IDS.includes(session.user.id)) {
      return NextResponse.json(
        { ok: false, error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get('days') || '30');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get platform statistics
    const [
      totalUsers,
      totalCalculators,
      publishedCalculators,
      pendingCalculators,
      totalRuns,
      activeSubscriptions,
      totalRevenue,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.calculator.count(),
      prisma.calculator.count({ where: { status: 'published' } }),
      prisma.calculator.count({ where: { status: 'pending' } }),
      prisma.calculatorRun.count({
        where: { createdAt: { gte: startDate } },
      }),
      prisma.subscription.count({ where: { status: 'active' } }),
      // Calculate revenue from active subscriptions
      prisma.subscription.aggregate({
        where: { status: 'active' },
        _sum: {
          // TODO: Get actual revenue from Stripe
        },
      }),
    ]);

    // Get user growth data
    const userGrowth = await prisma.user.groupBy({
      by: ['createdAt'],
      _count: true,
      where: {
        createdAt: { gte: startDate },
      },
    });

    // Get calculator status distribution
    const calculatorStatus = await prisma.calculator.groupBy({
      by: ['status'],
      _count: true,
    });

    const response: ApiResponse<{
      overview: {
        totalUsers: number;
        totalCalculators: number;
        publishedCalculators: number;
        pendingCalculators: number;
        totalRuns: number;
        activeSubscriptions: number;
        totalRevenue: number;
      };
      userGrowth: typeof userGrowth;
      calculatorStatus: typeof calculatorStatus;
    }> = {
      ok: true,
      data: {
        overview: {
          totalUsers,
          totalCalculators,
          publishedCalculators,
          pendingCalculators,
          totalRuns,
          activeSubscriptions,
          totalRevenue: 0, // TODO: Calculate from Stripe
        },
        userGrowth,
        calculatorStatus,
      },
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      {
        ok: false,
        error: error.message || 'Failed to fetch admin statistics',
      },
      { status: 500 }
    );
  }
}




