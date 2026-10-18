import { evaluateFormula } from '../lib/math-engine';

describe('Math Engine', () => {
    const inputs = {
        a: 10,
        b: 5,
        c: 2,
        zero: 0,
        negative: -5,
    };

    test('evaluates simple arithmetic', () => {
        expect(evaluateFormula('a + b', inputs)).toBe(15);
        expect(evaluateFormula('a - b', inputs)).toBe(5);
        expect(evaluateFormula('a * b', inputs)).toBe(50);
        expect(evaluateFormula('a / b', inputs)).toBe(2);
    });

    test('evaluates complex expressions', () => {
        expect(evaluateFormula('a + b * c', inputs)).toBe(20);
        expect(evaluateFormula('(a + b) * c', inputs)).toBe(30);
        expect(evaluateFormula('pow(c, 3)', inputs)).toBe(8);
        expect(evaluateFormula('sqrt(a * 10)', inputs)).toBe(10);
    });

    test('handles negative numbers', () => {
        expect(evaluateFormula('abs(negative)', inputs)).toBe(5);
        expect(evaluateFormula('negative * 2', inputs)).toBe(-10);
    });

    test('handles division by zero', () => {
        expect(evaluateFormula('a / zero', inputs)).toBe(Infinity);
    });

    test('throws error for undefined variables', () => {
        expect(() => evaluateFormula('a + x', inputs)).toThrow();
    });

    test('prevents unsafe code execution', () => {
        // mathjs should not allow arbitrary JS execution by default, 
        // but we verify it doesn't have access to global objects like process or console
        expect(() => evaluateFormula('import("fs")', inputs)).toThrow();
        expect(() => evaluateFormula('console.log("test")', inputs)).toThrow();
    });
});
