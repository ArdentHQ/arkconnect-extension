import { lt } from 'semver';
import { Coins } from '@ardenthq/sdk';
import { minVersionList } from '@/lib/Ledger/Ledger.contracts';

export const hasRequiredAppVersion = async (coin: Coins.Coin) => {
    const coinId = coin.network().coin();

    if (minVersionList[coinId]) {
        const currentVersion = await coin.ledger().getVersion();

        if (lt(currentVersion, minVersionList[coinId])) {
            return false;
        }
    }

    return true;
};
