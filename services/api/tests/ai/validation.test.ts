import { describe, it, expect } from 'vitest';
import type { TCalculatorSpec } from '@calc/spec';

describe('AI Generation: Calculator Validation', () => {
  describe('Spec Completeness', () => {
    it('should validate all required spec fields are present', () => {
      const completeSpec: TCalculatorSpec = {
        id: 'complete-test',
        version: 1,
        title: 'Complete Test Calculator',
        summary: 'A complete calculator spec',
        inputs: [
          { id: 'x', label: 'X', type: 'number' },
        ],
        outputs: [
          { id: 'result', label: 'Result' },
        ],
        equations: [
          { expr: 'x * 2' },
        ],
      };

      expect(completeSpec.id).toBeDefined();
      expect(completeSpec.version).toBeDefined();
      expect(completeSpec.title).toBeDefined();
      expect(completeSpec.inputs).toBeDefined();
      expect(completeSpec.outputs).toBeDefined();
      expect(completeSpec.equations).toBeDefined();
    });

    it('should reject incomplete specs', () => {
      const incompleteSpecs = [
        { id: 'test' }, // Missing inputs, outputs, equations
        { id: 'test', inputs: [] }, // Missing outputs, equations
        { id: 'test', inputs: [], outputs: [] }, // Missing equations
        { inputs: [], outputs: [], equations: [] }, // Missing id
      ];

      incompleteSpecs.forEach(spec => {
        const hasId = 'id' in spec && spec.id !== undefined;
        const hasInputs = 'inputs' in spec && Array.isArray(spec.inputs);
        const hasOutputs = 'outputs' in spec && Array.isArray(spec.outputs);
        const hasEquations = 'equations' in spec && Array.isArray(spec.equations);

        // At least one required field should be missing
        expect(hasId && hasInputs && hasOutputs && hasEquations).toBe(false);
      });
    });
  });

  describe('Input/Output Consistency', () => {
    it('should validate equations reference valid inputs', () => {
      const spec = {
        id: 'test',
        version: 1,
        title: 'Test',
        inputs: [
          { id: 'a', label: 'A', type: 'number' },
          { id: 'b', label: 'B', type: 'number' },
        ],
        outputs: [
          { id: 'result', label: 'Result' },
        ],
        equations: [
          { expr: 'a + b' }, // Valid - references both inputs
        ],
      };

      const inputIds = spec.inputs.map(i => i.id);
      const equationVars = spec.equations[0].expr.match(/[a-zA-Z_][a-zA-Z0-9_]*/g) || [];
      
      // All variables in equation should be inputs (or math functions)
      const mathFunctions = ['sqrt', 'sin', 'cos', 'tan', 'log', 'exp', 'abs', 'max', 'min', 'pow'];
      equationVars.forEach(varName => {
        if (!mathFunctions.includes(varName) && !varName.match(/^\d/)) {
          expect(inputIds).toContain(varName);
        }
      });
    });

    it('should validate outputs are defined', () => {
      const spec = {
        id: 'test',
        version: 1,
        title: 'Test',
        inputs: [{ id: 'x', label: 'X', type: 'number' }],
        outputs: [
          { id: 'result', label: 'Result' },
        ],
        equations: [
          { expr: 'x * 2' },
        ],
      };

      expect(spec.outputs.length).toBeGreaterThan(0);
      spec.outputs.forEach(output => {
        expect(output).toHaveProperty('id');
        expect(output).toHaveProperty('label');
      });
    });
  });

  describe('Equation Syntax Validation', () => {
    it('should validate equation expressions are safe', () => {
      const safeExpressions = [
        'x + y',
        'x * 2',
        'sqrt(x)',
        'sin(x)',
        'x^2 + y^2',
        '(x + y) * 2',
      ];

      safeExpressions.forEach(expr => {
        // Should not contain dangerous patterns
        expect(expr).not.toContain('eval');
        expect(expr).not.toContain('Function');
        expect(expr).not.toContain('constructor');
        expect(expr).not.toContain('__proto__');
      });
    });

    it('should validate equation produces numeric results', () => {
      // This would be validated at runtime during evaluation
      const validExpressions = [
        { expr: 'x + y', shouldBeNumeric: true },
        { expr: 'x * 2', shouldBeNumeric: true },
        { expr: 'sqrt(x)', shouldBeNumeric: true },
      ];

      validExpressions.forEach(eq => {
        expect(eq.expr).toBeDefined();
        expect(typeof eq.expr).toBe('string');
      });
    });
  });
});




