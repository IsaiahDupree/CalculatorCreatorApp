import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase';
import type { ApiResponse } from '@calc/shared';

const PasswordResetSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = PasswordResetSchema.parse(body);

    // Send password reset email via Supabase
    const { error } = await supabaseAdmin.auth.resetPasswordForEmail(validated.email, {
      redirectTo: `${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/auth/reset-password`,
    });

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          error: error.message || 'Failed to send password reset email',
        },
        { status: 400 }
      );
    }

    const response: ApiResponse<null> = {
      ok: true,
      message: 'Password reset email sent. Please check your inbox.',
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

    console.error('Password reset error:', error);
    return NextResponse.json(
      {
        ok: false,
        error: error.message || 'Failed to send password reset email',
      },
      { status: 500 }
    );
  }
}




