import { describe, expect, it } from 'vitest';
import getActiveCoin from './getActiveCoin';

describe('getActiveCoin', () => {
    it('should get mainnet if network is not provided', () => {
        expect(getActiveCoin()).toBe('ARK');
    });
});
