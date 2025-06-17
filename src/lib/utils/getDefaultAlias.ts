import { networkDisplayName } from './networkUtils';
import { Network } from '@/lib/mainsail/networks';
import { Contracts } from '@/lib/profiles';

interface GetDefaultAliasInput {
    profile: Contracts.IProfile;
    network: Network;
}

interface AliasInput {
    profile: Contracts.IProfile;
    network: Network;
    counter: number;
}

interface LedgerAliasInput {
    profile: Contracts.IProfile;
    network: Network;
    importCount: number;
    index: number;
}

export const getDefaultAlias = ({ profile, network }: GetDefaultAliasInput): string => {
    // TODO fix counter
    const counter = 5;

    return generateAlias({ profile, network, counter });
};

export const getLedgerAlias = ({
    profile,
    network,
    importCount,
    index,
}: LedgerAliasInput): string => {
    // const sameCoinWallets = profile.wallets().findByCoinWithNetwork(network.coin(), network.id());
    // TODO fix
    const sameCoinWallets = [];

    // The way ledgers are currently stored requires us to do
    // some magic to determine the right label. The profile
    // has them stored before their alias gets updated, meaning
    // we require to take the count (includes the new ledger
    // addresses) and subtract the amount of wallets we are
    // importing to counter this. The index (+ 1) is used to
    // manually increment the labels
    const counter = sameCoinWallets.length - importCount + index + 1;

    return generateAlias({ profile, network, counter });
};

const generateAlias = ({ profile, network, counter }: AliasInput): string => {
    const makeAlias = (count: number) => `${networkDisplayName(network)} #${count}`;

    if (counter === 0) {
        counter = 1;
    }

    while (profile.wallets().findByAlias(makeAlias(counter))) {
        counter++;
    }

    return makeAlias(counter);
};
