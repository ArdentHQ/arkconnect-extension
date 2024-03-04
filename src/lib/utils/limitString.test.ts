import { describe, expect, it } from 'vitest';
import limitString from './limitString';

describe('limitString', () => {
    it('limits a string to the specified length and appends an ellipsis', () => {
        const longString = 'This is a very long string that needs to be truncated.';
        expect(limitString(longString, 10)).toBe('This is a ...');
    });

    it('returns the string unchanged if it is within the limit', () => {
        const shortString = 'Short';
        expect(limitString(shortString, 10)).toBe(shortString);
    });

    it('handles edge case where limit is the string length', () => {
        const string = 'Exactly 10';
        expect(limitString(string, 10)).toBe(string);
    });

    it('handles empty string', () => {
        expect(limitString('', 10)).toBe('');
    });
});
