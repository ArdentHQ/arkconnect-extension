import { beforeEach, describe, expect, it } from 'vitest';
import { connectedTransport as ledgerTransportFactory } from '@/lib/Ledger/transport';
import { StubStorage } from '@/tests/mocks/StubStorage/StubStorage';
import { Contracts, Environment } from '@/lib/profiles';
import MainsailMainnet from '@/lib/mainsail/networks/mainsail.mainnet';

describe('NetworkRepository', () => {
    let env: Environment;
    let profile: Contracts.IProfile;

    beforeEach(async () => {
        env = new Environment({ storage: new StubStorage(), ledgerTransportFactory });
        profile = await env.profiles().create('test');
    });

    it('returns an empty map when no networks have been pushed', () => {
        expect(profile.networks().all()).toStrictEqual({});
    });

    it('pushes a network and retrieves it by id', () => {
        profile.networks().push(MainsailMainnet);

        const network = profile.networks().get('mainsail.mainnet');

        expect(network.id).toBe('mainsail.mainnet');
    });

    it('throws when getting an unknown network', () => {
        expect(() => profile.networks().get('unknown.network')).toThrow(
            'Failed to find hosts that match [unknown.network].',
        );
    });

    it('forgets a pushed network', () => {
        profile.networks().push(MainsailMainnet);
        profile.networks().forget('mainsail.mainnet');

        expect(() => profile.networks().get('mainsail.mainnet')).toThrow();
    });

    it('throws when forgetting an unknown network', () => {
        expect(() => profile.networks().forget('unknown.network')).toThrow(
            'Failed to find hosts that match [unknown.network].',
        );
    });

    it('returns available networks from the manifest', () => {
        const networks = profile.networks().availableNetworks();

        expect(networks.length).toBeGreaterThan(0);
        expect(networks.map((n) => n.id())).toContain('mainsail.mainnet');
        expect(networks.map((n) => n.id())).toContain('mainsail.devnet');
    });
});
