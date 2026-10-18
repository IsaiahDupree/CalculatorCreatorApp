import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { stripe, SUBSCRIPTION_PRICES } from '@/lib/stripe';
import { prisma } from '@/lib/db';
import type { ApiResponse } from '@calc/shared';

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
    const { tier } = body;

    if (!tier || !['pro', 'business'].includes(tier)) {
      return NextResponse.json(
        { ok: false, error: 'Invalid subscription tier' },
        { status: 400 }
      );
    }

    const priceId = process.env[`STRIPE_PRICE_ID_${tier.toUpperCase()}`];
    if (!priceId) {
      return NextResponse.json(
        { ok: false, error: 'Price not configured' },
        { status: 500 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json(
        { ok: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: user.email,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/payment/cancel`,
      metadata: {
        userId: user.id,
        tier,
      },
    });

    const response: ApiResponse<{ url: string }> = {
      ok: true,
      data: {
        url: checkoutSession.url!,
      },
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Checkout creation error:', error);
    return NextResponse.json(
      {
        ok: false,
        error: error.message || 'Failed to create checkout session',
      },
      { status: 500 }
    );
  }
}




