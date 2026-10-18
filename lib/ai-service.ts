import OpenAI from 'openai';
import { CalcSpecSchema, CalcSpec } from './calc-spec';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const SYSTEM_PROMPT = `You are an expert calculator specification generator. Your task is to convert user prompts into a structured JSON calculator specification.

The JSON must conform to this schema:
{
  "title": "string - Short title for the calculator",
  "description": "string - Brief description of what it calculates",
  "category": "string - Category (e.g., Physics, Finance, Engineering)",
  "tags": ["tag1", "tag2"],
  "inputs": [
    {
      "name": "string - variable name used in formulas (e.g., 'mass', 'velocity')",
      "label": "string - Human readable label",
      "type": "number" | "percent" | "boolean",
      "unit": "string - Unit of measurement (optional)",
      "defaultValue": number (optional),
      "min": number (optional),
      "max": number (optional),
      "description": "string - Help text (optional)"
    }
  ],
  "outputs": [
    {
      "name": "string - variable name for the result",
      "label": "string - Human readable label",
      "unit": "string - Unit of measurement (optional)",
      "description": "string - What this output represents"
    }
  ],
  "formulas": {
    "outputName": "mathematical expression using input names and standard math operators (+, -, *, /, ^, sqrt, etc.)"
  },
  "metadata": {
    "author": "AI",
    "version": "1.0.0"
  }
}

Important rules:
1. Use simple variable names in formulas (e.g., 'mass', 'velocity', not 'mass_kg')
2. Formulas must use MathJS syntax (https://mathjs.org/docs/expressions/syntax.html)
3. Common functions: sqrt(x), pow(x, y), abs(x), sin(x), cos(x), tan(x), log(x), exp(x)
4. For each output, provide the formula that calculates it
5. Ensure formulas only reference defined input names
6. Include appropriate units and ranges

Return ONLY the JSON, no additional text.`;

export async function generateCalculatorSpec(userPrompt: string): Promise<CalcSpec> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    const parsed = JSON.parse(content);

    // Validate against Zod schema
    const validated = CalcSpecSchema.parse(parsed);

    return validated;
  } catch (error) {
    console.error('Error generating calculator spec:', error);
    throw new Error('Failed to generate calculator specification');
  }
}
