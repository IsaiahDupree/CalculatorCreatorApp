import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '10');
        const sort = searchParams.get('sort') || 'recent'; // 'recent' or 'trending'
        const category = searchParams.get('category');
        const ownerId = searchParams.get('owner_id');

        let query = supabase
            .from('calculators')
            .select('*')
            .limit(limit);

        if (category) {
            query = query.eq('category', category);
        }

        if (ownerId) {
            query = query.eq('owner_id', ownerId);
        }

        // Sort by views (trending) or created_at (recent)
        if (sort === 'trending') {
            query = query.order('views', { ascending: false });
        } else {
            query = query.order('created_at', { ascending: false });
        }

        const { data, error } = await query;

        if (error) {
            console.error('Database error:', error);
            return NextResponse.json({ error: 'Failed to fetch calculators' }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching calculators:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
