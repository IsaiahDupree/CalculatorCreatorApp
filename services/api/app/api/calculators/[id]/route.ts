import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import type { ApiResponse } from '@calc/shared';
import type { TCalculatorSpec } from '@calc/spec';

// GET /api/calculators/[id] - Get calculator by ID or slug
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Try to find by ID first, then by slug
    const calculator = await prisma.calculator.findFirst({
      where: {
        OR: [
          { id },
          { slug: id },
        ],
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
        examples: true,
      },
    });

    if (!calculator) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Calculator not found',
        },
        { status: 404 }
      );
    }

    // Increment view count
    await prisma.calculator.update({
      where: { id: calculator.id },
      data: { viewCount: { increment: 1 } },
    });

    const response: ApiResponse<any> = {
      ok: true,
      data: {
        ...calculator,
        spec: calculator.spec as TCalculatorSpec,
      },
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error fetching calculator:', error);
    return NextResponse.json(
      {
        ok: false,
        error: error.message || 'Failed to fetch calculator',
      },
      { status: 500 }
    );
  }
}

// PUT /api/calculators/[id] - Update calculator
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { ok: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();

    // Check if calculator exists and user owns it
    const calculator = await prisma.calculator.findUnique({
      where: { id },
    });

    if (!calculator) {
      return NextResponse.json(
        { ok: false, error: 'Calculator not found' },
        { status: 404 }
      );
    }

    if (calculator.creatorId !== session.user.id) {
      return NextResponse.json(
        { ok: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Update calculator
    const updated = await prisma.calculator.update({
      where: { id },
      data: {
        title: body.title,
        summary: body.summary,
        category: body.category,
        tags: body.tags,
        spec: body.spec,
        status: body.status,
      },
    });

    const response: ApiResponse<any> = {
      ok: true,
      data: {
        ...updated,
        spec: updated.spec as TCalculatorSpec,
      },
      message: 'Calculator updated successfully',
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error updating calculator:', error);
    return NextResponse.json(
      {
        ok: false,
        error: error.message || 'Failed to update calculator',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/calculators/[id] - Delete calculator
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { ok: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Check if calculator exists and user owns it
    const calculator = await prisma.calculator.findUnique({
      where: { id },
    });

    if (!calculator) {
      return NextResponse.json(
        { ok: false, error: 'Calculator not found' },
        { status: 404 }
      );
    }

    if (calculator.creatorId !== session.user.id) {
      return NextResponse.json(
        { ok: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Delete calculator
    await prisma.calculator.delete({
      where: { id },
    });

    return NextResponse.json({
      ok: true,
      message: 'Calculator deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting calculator:', error);
    return NextResponse.json(
      {
        ok: false,
        error: error.message || 'Failed to delete calculator',
      },
      { status: 500 }
    );
  }
}

