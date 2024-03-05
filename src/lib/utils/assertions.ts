import { AssertionError } from 'assert';
import { Networks } from '@ardenthq/sdk';
import { Contracts, Wallet } from '@ardenthq/sdk-profiles';

export function assertWallet(wallet?: Contracts.IReadWriteWallet): asserts wallet is Wallet {
    if (!(wallet instanceof Wallet)) {
        throw new AssertionError({
            message: `Expected 'wallet' to be Contracts.IReadWriteWallet, but received ${wallet}`,
        });
    }
}

export function assertNetwork(network?: Networks.Network): asserts network is Networks.Network {
    if (typeof network?.isLive !== 'function') {
        throw new AssertionError({
            message: `Expected 'network' to be Networks.Network, but received ${network}`,
        });
    }
    return undefined;
}
