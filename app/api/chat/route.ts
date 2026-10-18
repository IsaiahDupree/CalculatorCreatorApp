import { NextResponse } from 'next/server';
import { openai } from '@/lib/ai-service';

export async function POST(request: Request) {
    try {
        const { messages, context } = await request.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
        }

        const systemPrompt = `You are a helpful and knowledgeable tutor explaining concepts related to the calculator: "${context.title}".
        
Description: ${context.description}

Inputs:
${JSON.stringify(context.inputs, null, 2)}

Outputs:
${JSON.stringify(context.outputs, null, 2)}

Current Values:
${JSON.stringify(context.values, null, 2)}

Your goal is to help the user understand the underlying math, physics, or logic of this calculator. 
Be concise, encouraging, and clear. Use markdown for formatting math or code if needed.
Do not just give the answer if they ask for it; explain how to get there.`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages
            ],
            temperature: 0.7,
        });

        return NextResponse.json({ message: response.choices[0].message });
    } catch (error) {
        console.error('Chat error:', error);
        return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
    }
}
