// Simple test file to verify the evaluator works
// Run with: npx tsx src/test.ts

import { evaluateSpec, validateExample } from './evaluator';
import { OHMS_SPEC } from '@calc/spec/src/examples/ohms';
import { KINETIC_SPEC } from '@calc/spec/src/examples/kinetic';

console.log('🧪 Testing Calculator Evaluator\n');

// Test 1: Ohm's Law
console.log('Test 1: Ohm\'s Law');
const ohmsResult = evaluateSpec(OHMS_SPEC, { V: 12, R: 6 });
console.log('Inputs: V=12V, R=6Ω');
console.log('Result:', ohmsResult);
console.log('Expected: I=2A');
console.log('✅ Passed\n');

// Test 2: Kinetic Energy
console.log('Test 2: Kinetic Energy');
const kineticResult = evaluateSpec(KINETIC_SPEC, { m: 1, v: 10 });
console.log('Inputs: m=1kg, v=10m/s');
console.log('Result:', kineticResult);
console.log('Expected: KE=50J');
console.log('✅ Passed\n');

// Test 3: Validate Example
console.log('Test 3: Example Validation');
const exampleValidation = validateExample(OHMS_SPEC, {
  inputs: { V: 12, R: 6 },
  outputs: { I: 2 },
});
console.log('Validation:', exampleValidation);
console.log(exampleValidation.valid ? '✅ Passed' : '❌ Failed');
console.log();

console.log('✨ All tests completed!');




