/**
 * @jest-environment node
 */
import { POST } from '../app/api/run/route';
import { NextRequest } from 'next/server';

describe('API Integration Tests', () => {
    describe('POST /api/run', () => {
        it('calculates results correctly', async () => {
            const body = {
                spec: {
                    title: 'Test Calc',
                    description: 'A test calculator',
                    inputs: [{ name: 'a', label: 'A', type: 'number' }, { name: 'b', label: 'B', type: 'number' }],
                    outputs: [{ name: 'sum', label: 'Sum' }],
                    formulas: { sum: 'a + b' }
                },
                inputs: { a: 5, b: 10 }
            };

            const req = new NextRequest('http://localhost:3000/api/run', {
                method: 'POST',
                body: JSON.stringify(body)
            });

            const res = await POST(req);
            const data = await res.json();

            expect(res.status).toBe(200);
            expect(data).toEqual({ outputs: { sum: 15 } });
        });

        it('returns 400 for invalid inputs', async () => {
            const body = {
                spec: {
                    title: 'Test Calc',
                    description: 'A test calculator',
                    inputs: [{ name: 'a', label: 'A', type: 'number' }],
                    outputs: [{ name: 'res', label: 'Res' }],
                    formulas: { res: 'a * 2' }
                },
                inputs: { a: 'invalid' } // Invalid input type
            };

            const req = new NextRequest('http://localhost:3000/api/run', {
                method: 'POST',
                body: JSON.stringify(body)
            });

            const res = await POST(req);
            expect(res.status).toBe(400);
        });
    });
});
