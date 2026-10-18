import type { TCalculatorSpec } from '../spec';

export const OHMS_SPEC: TCalculatorSpec = {
  id: 'ohms-law-i',
  version: 1,
  title: "Ohm's Law (Solve I)",
  summary: 'Compute current from voltage and resistance using Ohm's Law: I = V / R',
  tags: ['electronics', 'ohms-law', 'si', 'physics'],
  category: 'Electronics',
  units_system: 'SI',
  inputs: [
    {
      id: 'V',
      label: 'Voltage',
      type: 'number',
      unit: 'V',
      min: 0,
      max: 1e6,
      step: 0.01,
      default: 12,
      description: 'Voltage in volts (V)',
      required: true,
    },
    {
      id: 'R',
      label: 'Resistance',
      type: 'number',
      unit: 'Ω',
      min: 0.000001,
      max: 1e9,
      step: 0.01,
      default: 6,
      description: 'Resistance in ohms (Ω)',
      required: true,
    },
  ],
  outputs: [
    {
      id: 'I',
      label: 'Current',
      unit: 'A',
      precision: 6,
      format: 'number',
      description: 'Current in amperes (A)',
    },
  ],
  equations: [
    {
      expr: 'I = V / R',
      description: "Ohm's Law: Current equals voltage divided by resistance",
    },
  ],
  examples: [
    {
      inputs: { V: 12, R: 6 },
      outputs: { I: 2 },
      description: '12V across 6Ω resistor yields 2A current',
    },
    {
      inputs: { V: 5, R: 10 },
      outputs: { I: 0.5 },
      description: '5V across 10Ω resistor yields 0.5A current',
    },
  ],
  constraints: [
    {
      type: 'dimensional_balance',
      equation: 'I = V / R',
      message: 'Units must balance: A = V / Ω',
    },
    {
      type: 'domain',
      rule: 'R > 0',
      message: 'Resistance must be greater than zero',
    },
  ],
  ui: {
    layout: ['V', 'R', 'I'],
    help: 'Enter voltage (V) and resistance (Ω) to compute current (A). Units are SI.',
  },
  attribution: {
    creator_user_id: 'seed_user',
    license: 'CC-BY-4.0',
  },
  review: {
    status: 'approved',
    checks: ['dimensional_analysis', 'unit_consistency', 'example_verification'],
  },
};




