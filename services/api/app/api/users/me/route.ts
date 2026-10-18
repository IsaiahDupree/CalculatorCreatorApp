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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        avatar: true,
        bio: true,
        subscriptionTier: true,
        subscriptionStatus: true,
        xp: true,
        level: true,
        badges: true,
        verified: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { ok: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const response: ApiResponse<typeof user> = {
      ok: true,
      data: user,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      {
        ok: false,
        error: error.message || 'Failed to fetch user',
      },
      { status: 500 }
    );
  }
}




