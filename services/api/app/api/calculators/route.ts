import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import type { ApiResponse, PaginatedResponse } from '@calc/shared';
import type { TCalculatorSpec } from '@calc/spec';

// GET /api/calculators - List calculators
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const status = searchParams.get('status') || 'published';

    // Build where clause
    const where: any = {
      status,
    };

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
      ];
    }

    // Get calculators from database
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

    // Transform to include spec
    const items = calculators.map((calc) => ({
      ...calc,
      spec: calc.spec as TCalculatorSpec,
    }));

    const response: ApiResponse<PaginatedResponse<any>> = {
      ok: true,
      data: {
        items,
        total,
        page,
        limit,
        hasMore: (page - 1) * limit + calculators.length < total,
      },
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error fetching calculators:', error);
    return NextResponse.json(
      {
        ok: false,
        error: error.message || 'Failed to fetch calculators',
      },
      { status: 500 }
    );
  }
}

// POST /api/calculators - Create calculator
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { ok: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const spec = body.spec as TCalculatorSpec;
    
    // Validate spec structure (basic validation)
    if (!spec || !spec.id || !spec.title || !spec.inputs || !spec.outputs || !spec.equations) {
      return NextResponse.json(
        { ok: false, error: 'Invalid calculator spec' },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = spec.id || body.slug || spec.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    // Check if slug exists
    const existing = await prisma.calculator.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { ok: false, error: 'Calculator with this slug already exists' },
        { status: 409 }
      );
    }

    // Create calculator in database
    const calculator = await prisma.calculator.create({
      data: {
        slug,
        title: spec.title,
        summary: spec.summary || '',
        category: spec.category,
        tags: spec.tags || [],
        spec: spec as any,
        status: 'draft',
        creatorId: session.user.id,
        version: spec.version || 1,
        physicsVetted: spec.review?.status === 'approved' || false,
      },
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
    });

    const response: ApiResponse<any> = {
      ok: true,
      data: {
        ...calculator,
        spec: calculator.spec as TCalculatorSpec,
      },
      message: 'Calculator created successfully',
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error('Error creating calculator:', error);
    return NextResponse.json(
      {
        ok: false,
        error: error.message || 'Failed to create calculator',
      },
      { status: 500 }
    );
  }
}

