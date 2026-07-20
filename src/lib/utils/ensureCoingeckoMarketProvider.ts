import { Contracts } from '@ardenthq/sdk-profiles';

/**
 * CryptoCompare no longer offers a free tier. Existing profiles still store
 * MARKET_PROVIDER=cryptocompare from older defaults; switch them to CoinGecko
 * so exchange-rate sync keeps working without user action.
 *
 * @returns true when the setting was migrated
 */
export const ensureCoingeckoMarketProvider = (profile: Contracts.IProfile): boolean => {
    const provider = profile.settings().get(Contracts.ProfileSetting.MarketProvider);

    if (provider === 'cryptocompare') {
        profile.settings().set(Contracts.ProfileSetting.MarketProvider, 'coingecko');
        return true;
    }

    return false;
};
