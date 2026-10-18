import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        const { data, error } = await supabase
            .from('calculators')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) {
            return NextResponse.json({ error: 'Calculator not found' }, { status: 404 });
        }

        // Increment view count
        await supabase
            .from('calculators')
            .update({ views: data.views + 1 })
            .eq('id', id);

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching calculator:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
