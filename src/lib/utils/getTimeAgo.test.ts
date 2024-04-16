import { describe, expect, it } from 'vitest';
import { getTimeAgo } from './getTimeAgo';

describe('getTimeAgo', () => {
    it('returns "a few seconds ago" for current time', () => {
        expect(getTimeAgo(Date.now())).toBe('a few seconds ago');
    });

    it('returns "a minute ago" for 1 minute ago', () => {
        expect(getTimeAgo(Date.now() - 60 * 1000)).toBe('a minute ago');
    });

    it('returns "7 days ago" for 1 week', () => {
        expect(getTimeAgo(Date.now() - 7 * 24 * 60 * 60 * 1000)).toBe('7 days ago');
    });
});
