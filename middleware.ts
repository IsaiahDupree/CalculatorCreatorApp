import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory rate limiter
const rateLimit = new Map();

export function middleware(request: NextRequest) {
    const ip = request.ip || '127.0.0.1';
    const limit = 100; // requests
    const windowMs = 60 * 1000; // 1 minute

    if (!rateLimit.has(ip)) {
        rateLimit.set(ip, { count: 0, startTime: Date.now() });
    }

    const current = rateLimit.get(ip);
    const now = Date.now();

    if (now - current.startTime > windowMs) {
        current.count = 0;
        current.startTime = now;
    }

    current.count++;

    if (current.count > limit) {
        return new NextResponse('Too Many Requests', { status: 429 });
    }

    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', limit.toString());
    response.headers.set('X-RateLimit-Remaining', (limit - current.count).toString());

    return response;
}

export const config = {
    matcher: '/api/:path*',
};
