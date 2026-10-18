import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { REVENUE_SHARE_PERCENTAGE } from '@calc/shared';
import type { ApiResponse } from '@calc/shared';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { ok: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only admins can trigger calculation
    // TODO: Add admin check

    const body = await request.json();
    const { period } = body; // Format: "2024-01"

    if (!period || !period.match(/^\d{4}-\d{2}$/)) {
      return NextResponse.json(
        { ok: false, error: 'Invalid period format. Use YYYY-MM' },
        { status: 400 }
      );
    }

    // Get total subscription revenue for the period
    const subscriptions = await prisma.subscription.findMany({
      where: {
        status: 'active',
      },
      include: {
        user: true,
      },
    });

    // Calculate total revenue (simplified - in production, get from Stripe)
    const totalRevenue = subscriptions.reduce((sum, sub) => {
      const price = sub.tier === 'pro' ? 10 : sub.tier === 'business' ? 39 : 0;
      return sum + price;
    }, 0);

    // Get calculator usage for the period
    const startDate = new Date(`${period}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const runs = await prisma.calculatorRun.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
        // Only count runs that led to tutoring sessions
        calculator: {
          tutoringSessions: {
            some: {
              startedAt: {
                gte: startDate,
                lt: endDate,
              },
            },
          },
        },
      },
      include: {
        calculator: {
          select: {
            id: true,
            creatorId: true,
          },
        },
      },
    });

    // Group by calculator creator
    const creatorUsage = runs.reduce((acc, run) => {
      const creatorId = run.calculator.creatorId;
      acc[creatorId] = (acc[creatorId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalUsage = Object.values(creatorUsage).reduce((sum, count) => sum + count, 0);

    // Calculate revenue share per creator
    const revenueShare = totalRevenue * REVENUE_SHARE_PERCENTAGE;
    const earnings: Array<{ userId: string; amount: number; usageCount: number }> = [];

    for (const [userId, usageCount] of Object.entries(creatorUsage)) {
      const share = totalUsage > 0 ? (usageCount / totalUsage) * revenueShare : 0;
      
      earnings.push({
        userId,
        amount: share,
        usageCount,
      });

      // Create or update earnings record
      await prisma.earnings.upsert({
        where: {
          id: `${userId}-${period}`,
        },
        update: {
          amount: share,
          usageCount,
        },
        create: {
          userId,
          period,
          amount: share,
          usageCount,
        },
      });
    }

    const response: ApiResponse<{
      period: string;
      totalRevenue: number;
      revenueShare: number;
      earnings: typeof earnings;
    }> = {
      ok: true,
      data: {
        period,
        totalRevenue,
        revenueShare,
        earnings,
      },
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Revenue share calculation error:', error);
    return NextResponse.json(
      {
        ok: false,
        error: error.message || 'Failed to calculate revenue share',
      },
      { status: 500 }
    );
  }
}




