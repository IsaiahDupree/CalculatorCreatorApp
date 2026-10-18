import { create, all, type MathJsStatic } from 'mathjs';
import type { TCalculatorSpec, TConstraint } from '@calc/spec';

// Create mathjs instance with all functions
const math = create(all, {}) as MathJsStatic;

export type EvalResult = {
  outputs: Record<string, number | string>;
  warnings: string[];
  errors: string[];
  duration?: number;
};

/**
 * Convert inputs to mathjs scope with units
 */
function toScopeFromInputs(
  spec: TCalculatorSpec,
  inputs: Record<string, any>
): Record<string, any> {
  const scope: Record<string, any> = {};

  for (const inp of spec.inputs) {
    const value = inputs[inp.id];
    if (value === undefined || value === null) {
      continue;
    }

    // If unit is specified, create a mathjs unit
    if (inp.unit) {
      try {
        scope[inp.id] = math.unit(value, inp.unit);
      } catch (e) {
        // Fallback to plain number if unit parsing fails
        scope[inp.id] = value;
      }
    } else {
      scope[inp.id] = value;
    }
  }

  return scope;
}

/**
 * Check domain constraints
 */
function checkDomainConstraints(
  spec: TCalculatorSpec,
  inputs: Record<string, any>,
  scope: Record<string, any>
): string[] {
  const errors: string[] = [];

  for (const constraint of spec.constraints) {
    if (constraint.type === 'domain' && constraint.rule) {
      try {
        // Evaluate the constraint rule
        const result = math.evaluate(constraint.rule, scope);
        if (!result) {
          errors.push(
            constraint.message || `Constraint violated: ${constraint.rule}`
          );
        }
      } catch (e) {
        // If evaluation fails, skip this constraint
        console.warn(`Failed to evaluate constraint: ${constraint.rule}`, e);
      }
    }
  }

  return errors;
}

/**
 * Evaluate a calculator spec with given inputs
 */
export function evaluateSpec(
  spec: TCalculatorSpec,
  inputs: Record<string, any>
): EvalResult {
  const startTime = performance.now();
  const warnings: string[] = [];
  const errors: string[] = [];

  // Validate required inputs
  for (const inp of spec.inputs) {
    if (inp.required && (inputs[inp.id] === undefined || inputs[inp.id] === null)) {
      errors.push(`Required input '${inp.label}' (${inp.id}) is missing`);
    }
  }

  if (errors.length > 0) {
    return { outputs: {}, warnings, errors };
  }

  // Convert inputs to scope
  const scope = toScopeFromInputs(spec, inputs);

  // Check domain constraints before evaluation
  const constraintErrors = checkDomainConstraints(spec, inputs, scope);
  errors.push(...constraintErrors);

  if (errors.length > 0) {
    return { outputs: {}, warnings, errors };
  }

  // Evaluate equations
  const outputs: Record<string, any> = {};
  const computedVars: Record<string, any> = {};

  for (const eq of spec.equations) {
    try {
      // Parse equation: "I = V / R" -> left = "I", right = "V / R"
      const [left, right] = eq.expr.split('=').map((s) => s.trim());

      if (!left || !right) {
        errors.push(`Invalid equation format: ${eq.expr}`);
        continue;
      }

      // Evaluate right-hand side
      const value = math.evaluate(right, { ...scope, ...computedVars });

      // Store in computed vars for subsequent equations
      computedVars[left] = value;

      // If this is an output variable, add to outputs
      const outputSpec = spec.outputs.find((out) => out.id === left);
      if (outputSpec) {
        // Convert to number if it's a unit
        let numValue: number;
        if (math.isUnit(value)) {
          numValue = value.toNumber();
        } else if (typeof value === 'number') {
          numValue = value;
        } else {
          numValue = parseFloat(String(value));
        }

        // Apply precision
        const precision = outputSpec.precision || 6;
        outputs[left] = parseFloat(numValue.toPrecision(precision));
      }
    } catch (e: any) {
      errors.push(`Failed to evaluate equation '${eq.expr}': ${e.message}`);
    }
  }

  // Check if all outputs were computed
  for (const out of spec.outputs) {
    if (outputs[out.id] === undefined) {
      warnings.push(`Output '${out.label}' (${out.id}) was not computed`);
    }
  }

  const duration = performance.now() - startTime;

  return {
    outputs,
    warnings,
    errors,
    duration,
  };
}

/**
 * Validate example inputs/outputs
 */
export function validateExample(
  spec: TCalculatorSpec,
  example: { inputs: Record<string, any>; outputs: Record<string, any> }
): { valid: boolean; errors: string[]; actualOutputs?: Record<string, number> } {
  const result = evaluateSpec(spec, example.inputs);

  if (result.errors.length > 0) {
    return {
      valid: false,
      errors: result.errors,
    };
  }

  // Check if outputs match (within tolerance)
  const tolerance = 1e-6;
  const errors: string[] = [];

  for (const [key, expected] of Object.entries(example.outputs)) {
    const actual = result.outputs[key];
    if (actual === undefined) {
      errors.push(`Output '${key}' not computed`);
      continue;
    }

    const expectedNum = typeof expected === 'number' ? expected : parseFloat(String(expected));
    const actualNum = typeof actual === 'number' ? actual : parseFloat(String(actual));

    if (Math.abs(actualNum - expectedNum) > tolerance) {
      errors.push(
        `Output '${key}': expected ${expectedNum}, got ${actualNum} (diff: ${Math.abs(actualNum - expectedNum)})`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    actualOutputs: result.outputs as Record<string, number>,
  };
}




