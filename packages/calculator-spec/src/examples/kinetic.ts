import type { TCalculatorSpec } from '../spec';

export const KINETIC_SPEC: TCalculatorSpec = {
  id: 'kinetic-energy-ke',
  version: 1,
  title: 'Kinetic Energy',
  summary: 'Compute kinetic energy from mass and velocity using KE = 0.5 × m × v²',
  tags: ['physics', 'energy', 'si', 'mechanics'],
  category: 'Physics',
  units_system: 'SI',
  inputs: [
    {
      id: 'm',
      label: 'Mass',
      type: 'number',
      unit: 'kg',
      min: 0,
      max: 1e6,
      step: 0.001,
      default: 1,
      description: 'Mass in kilograms (kg)',
      required: true,
    },
    {
      id: 'v',
      label: 'Velocity',
      type: 'number',
      unit: 'm/s',
      min: 0,
      max: 3e8,
      step: 0.001,
      default: 10,
      description: 'Velocity in meters per second (m/s)',
      required: true,
    },
  ],
  outputs: [
    {
      id: 'KE',
      label: 'Kinetic Energy',
      unit: 'J',
      precision: 6,
      format: 'number',
      description: 'Kinetic energy in joules (J)',
    },
  ],
  equations: [
    {
      expr: 'KE = 0.5 * m * v^2',
      description: 'Kinetic energy equals half the mass times velocity squared',
    },
  ],
  examples: [
    {
      inputs: { m: 1, v: 10 },
      outputs: { KE: 50 },
      description: '1 kg object at 10 m/s has 50 J of kinetic energy',
    },
    {
      inputs: { m: 2, v: 5 },
      outputs: { KE: 25 },
      description: '2 kg object at 5 m/s has 25 J of kinetic energy',
    },
  ],
  constraints: [
    {
      type: 'domain',
      rule: 'm >= 0',
      message: 'Mass must be non-negative',
    },
    {
      type: 'domain',
      rule: 'v >= 0',
      message: 'Velocity must be non-negative',
    },
  ],
  ui: {
    layout: ['m', 'v', 'KE'],
    help: 'Enter mass (kg) and velocity (m/s) to compute kinetic energy (J). Units are SI.',
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




