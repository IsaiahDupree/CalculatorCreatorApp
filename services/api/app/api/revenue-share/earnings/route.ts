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
    const limit = parseInt(searchParams.get('limit') || '12');

    // Get user's earnings
    const earnings = await prisma.earnings.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        period: 'desc',
      },
      take: limit,
    });

    // Calculate totals
    const totalEarnings = earnings.reduce((sum, e) => sum + Number(e.amount), 0);
    const totalUsage = earnings.reduce((sum, e) => sum + e.usageCount, 0);

    const response: ApiResponse<{
      earnings: typeof earnings;
      totals: {
        amount: number;
        usageCount: number;
      };
    }> = {
      ok: true,
      data: {
        earnings,
        totals: {
          amount: totalEarnings,
          usageCount: totalUsage,
        },
      },
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error fetching earnings:', error);
    return NextResponse.json(
      {
        ok: false,
        error: error.message || 'Failed to fetch earnings',
      },
      { status: 500 }
    );
  }
}




