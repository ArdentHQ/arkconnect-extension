import { describe, expect, it, vi } from 'vitest';
import formatCurrency from './formatCurrency';

describe('formatCurrency', () => {
    it('should format usd currency', () => {
        expect(formatCurrency(10, 'USD')).toBe('$10.00');
    });

    it('should default to en-US if navigator languages are not available', () => {
        vi.spyOn(window.navigator, 'language', 'get').mockReturnValue(undefined);
        vi.spyOn(window.navigator, 'languages', 'get').mockReturnValue(undefined);
        expect(formatCurrency(10, 'USD')).toBe('$10.00');
    });
});
