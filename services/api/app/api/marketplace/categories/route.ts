import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import type { ApiResponse } from '@calc/shared';

export async function GET(request: NextRequest) {
  try {
    // Get unique categories with counts
    const calculators = await prisma.calculator.findMany({
      where: {
        status: 'published',
        category: {
          not: null,
        },
      },
      select: {
        category: true,
      },
    });

    // Count by category
    const categoryCounts = calculators.reduce((acc, calc) => {
      if (calc.category) {
        acc[calc.category] = (acc[calc.category] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const categories = Object.entries(categoryCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const response: ApiResponse<typeof categories> = {
      ok: true,
      data: categories,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      {
        ok: false,
        error: error.message || 'Failed to fetch categories',
      },
      { status: 500 }
    );
  }
}




