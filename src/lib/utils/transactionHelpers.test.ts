import { describe, expect, it } from 'vitest';
import { buildTransferData } from './transactionHelpers';

describe('buildTransferData', () => {
    it('coerces amount to number for native transfers by default', async () => {
        const data = await buildTransferData({
            recipients: [{ address: '0xabc', amount: '1.5' }],
        });

        expect(data).toEqual({ amount: 1.5, to: '0xabc' });
        expect(typeof data.amount).toBe('number');
    });

    it('preserves amount as string when preserveAmountPrecision is true', async () => {
        const data = await buildTransferData({
            recipients: [{ address: '0xabc', amount: '0.000000000000000001' }],
            preserveAmountPrecision: true,
        });

        expect(data).toEqual({ amount: '0.000000000000000001', to: '0xabc' });
        expect(typeof data.amount).toBe('string');
    });

    it('falls back to "0" when amount is missing and preserveAmountPrecision is true', async () => {
        const data = await buildTransferData({
            recipients: [{ address: '0xabc' }],
            preserveAmountPrecision: true,
        });

        expect(data).toEqual({ amount: '0', to: '0xabc' });
    });

    it('falls back to 0 (number) when amount is missing and preserveAmountPrecision is false', async () => {
        const data = await buildTransferData({
            recipients: [{ address: '0xabc' }],
        });

        expect(data).toEqual({ amount: 0, to: '0xabc' });
    });

    it('builds multi-payment data and respects preserveAmountPrecision per recipient', async () => {
        const data = await buildTransferData({
            recipients: [
                { address: '0xabc', amount: '1.5' },
                { address: '0xdef', amount: '2.25' },
            ],
            preserveAmountPrecision: true,
        });

        expect(data).toEqual({
            payments: [
                { amount: '1.5', to: '0xabc' },
                { amount: '2.25', to: '0xdef' },
            ],
        });
    });

    it('returns an empty object when no recipients are provided', async () => {
        const data = await buildTransferData({});

        expect(data).toEqual({});
    });
});
