import { AssertionError } from 'assert';
import { Networks } from '@ardenthq/sdk';
import { Contracts, Profile, Wallet } from '@ardenthq/sdk-profiles';

export function assertProfile(profile?: Contracts.IProfile): asserts profile is Profile {
    if (!(profile instanceof Profile)) {
        throw new AssertionError({
            message: `Expected 'profile' to be Contracts.IProfile, but received ${profile}`,
        });
    }
}

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

export function assertString(value: unknown): asserts value is NonNullable<string> {
    if (typeof value !== 'string' || value.trim() === '') {
        throw new AssertionError({
            message: `Expected 'value' to be string, but received ${value}`,
        });
    }
}
