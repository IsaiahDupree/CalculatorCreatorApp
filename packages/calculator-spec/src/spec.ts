import { z } from 'zod';

// Input types
export const InputType = z.enum(['number', 'select', 'boolean', 'text']);

// Input specification
export const InputSpec = z.object({
  id: z.string(),
  label: z.string(),
  type: InputType,
  unit: z.string().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
  options: z
    .array(
      z.object({
        label: z.string(),
        value: z.union([z.string(), z.number(), z.boolean()]),
      })
    )
    .optional(),
  default: z.union([z.string(), z.number(), z.boolean()]).optional(),
  description: z.string().optional(),
  required: z.boolean().default(true),
});

// Output specification
export const OutputSpec = z.object({
  id: z.string(),
  label: z.string(),
  unit: z.string().optional(),
  precision: z.number().optional().default(6),
  format: z.enum(['number', 'currency', 'percentage', 'scientific']).optional(),
  description: z.string().optional(),
});

// Equation
export const Equation = z.object({
  expr: z.string(), // e.g., "I = V / R"
  description: z.string().optional(),
});

// Constraint types
export const ConstraintType = z.enum([
  'dimensional_balance',
  'domain',
  'range',
  'custom',
]);

export const Constraint = z.object({
  type: ConstraintType,
  equation: z.string().optional(),
  rule: z.string().optional(), // e.g., "R > 0"
  message: z.string().optional(),
});

// Example
export const Example = z.object({
  inputs: z.record(z.union([z.string(), z.number(), z.boolean()])),
  outputs: z.record(z.union([z.string(), z.number()])),
  description: z.string().optional(),
});

// UI configuration
export const UIConfig = z.object({
  layout: z.array(z.string()).optional(), // Order of input/output IDs
  help: z.string().optional(),
  theme: z.enum(['light', 'dark', 'auto']).optional(),
});

// Attribution
export const Attribution = z.object({
  creator_user_id: z.string(),
  license: z.string().default('CC-BY-4.0'),
  credits: z.string().optional(),
});

// Review status
export const ReviewStatus = z.enum(['pending', 'approved', 'rejected']);

export const Review = z.object({
  status: ReviewStatus,
  checks: z.array(z.string()).default([]),
  notes: z.string().optional(),
  reviewer_id: z.string().optional(),
  reviewed_at: z.string().optional(),
});

// Main CalculatorSpec schema
export const CalculatorSpec = z.object({
  id: z.string(),
  version: z.number().int().default(1),
  title: z.string(),
  summary: z.string().default(''),
  tags: z.array(z.string()).default([]),
  category: z.string().optional(),
  units_system: z.enum(['SI', 'Imperial', 'Custom']).default('SI'),
  inputs: z.array(InputSpec).min(1),
  outputs: z.array(OutputSpec).min(1),
  equations: z.array(Equation).min(1),
  examples: z.array(Example).default([]),
  constraints: z.array(Constraint).default([]),
  ui: UIConfig.optional(),
  attribution: Attribution,
  review: Review.optional(),
});

// Type exports
export type TInputType = z.infer<typeof InputType>;
export type TInputSpec = z.infer<typeof InputSpec>;
export type TOutputSpec = z.infer<typeof OutputSpec>;
export type TEquation = z.infer<typeof Equation>;
export type TConstraint = z.infer<typeof Constraint>;
export type TExample = z.infer<typeof Example>;
export type TUIConfig = z.infer<typeof UIConfig>;
export type TAttribution = z.infer<typeof Attribution>;
export type TReview = z.infer<typeof Review>;
export type TCalculatorSpec = z.infer<typeof CalculatorSpec>;

// JSON Schema converter (for RJSF and AI agents)
export function toJsonSchema(spec: TCalculatorSpec) {
  const properties: Record<string, any> = {};
  const required: string[] = [];

  for (const input of spec.inputs) {
    const prop: any = {
      title: input.label,
      description: input.description,
    };

    switch (input.type) {
      case 'number':
        prop.type = 'number';
        if (input.min !== undefined) prop.minimum = input.min;
        if (input.max !== undefined) prop.maximum = input.max;
        if (input.step !== undefined) prop.multipleOf = input.step;
        if (input.unit) prop.unit = input.unit;
        break;
      case 'boolean':
        prop.type = 'boolean';
        break;
      case 'select':
        prop.type = 'string';
        prop.enum = input.options?.map((opt) => opt.value);
        prop.enumNames = input.options?.map((opt) => opt.label);
        break;
      case 'text':
        prop.type = 'string';
        break;
    }

    if (input.default !== undefined) {
      prop.default = input.default;
    }

    properties[input.id] = prop;

    if (input.required) {
      required.push(input.id);
    }
  }

  return {
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: spec.title,
    description: spec.summary,
    type: 'object',
    properties,
    required,
  };
}




