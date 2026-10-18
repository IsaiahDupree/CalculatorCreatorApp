import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createAuthClient, supabase as supabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        // 1. Authenticate User
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const token = authHeader.replace('Bearer ', '');
        const supabase = createAuthClient(token);
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user || !user.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { priceId } = await request.json();
        if (!priceId) {
            return NextResponse.json({ error: 'Price ID is required' }, { status: 400 });
        }

        // 2. Get or Create Stripe Customer
        // Check if profile has stripe_customer_id
        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('stripe_customer_id')
            .eq('id', user.id)
            .single();

        let customerId = profile?.stripe_customer_id;

        if (!customerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                metadata: {
                    userId: user.id,
                },
            });
            customerId = customer.id;

            // Save customer ID to profile
            await supabaseAdmin
                .from('profiles')
                .update({ stripe_customer_id: customerId })
                .eq('id', user.id);
        }

        // 3. Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${request.headers.get('origin')}/subscription?success=true`,
            cancel_url: `${request.headers.get('origin')}/subscription?canceled=true`,
            metadata: {
                userId: user.id,
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error('Checkout error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
