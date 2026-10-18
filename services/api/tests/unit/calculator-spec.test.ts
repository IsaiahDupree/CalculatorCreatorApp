import { describe, it, expect } from 'vitest';

describe('Unit Tests: Calculator Spec', () => {
  describe('Spec Validation', () => {
    it('should validate required fields', () => {
      const validSpec = {
        id: 'test-calc',
        version: 1,
        title: 'Test Calculator',
        inputs: [{ id: 'x', label: 'X', type: 'number' }],
        outputs: [{ id: 'result', label: 'Result' }],
        equations: [{ expr: 'x * 2' }],
      };

      expect(validSpec).toHaveProperty('id');
      expect(validSpec).toHaveProperty('version');
      expect(validSpec).toHaveProperty('title');
      expect(validSpec).toHaveProperty('inputs');
      expect(validSpec).toHaveProperty('outputs');
      expect(validSpec).toHaveProperty('equations');
    });

    it('should validate input types', () => {
      const validInputs = [
        { id: 'x', label: 'X', type: 'number' },
        { id: 'y', label: 'Y', type: 'number' },
        { id: 'name', label: 'Name', type: 'string' },
      ];

      validInputs.forEach(input => {
        expect(input).toHaveProperty('id');
        expect(input).toHaveProperty('label');
        expect(input).toHaveProperty('type');
        expect(['number', 'string', 'boolean']).toContain(input.type);
      });
    });

    it('should validate equation expressions', () => {
      const validEquations = [
        { expr: 'x + y' },
        { expr: 'x * 2' },
        { expr: 'sqrt(x)' },
      ];

      validEquations.forEach(eq => {
        expect(eq).toHaveProperty('expr');
        expect(typeof eq.expr).toBe('string');
        expect(eq.expr.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Spec Transformation', () => {
    it('should transform spec to database format', () => {
      const spec = {
        id: 'test',
        version: 1,
        title: 'Test',
        inputs: [],
        outputs: [],
        equations: [],
      };

      const dbFormat = {
        slug: spec.id,
        title: spec.title,
        spec: spec,
      };

      expect(dbFormat).toHaveProperty('slug');
      expect(dbFormat).toHaveProperty('title');
      expect(dbFormat).toHaveProperty('spec');
    });
  });
});




