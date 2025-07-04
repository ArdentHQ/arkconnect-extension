import { describe, expect, it } from 'vitest';
import trimAddress from './trimAddress';

describe('trimAddress', () => {
    it('uses 13 characters with short trim', async () => {
        expect(trimAddress('1', 'short')).toBe('1');
        expect(trimAddress('12345678', 'short')).toBe('12345678');
        expect(trimAddress('123456789123456', 'short')).toBe('123456…123456');
    });

    it('uses 24 characters with long trim', async () => {
        expect(trimAddress('1', 'long')).toBe('1');
        expect(trimAddress('1234567890123456', 'long')).toBe('1234567890123456');
        expect(trimAddress('1234567890123456789123456789', 'long')).toBe(
            '123456789012…789123456789',
        );
    });

    it('uses 34 characters with longest trim', async () => {
        expect(trimAddress('1', 'longest')).toBe('1');
        expect(trimAddress('123456789012345678912345', 'longest')).toBe('123456789012345678912345');
        expect(trimAddress('123456789012345678912345689123456789', 'longest')).toBe(
            '12345678901234567…12345689123456789',
        );
    });

    it('accepts a custom length', async () => {
        expect(trimAddress('abcdefghi', 3)).toBe('a…i');
    });
});
