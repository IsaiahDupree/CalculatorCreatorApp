import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase';
import { prisma } from '@/lib/db';
import type { ApiResponse } from '@calc/shared';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = LoginSchema.parse(body);

    // Authenticate with Supabase (if configured)
    let sessionData: any = null;
    if (supabaseAdmin) {
      const { data, error } = await supabaseAdmin.auth.signInWithPassword({
        email: validated.email,
        password: validated.password,
      });

      if (error || !data.user) {
        return NextResponse.json(
          {
            ok: false,
            error: 'Invalid email or password',
          },
          { status: 401 }
        );
      }
      sessionData = data;
    }

    // Get user from our database
    const user = await prisma.user.findUnique({
      where: { email: validated.email },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        avatar: true,
        subscriptionTier: true,
        xp: true,
        level: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Invalid email or password',
        },
        { status: 401 }
      );
    }

    const response: ApiResponse<{
      user: typeof user;
      session?: {
        accessToken: string;
        refreshToken: string;
      };
    }> = {
      ok: true,
      data: {
        user,
        ...(sessionData?.session && {
          session: {
            accessToken: sessionData.session.access_token,
            refreshToken: sessionData.session.refresh_token,
          },
        }),
      },
      message: 'Login successful',
    };

    return NextResponse.json(response);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Invalid request data',
          data: error.errors,
        },
        { status: 400 }
      );
    }

    console.error('Login error:', error);
    return NextResponse.json(
      {
        ok: false,
        error: error.message || 'Failed to login',
      },
      { status: 500 }
    );
  }
}

