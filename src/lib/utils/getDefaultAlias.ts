import { Network } from '@/lib/mainsail/networks';
import { Contracts } from '@/lib/profiles';

interface GetDefaultAliasInput {
    profile: Contracts.IProfile;
    network: Network;
}

interface AliasInput {
    profile: Contracts.IProfile;
    counter: number;
}

interface LedgerAliasInput {
    profile: Contracts.IProfile;
    network: Network;
    path: string;
}

export const getDefaultAlias = ({ profile }: GetDefaultAliasInput): string => {
    const wallets = profile
        .wallets()
        .values()
        .filter((wallet) => !wallet.isLedger());

    const counter = wallets.length;

    return generateAlias({ profile, counter });
};

const makeLedgerAlias = (count: number | string) => `Ledger #${count}`;

const findByAlias = (alias: string, wallets: Contracts.IReadWriteWallet[]) =>
    wallets.find((wallet) => wallet.alias() === alias);

export const getLedgerAlias = ({ profile, path }: LedgerAliasInput): string => {
    const pathCounter = path.slice(-1) ?? 0;
    let counter = Number(pathCounter) + 1;

    const wallets = profile
        .wallets()
        .values()
        .filter((wallet) => wallet.isLedger());

    while (findByAlias(makeLedgerAlias(counter), wallets)) {
        counter++;
    }

    return makeLedgerAlias(counter);
};

const generateAlias = ({ profile, counter }: AliasInput): string => {
    const makeAlias = (count: number) => `Address #${count}`;

    if (counter === 0) {
        counter = 1;
    }

    while (profile.wallets().findByAlias(makeAlias(counter))) {
        counter++;
    }

    return makeAlias(counter);
};
