import { describe, expect, it } from 'vitest';
import { formatUnixTimestamp } from './formatUnixTimestsamp';

describe('formatUnixTimestsamp', () => {
    it('should correctly format a Unix timestamp at the start of an epoch', () => {
        const timestamp = 0;
        const result = formatUnixTimestamp(timestamp);
        expect(result).toBe('01 Jan 1970, 00:00:00');
    });

    it('should correctly format a Unix timestamp at a specific date', () => {
        const timestamp = 1672444800;
        const result = formatUnixTimestamp(timestamp);
        expect(result).toBe('31 Dec 2022, 00:00:00');
    });
});