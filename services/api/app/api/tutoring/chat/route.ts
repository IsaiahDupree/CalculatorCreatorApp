import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { ChatOpenAI } from '@langchain/openai';
import type { ApiResponse } from '@calc/shared';

const llm = new ChatOpenAI({
  modelName: 'gpt-4',
  temperature: 0.7,
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { ok: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user has tutoring access (Pro or Business tier)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { subscriptionTier: true },
    });

    if (!user || !['pro', 'business'].includes(user.subscriptionTier)) {
      return NextResponse.json(
        { ok: false, error: 'Tutoring requires Pro or Business subscription' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { calculatorId, message, sessionId, inputs, outputs } = body;

    if (!calculatorId || !message) {
      return NextResponse.json(
        { ok: false, error: 'Calculator ID and message are required' },
        { status: 400 }
      );
    }

    // Get calculator spec
    const calculator = await prisma.calculator.findUnique({
      where: { id: calculatorId },
      select: { spec: true, title: true },
    });

    if (!calculator) {
      return NextResponse.json(
        { ok: false, error: 'Calculator not found' },
        { status: 404 }
      );
    }

    const spec = calculator.spec as any;

    // Get or create tutoring session
    let tutoringSession;
    if (sessionId) {
      tutoringSession = await prisma.tutoringSession.findUnique({
        where: { id: sessionId },
      });
    }

    if (!tutoringSession) {
      tutoringSession = await prisma.tutoringSession.create({
        data: {
          userId: session.user.id,
          calculatorId,
          messages: [],
        },
      });
    }

    // Build context for AI
    const context = `
Calculator: ${calculator.title}
Inputs: ${JSON.stringify(inputs || {})}
Outputs: ${JSON.stringify(outputs || {})}
Calculator Spec:
- Inputs: ${spec.inputs.map((i: any) => `${i.label} (${i.unit || 'unitless'})`).join(', ')}
- Outputs: ${spec.outputs.map((o: any) => `${o.label} (${o.unit || 'unitless'})`).join(', ')}
- Equations: ${spec.equations.map((e: any) => e.expr).join(', ')}
${spec.summary ? `\nDescription: ${spec.summary}` : ''}
`;

    const systemPrompt = `You are a helpful tutor for engineering calculators. Your role is to:
1. Explain how to use the calculator step-by-step
2. Help users understand the inputs and outputs
3. Explain the underlying formulas and theory
4. Provide examples and real-world context
5. Answer questions about the calculator

Be clear, educational, and encouraging. Use the calculator context to provide accurate information.`;

    // Get conversation history
    const messages = (tutoringSession.messages as any[]) || [];
    const conversationHistory = messages.slice(-10).map((m: any) => ({
      role: m.role,
      content: m.content,
    }));

    // Generate response
    const response = await llm.invoke([
      { role: 'system', content: systemPrompt },
      { role: 'system', content: `Calculator Context:\n${context}` },
      ...conversationHistory,
      { role: 'user', content: message },
    ]);

    const assistantMessage = {
      role: 'assistant',
      content: response.content as string,
      timestamp: new Date().toISOString(),
    };

    const userMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };

    // Update session with new messages
    await prisma.tutoringSession.update({
      where: { id: tutoringSession.id },
      data: {
        messages: [...messages, userMessage, assistantMessage],
      },
    });

    const apiResponse: ApiResponse<{
      sessionId: string;
      message: string;
      role: string;
    }> = {
      ok: true,
      data: {
        sessionId: tutoringSession.id,
        message: assistantMessage.content,
        role: 'assistant',
      },
    };

    return NextResponse.json(apiResponse);
  } catch (error: any) {
    console.error('Tutoring chat error:', error);
    return NextResponse.json(
      {
        ok: false,
        error: error.message || 'Failed to generate tutoring response',
      },
      { status: 500 }
    );
  }
}




