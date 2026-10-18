import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import type { ApiResponse, PaginatedResponse } from '@calc/shared';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const category = searchParams.get('category');

    if (!query.trim()) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Search query is required',
        },
        { status: 400 }
      );
    }

    const where: any = {
      status: 'published',
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { summary: { contains: query, mode: 'insensitive' } },
        { tags: { has: query.toLowerCase() } },
      ],
    };

    if (category) {
      where.category = category;
    }

    const [calculators, total] = await Promise.all([
      prisma.calculator.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [
          { trendingScore: 'desc' },
          { createdAt: 'desc' },
        ],
        include: {
          creator: {
            select: {
              id: true,
              username: true,
              name: true,
              avatar: true,
            },
          },
        },
      }),
      prisma.calculator.count({ where }),
    ]);

    const response: ApiResponse<PaginatedResponse<any>> = {
      ok: true,
      data: {
        items: calculators,
        total,
        page,
        limit,
        hasMore: (page - 1) * limit + calculators.length < total,
      },
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error searching calculators:', error);
    return NextResponse.json(
      {
        ok: false,
        error: error.message || 'Failed to search calculators',
      },
      { status: 500 }
    );
  }
}




