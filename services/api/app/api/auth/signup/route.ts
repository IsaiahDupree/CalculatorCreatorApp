import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase';
import { prisma } from '@/lib/db';
import type { ApiResponse } from '@calc/shared';

const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string().optional(),
  name: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = SignupSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          ok: false,
          error: 'User with this email already exists',
        },
        { status: 409 }
      );
    }

    // Create user in Supabase Auth (if configured)
    if (supabaseAdmin) {
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: validated.email,
        password: validated.password,
        email_confirm: true, // Auto-confirm email for now
        user_metadata: {
          name: validated.name || validated.username || validated.email.split('@')[0],
          username: validated.username || validated.email.split('@')[0],
        },
      });

      if (authError || !authData.user) {
        return NextResponse.json(
          {
            ok: false,
            error: authError?.message || 'Failed to create user',
          },
          { status: 400 }
        );
      }
    }

    // Create user in our database
    const user = await prisma.user.create({
      data: {
        email: validated.email,
        username: validated.username || validated.email.split('@')[0],
        name: validated.name || validated.email.split('@')[0],
        subscriptionTier: 'free',
      },
    });

    const response: ApiResponse<{ userId: string; email: string }> = {
      ok: true,
      data: {
        userId: user.id,
        email: user.email,
      },
      message: 'User created successfully',
    };

    return NextResponse.json(response, { status: 201 });
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

    console.error('Signup error:', error);
    return NextResponse.json(
      {
        ok: false,
        error: error.message || 'Failed to create user',
      },
      { status: 500 }
    );
  }
}

