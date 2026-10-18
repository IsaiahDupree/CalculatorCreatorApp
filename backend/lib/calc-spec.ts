import { z } from 'zod';

export const CalcInputSchema = z.object({
    name: z.string().describe("The variable name used in the formula"),
    label: z.string().describe("Human readable label for the input"),
    type: z.enum(['number', 'percent', 'boolean']).default('number'),
    unit: z.string().optional().describe("Unit of measurement (e.g. kg, m, s)"),
    defaultValue: z.number().optional(),
    min: z.number().optional(),
    max: z.number().optional(),
    step: z.number().optional(),
    description: z.string().optional(),
});

export const CalcOutputSchema = z.object({
    name: z.string().describe("The variable name of the result"),
    label: z.string().describe("Human readable label for the output"),
    unit: z.string().optional(),
    description: z.string().optional(),
});

export const CalcSpecSchema = z.object({
    id: z.string().optional(),
    title: z.string().describe("Title of the calculator"),
    description: z.string().describe("Short description of what it does"),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    inputs: z.array(CalcInputSchema),
    outputs: z.array(CalcOutputSchema),
    formulas: z.record(z.string(), z.string()).describe("Map of output names to mathematical expressions"),
    metadata: z.object({
        author: z.string().optional(),
        version: z.string().default('1.0.0'),
    }).optional(),
});

export type CalcInput = z.infer<typeof CalcInputSchema>;
export type CalcOutput = z.infer<typeof CalcOutputSchema>;
export type CalcSpec = z.infer<typeof CalcSpecSchema>;
