import { describe, expect, it, vi } from 'vitest';
import { Contracts } from '@ardenthq/sdk-profiles';
import { ensureCoingeckoMarketProvider } from './ensureCoingeckoMarketProvider';

const makeProfile = (provider: string) => {
    const set = vi.fn();
    const get = vi.fn().mockReturnValue(provider);

    return {
        profile: {
            settings: () => ({ get, set }),
        } as unknown as Contracts.IProfile,
        set,
        get,
    };
};

describe('ensureCoingeckoMarketProvider', () => {
    it('migrates cryptocompare profiles to coingecko', () => {
        const { profile, set } = makeProfile('cryptocompare');

        expect(ensureCoingeckoMarketProvider(profile)).toBe(true);
        expect(set).toHaveBeenCalledWith(Contracts.ProfileSetting.MarketProvider, 'coingecko');
    });

    it('leaves coingecko profiles unchanged', () => {
        const { profile, set } = makeProfile('coingecko');

        expect(ensureCoingeckoMarketProvider(profile)).toBe(false);
        expect(set).not.toHaveBeenCalled();
    });
});
