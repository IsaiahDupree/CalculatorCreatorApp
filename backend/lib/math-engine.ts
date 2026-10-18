import { evaluate } from 'mathjs';
import { CalcSpec } from './calc-spec';

export function evaluateFormula(formula: string, scope: Record<string, number>): number {
    try {
        return evaluate(formula, scope);
    } catch (error) {
        throw new Error(`Failed to evaluate formula: ${formula}`);
    }
}

export function executeCalculator(spec: CalcSpec, inputs: Record<string, number>): Record<string, number> {
    const results: Record<string, number> = {};
    const scope = { ...inputs };

    // Iterate over outputs to find their corresponding formulas
    for (const output of spec.outputs) {
        const formula = spec.formulas[output.name];
        if (formula) {
            try {
                const result = evaluateFormula(formula, scope);
                results[output.name] = result;
                // Add result to scope so subsequent formulas can use it (if we order them correctly)
                scope[output.name] = result;
            } catch (error) {
                console.error(`Error evaluating formula for ${output.name}:`, error);
                results[output.name] = NaN;
            }
        }
    }

    return results;
}
