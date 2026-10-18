import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import type { ApiResponse } from '@calc/shared';
import type { TCalculatorSpec } from '@calc/spec';

const AI_ORCHESTRATOR_URL = process.env.AI_ORCHESTRATOR_URL || 'http://localhost:8787';

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
    const { prompt, imageUrl } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        {
          ok: false,
          error: 'Prompt is required',
        },
        { status: 400 }
      );
    }

    // Call AI orchestrator
    const response = await fetch(`${AI_ORCHESTRATOR_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, imageUrl }),
    });

    const data = await response.json();

    if (!data.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: data.error || 'Failed to generate calculator',
          issues: data.issues,
        },
        { status: 400 }
      );
    }

    const responseData: ApiResponse<{
      spec: TCalculatorSpec;
      issues: string[];
    }> = {
      ok: true,
      data: {
        spec: data.data.spec,
        issues: data.data.issues || [],
      },
    };

    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error('AI generation error:', error);
    return NextResponse.json(
      {
        ok: false,
        error: error.message || 'Failed to generate calculator',
      },
      { status: 500 }
    );
  }
}




