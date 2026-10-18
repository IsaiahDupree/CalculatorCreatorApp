import { NextResponse } from 'next/server';
import { CalcSpecSchema } from '@/lib/calc-spec';
import { executeCalculator } from '@/lib/math-engine';
import { z } from 'zod';

const RunRequestSchema = z.object({
    spec: CalcSpecSchema,
    inputs: z.record(z.string(), z.number()),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { spec, inputs } = RunRequestSchema.parse(body);

        const outputs = executeCalculator(spec, inputs);

        return NextResponse.json({ outputs });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request or calculation error' }, { status: 400 });
    }
}
