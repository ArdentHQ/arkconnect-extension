import { describe, expect, it } from 'vitest';
import { assertNetwork, assertWallet } from './assertions';

describe('assertions', () => {
    it('should throw if wallet is undefined', () => {
        expect(() => assertWallet()).toThrow(
            "Expected 'wallet' to be Contracts.IReadWriteWallet, but received undefined",
        );
    });

    it('should throw if network is undefined', () => {
        expect(() => assertNetwork()).toThrow(
            "Expected 'network' to be Networks.Network, but received undefined",
        );
    });

    it('should not throw if network has isLive method', () => {
        const network = { isLive: vi.fn() };
        expect(() => assertNetwork(network)).not.toThrow();
    });
});
