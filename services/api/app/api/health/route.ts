import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: 'Calculator Creator API is running',
    timestamp: new Date().toISOString(),
    service: 'calculator-creator-api',
  });
}

