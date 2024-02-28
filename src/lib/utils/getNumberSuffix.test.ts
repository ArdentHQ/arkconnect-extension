import { it, describe, expect } from 'vitest';
import getNumberSuffix from './getNumberSuffix';

describe('getNumberSuffix', () => {
    it('returns "1st" for 1', () => {
        expect(getNumberSuffix(1)).toBe('1st');
    });

    it('returns "2nd" for 2', () => {
        expect(getNumberSuffix(2)).toBe('2nd');
    });

    it('returns "3rd" for 3', () => {
        expect(getNumberSuffix(3)).toBe('3rd');
    });

    it('returns "th" for numbers 4 to 20', () => {
        for (let i = 4; i <= 20; i++) {
            expect(getNumberSuffix(i)).toBe(`${i}th`);
        }
    });

    it('returns appropriate suffix for numbers greater than 20', () => {
        expect(getNumberSuffix(21)).toBe('21st');
        expect(getNumberSuffix(22)).toBe('22nd');
        expect(getNumberSuffix(23)).toBe('23rd');
        expect(getNumberSuffix(24)).toBe('24th');
    });

    it('returns "th" for numbers ending in 0, 4-9', () => {
        [10, 14, 19, 20, 25, 30].forEach((num) => {
            expect(getNumberSuffix(num)).toBe(`${num}th`);
        });
    });
});
