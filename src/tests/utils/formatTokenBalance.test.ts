import { describe, expect, it } from 'vitest';
import { formatTokenBalance } from '@/lib/utils/formatTokenBalance';
import { BigNumber } from '@/lib/helpers';

describe('formatTokenBalance', () => {
    it('formats small whole numbers without a suffix', () => {
        expect(formatTokenBalance(BigNumber.make(100))).toBe('100');
    });

    it('adds locale-aware thousand separators', () => {
        expect(formatTokenBalance(BigNumber.make(1234567))).toBe('1,234,567');
    });

    it('keeps up to 8 fraction digits for non-compacted values', () => {
        expect(formatTokenBalance(BigNumber.make('123.456789'))).toBe('123.456789');
    });

    it('compacts millions with M suffix', () => {
        expect(formatTokenBalance(BigNumber.make(15_000_000))).toBe('15M');
    });

    it('compacts billions with B suffix', () => {
        expect(formatTokenBalance(BigNumber.make('2500000000'))).toBe('2.5B');
    });

    it('compacts trillions with T suffix', () => {
        expect(formatTokenBalance(BigNumber.make('1500000000000'))).toBe('1.5T');
    });

    it('compacts very large numbers with the appropriate suffix', () => {
        expect(formatTokenBalance(BigNumber.make('1500000000000000000000000'))).toBe('1.5Sp');
    });

    it('compacts very large numbers with an Octodecillion suffix', () => {
        const raw = '115792089237316195423570985008687907853269984665640564039457';
        expect(formatTokenBalance(BigNumber.make(raw))).toBe('115.79Ocd');
    });

    it('formats zero', () => {
        expect(formatTokenBalance(BigNumber.make(0))).toBe('0');
    });

    it('respects the provided locale', () => {
        expect(formatTokenBalance(BigNumber.make(1234567), 'de-DE')).toBe('1.234.567');
    });
});
