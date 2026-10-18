import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { prisma } from '@/lib/db';
import type { ApiResponse } from '@calc/shared';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accessToken } = body;

    if (!accessToken) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Access token is required',
        },
        { status: 400 }
      );
    }

    // Verify token with Supabase
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);

    if (error || !user) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Invalid access token',
        },
        { status: 401 }
      );
    }

    // Get or create user in our database
    let dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          email: user.email!,
          username: user.user_metadata?.preferred_username || user.email!.split('@')[0],
          name: user.user_metadata?.full_name || user.user_metadata?.name,
          avatar: user.user_metadata?.avatar_url,
          verified: user.email_confirmed_at ? true : false,
          subscriptionTier: 'free',
        },
      });
    } else {
      // Update user info
      dbUser = await prisma.user.update({
        where: { id: dbUser.id },
        data: {
          name: user.user_metadata?.full_name || user.user_metadata?.name || dbUser.name,
          avatar: user.user_metadata?.avatar_url || dbUser.avatar,
          verified: user.email_confirmed_at ? true : dbUser.verified,
        },
      });
    }

    const response: ApiResponse<{
      user: typeof dbUser;
      session: {
        accessToken: string;
        refreshToken: string;
      };
    }> = {
      ok: true,
      data: {
        user: dbUser,
        session: {
          accessToken: accessToken,
          refreshToken: '', // Supabase handles refresh
        },
      },
      message: 'Social login successful',
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Social auth error:', error);
    return NextResponse.json(
      {
        ok: false,
        error: error.message || 'Failed to authenticate',
      },
      { status: 500 }
    );
  }
}




