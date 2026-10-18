import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import type { ApiResponse } from '@calc/shared';
import type { TrackedEvent } from '@calc/shared/src/events';

// Store events in database for analytics
export async function POST(request: NextRequest) {
  try {
    const event: TrackedEvent = await request.json();

    // Store event in database
    // TODO: Create events table or use existing analytics solution
    // For now, we'll log to console and could store in a events table
    
    // In production, you might want to:
    // 1. Store in a dedicated events table
    // 2. Send to analytics service (PostHog, Mixpanel, etc.)
    // 3. Process in real-time for dashboards

    console.log('[Analytics Event]', event);

    // If you have an events table:
    // await prisma.event.create({
    //   data: {
    //     name: event.name,
    //     properties: event.properties || {},
    //     userId: event.userId,
    //     sessionId: event.sessionId,
    //     timestamp: new Date(event.timestamp),
    //   },
    // });

    const response: ApiResponse<null> = {
      ok: true,
      message: 'Event tracked',
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Analytics tracking error:', error);
    // Don't fail the request if analytics fails
    return NextResponse.json(
      {
        ok: false,
        error: error.message || 'Failed to track event',
      },
      { status: 500 }
    );
  }
}




