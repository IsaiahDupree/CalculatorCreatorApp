import { Annotation, StateGraph, START, END } from '@langchain/langgraph';
import { ChatOpenAI } from '@langchain/openai';
import { CalculatorSpec } from '@calc/spec';
import type { TCalculatorSpec } from '@calc/spec';

// Define graph state
const State = Annotation.Root({
  prompt: Annotation<string>(),
  imageUrl: Annotation<string | undefined>(),
  topic: Annotation<string | undefined>(),
  spec: Annotation<TCalculatorSpec | undefined>(),
  issues: Annotation<string[]>({
    reducer: (a, b) => [...(a ?? []), ...(b ?? [])],
    default: () => [],
  }),
  validated: Annotation<boolean>({ default: () => false }),
});

// Initialize LLM
const llm = new ChatOpenAI({
  modelName: 'gpt-4',
  temperature: 0.3,
});

// Node: Parse prompt and extract calculator requirements
const parsePrompt = async (state: typeof State.State) => {
  const systemPrompt = `You are an expert at analyzing calculator requirements from natural language descriptions.
Extract the following information:
- Calculator title
- Input variables (name, type, unit, min, max, description)
- Output variables (name, unit, description)
- Equations/formulas
- Category
- Tags

Return a structured JSON that matches the CalculatorSpec schema.`;

  const userPrompt = `Analyze this calculator request: "${state.prompt}"

Extract all variables, units, formulas, and create a complete calculator specification.`;

  try {
    const response = await llm.invoke([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ]);

    // Parse JSON from response
    const content = response.content as string;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { issues: ['Failed to extract JSON from LLM response'] };
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    // Validate with CalculatorSpec schema
    const validation = CalculatorSpec.safeParse(parsed);
    
    if (!validation.success) {
      return {
        issues: validation.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`),
        spec: parsed, // Keep partial spec for fixing
      };
    }

    return {
      spec: validation.data,
      topic: parsed.category || 'General',
    };
  } catch (error: any) {
    return {
      issues: [`Error parsing prompt: ${error.message}`],
    };
  }
};

// Node: Validate calculator spec
const validateSpec = async (state: typeof State.State) => {
  if (!state.spec) {
    return { issues: ['No spec to validate'], validated: false };
  }

  const issues: string[] = [];

  // Check required fields
  if (!state.spec.inputs || state.spec.inputs.length === 0) {
    issues.push('No inputs defined');
  }
  if (!state.spec.outputs || state.spec.outputs.length === 0) {
    issues.push('No outputs defined');
  }
  if (!state.spec.equations || state.spec.equations.length === 0) {
    issues.push('No equations defined');
  }

  // Check units consistency
  for (const input of state.spec.inputs) {
    if (input.unit && !input.unit.match(/^[A-Za-zΩ°]+$/)) {
      issues.push(`Invalid unit format for input ${input.id}: ${input.unit}`);
    }
  }

  // Check equation syntax (basic check)
  for (const eq of state.spec.equations) {
    if (!eq.expr.includes('=')) {
      issues.push(`Invalid equation format: ${eq.expr}`);
    }
  }

  return {
    issues,
    validated: issues.length === 0,
  };
};

// Node: Generate examples
const generateExamples = async (state: typeof State.State) => {
  if (!state.spec || !state.validated) {
    return {};
  }

  const systemPrompt = `Generate realistic example inputs and outputs for this calculator.
Return 2-3 examples as JSON array with format:
[{ "inputs": {...}, "outputs": {...}, "description": "..." }]`;

  const userPrompt = `Calculator: ${state.spec.title}
Inputs: ${JSON.stringify(state.spec.inputs)}
Equations: ${state.spec.equations.map((e) => e.expr).join(', ')}`;

  try {
    const response = await llm.invoke([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ]);

    const content = response.content as string;
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const examples = JSON.parse(jsonMatch[0]);
      return {
        spec: {
          ...state.spec,
          examples: examples,
        },
      };
    }
  } catch (error) {
    console.error('Error generating examples:', error);
  }

  return {};
};

// Build the graph
const workflow = new StateGraph(State)
  .addNode('parse', parsePrompt)
  .addNode('validate', validateSpec)
  .addNode('generate_examples', generateExamples)
  .addEdge(START, 'parse')
  .addEdge('parse', 'validate')
  .addConditionalEdges('validate', (state) => {
    return state.validated ? 'generate_examples' : END;
  })
  .addEdge('generate_examples', END);

export const graph = workflow.compile();

// Main function to generate calculator from prompt
export async function generateCalculator(prompt: string, imageUrl?: string): Promise<{
  spec?: TCalculatorSpec;
  issues: string[];
}> {
  const initialState = {
    prompt,
    imageUrl,
    topic: undefined,
    spec: undefined,
    issues: [],
    validated: false,
  };

  try {
    const result = await graph.invoke(initialState);
    
    return {
      spec: result.spec,
      issues: result.issues || [],
    };
  } catch (error: any) {
    return {
      issues: [`Generation failed: ${error.message}`],
    };
  }
}




