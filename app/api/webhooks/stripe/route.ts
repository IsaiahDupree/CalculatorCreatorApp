import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';
import Stripe from 'stripe';

export async function POST(req: Request) {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('Stripe-Signature') as string;

    let event: Stripe.Event;

    try {
        if (!process.env.STRIPE_WEBHOOK_SECRET) {
            throw new Error('STRIPE_WEBHOOK_SECRET is missing');
        }
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const subscription = event.data.object as Stripe.Subscription;

    if (event.type === 'checkout.session.completed') {
        if (!session?.metadata?.userId) {
            return new NextResponse('User ID is missing in metadata', { status: 400 });
        }
        // Retrieve the subscription to get the status
        const sub = await stripe.subscriptions.retrieve(session.subscription as string);

        // Update profile
        await supabaseAdmin
            .from('profiles')
            .update({
                stripe_customer_id: session.customer as string,
                subscription_tier: 'pro', // Logic to determine tier based on price ID needed here, assuming Pro for now
                subscription_status: sub.status,
            })
            .eq('id', session.metadata.userId);
    }

    if (event.type === 'customer.subscription.updated') {
        // Find user by stripe_customer_id
        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('id')
            .eq('stripe_customer_id', subscription.customer as string)
            .single();

        if (profile) {
            await supabaseAdmin
                .from('profiles')
                .update({
                    subscription_status: subscription.status,
                })
                .eq('id', profile.id);
        }
    }

    if (event.type === 'customer.subscription.deleted') {
        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('id')
            .eq('stripe_customer_id', subscription.customer as string)
            .single();

        if (profile) {
            await supabaseAdmin
                .from('profiles')
                .update({
                    subscription_status: 'canceled',
                    subscription_tier: 'free',
                })
                .eq('id', profile.id);
        }
    }

    return new NextResponse(null, { status: 200 });
}
