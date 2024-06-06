import { describe, expect, it } from 'vitest';
import trimAddress from './trimAddress';

describe('trimAddress', () => {
    it('uses 8 characters with short trim', async () => {
        expect(trimAddress('1', 'short')).toBe('1');
        expect(trimAddress('12345678', 'short')).toBe('12345678');
        expect(trimAddress('123456789', 'short')).toBe('1234…6789');
    });

    it('uses 16 characters with long trim', async () => {
        expect(trimAddress('1', 'long')).toBe('1');
        expect(trimAddress('1234567890123456', 'long')).toBe('1234567890123456');
        expect(trimAddress('12345678901234567', 'long')).toBe('12345678…01234567');
    });

    it('uses 24 characters with longest trim', async () => {
        expect(trimAddress('1', 'longest')).toBe('1');
        expect(trimAddress('123456789012345678912345', 'longest')).toBe('123456789012345678912345');
        expect(trimAddress('1234567890123456789123456', 'longest')).toBe(
            '123456789012…456789123456',
        );
    });

    it('accepts a custom length', async () => {
        expect(trimAddress('abcdefghi', 3)).toBe('a…i');
    });

    it('trims from the middle by default', async () => {
        expect(trimAddress('1234567890123456789123456', 'longest')).toBe(
            '123456789012…456789123456',
        );
    });

    it('trims from the end when specified', async () => {
        expect(trimAddress('1234567890123456789123456', 'long', 'end')).toBe('123456789012345…');
    });
});
