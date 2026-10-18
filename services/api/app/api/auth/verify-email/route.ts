import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase';
import type { ApiResponse } from '@calc/shared';

const VerifyEmailSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = VerifyEmailSchema.parse(body);

    // Resend verification email via Supabase
    const { error } = await supabaseAdmin.auth.resend({
      type: 'signup',
      email: validated.email,
    });

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          error: error.message || 'Failed to send verification email',
        },
        { status: 400 }
      );
    }

    const response: ApiResponse<null> = {
      ok: true,
      message: 'Verification email sent. Please check your inbox.',
    };

    return NextResponse.json(response);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Invalid email address',
          data: error.errors,
        },
        { status: 400 }
      );
    }

    console.error('Email verification error:', error);
    return NextResponse.json(
      {
        ok: false,
        error: error.message || 'Failed to send verification email',
      },
      { status: 500 }
    );
  }
}




