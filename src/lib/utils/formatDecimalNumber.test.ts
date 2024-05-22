import { describe, expect, it } from 'vitest';
import { formatDecimalNumber } from './formatDecimalNumber';

describe('formatDecimalNumber', () => {
    it('returns the same number for integers', () => {
        const result = formatDecimalNumber(5);
        expect(result).toBe(5);
    });
    it;
    it('rounds to 8 decimal places by default', () => {
        const result = formatDecimalNumber(1.23456789123);
        expect(result).toBe(1.23456789);
    });

    it('rounds to specified number of decimal places', () => {
        const result = formatDecimalNumber(1.23456789, 2);
        expect(result).toBe(1.23);
    });

    it('removes trailing zeros', () => {
        const result = formatDecimalNumber(1.23, 5);
        expect(result).toBe(1.23);
    });

    it('returns NaN for NaN', () => {
        const result = formatDecimalNumber(NaN);
        expect(isNaN(result)).toBe(true);
    });
});
