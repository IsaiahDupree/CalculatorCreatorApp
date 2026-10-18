import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simplified middleware for local development
// In production, use withAuth from next-auth/middleware
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Allow all API endpoints for local development
  // In production, this would check authentication
  if (path.startsWith('/api/')) {
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};

