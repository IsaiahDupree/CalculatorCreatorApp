import { NextResponse } from 'next/server';
import { generateCalculatorSpec } from '@/lib/ai-service';
import { createAuthClient } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.replace('Bearer ', '');
        const supabase = createAuthClient(token);

        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check Subscription Limits
        const { data: profile } = await supabase
            .from('profiles')
            .select('subscription_tier')
            .eq('id', user.id)
            .single();

        const tier = profile?.subscription_tier || 'free';

        if (tier === 'free') {
            // Count calculators created by this user
            const { count, error: countError } = await supabase
                .from('calculators')
                .select('*', { count: 'exact', head: true })
                .eq('owner_id', user.id);

            if (countError) {
                console.error('Error counting calculators:', countError);
                return NextResponse.json({ error: 'Failed to check limits' }, { status: 500 });
            }

            const FREE_LIMIT = 3;
            if (count !== null && count >= FREE_LIMIT) {
                return NextResponse.json({
                    error: `Free plan limit reached (${FREE_LIMIT} calculators). Please upgrade to Pro.`
                }, { status: 403 });
            }
        }

        const { prompt } = await request.json();

        if (!prompt || typeof prompt !== 'string') {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        // Generate calculator spec using AI
        const spec = await generateCalculatorSpec(prompt);

        // Save to Supabase with owner_id
        const { data, error } = await supabase
            .from('calculators')
            .insert({
                title: spec.title,
                description: spec.description,
                spec: spec,
                owner_id: user.id,
                category: spec.category || 'General', // AI might generate this, or default
                tags: spec.tags || [],
            })
            .select()
            .single();

        if (error) {
            console.error('Database error:', error);
            return NextResponse.json({ error: 'Failed to save calculator' }, { status: 500 });
        }

        return NextResponse.json({ id: data.id, ...spec });
    } catch (error) {
        console.error('Generation error:', error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'Failed to generate calculator'
        }, { status: 500 });
    }
}
