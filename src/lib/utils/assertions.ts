import { AssertionError } from 'assert';
import { Contracts, Wallet } from '@/lib/profiles';
import { Network } from '@/lib/mainsail/network';

export function assertWallet(wallet?: Contracts.IReadWriteWallet): asserts wallet is Wallet {
    if (!(wallet instanceof Wallet)) {
        throw new AssertionError({
            message: `Expected 'wallet' to be Contracts.IReadWriteWallet, but received ${wallet}`,
        });
    }
}

export function assertNetwork(network?: Network): asserts network is Network {
    if (typeof network?.isLive !== 'function') {
        throw new AssertionError({
            message: `Expected 'network' to be Networks.Network, but received ${network}`,
        });
    }
    return undefined;
}
