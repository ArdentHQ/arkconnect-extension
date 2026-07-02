import { beforeEach, describe, expect, it } from 'vitest';
import { connectedTransport as ledgerTransportFactory } from '@/lib/Ledger/transport';
import { StubStorage } from '@/tests/mocks/StubStorage/StubStorage';
import { Contracts, Environment } from '@/lib/profiles';

describe('WalletRepository', () => {
    let env: Environment;
    let profile: Contracts.IProfile;

    beforeEach(async () => {
        env = new Environment({ storage: new StubStorage(), ledgerTransportFactory });
        profile = await env.profiles().create('test');
    });

    const importAddress = (address: string): Promise<Contracts.IReadWriteWallet> =>
        profile.walletFactory().fromAddress({ address });

    it('returns all wallets', async () => {
        expect(profile.wallets().all()).toStrictEqual({});

        const wallet = await importAddress('addr-1');
        profile.wallets().push(wallet);

        expect(Object.keys(profile.wallets().all())).toHaveLength(1);
    });

    describe('filterByAddress', () => {
        it('returns all wallets matching the address', async () => {
            const wallet = await importAddress('addr-1');
            profile.wallets().push(wallet);

            const results = profile.wallets().filterByAddress('addr-1');

            expect(results).toHaveLength(1);
            expect(results[0].address()).toBe('addr-1');
        });

        it('returns an empty array when no wallet matches', async () => {
            expect(profile.wallets().filterByAddress('unknown')).toStrictEqual([]);
        });
    });

    describe('findByAddressWithNetwork', () => {
        it('finds a wallet by address and network id', async () => {
            const wallet = await importAddress('addr-1');
            profile.wallets().push(wallet);

            const found = profile.wallets().findByAddressWithNetwork('addr-1', wallet.networkId());

            expect(found?.address()).toBe('addr-1');
        });

        it('returns undefined when the address does not match', async () => {
            const wallet = await importAddress('addr-1');
            profile.wallets().push(wallet);

            expect(
                profile.wallets().findByAddressWithNetwork('addr-2', wallet.networkId()),
            ).toBeUndefined();
        });

        it('returns undefined when the network does not match', async () => {
            const wallet = await importAddress('addr-1');
            profile.wallets().push(wallet);

            expect(
                profile.wallets().findByAddressWithNetwork('addr-1', 'other.network'),
            ).toBeUndefined();
        });
    });

    describe('push', () => {
        it('throws when pushing a duplicate address + network combination', async () => {
            const wallet = await importAddress('addr-1');
            profile.wallets().push(wallet);

            const duplicate = await importAddress('addr-1');

            expect(() => profile.wallets().push(duplicate)).toThrow(
                `The wallet [addr-1] with network [${wallet.networkId()}] already exists.`,
            );
        });

        it('allows force-pushing a duplicate', async () => {
            const wallet = await importAddress('addr-1');
            profile.wallets().push(wallet);

            const duplicate = await importAddress('addr-1');

            expect(() => profile.wallets().push(duplicate, { force: true })).not.toThrow();
        });
    });

    describe('sortBy', () => {
        it('sorts by balance ascending', async () => {
            const a = await importAddress('addr-a');
            const b = await importAddress('addr-b');
            profile.wallets().push(a);
            profile.wallets().push(b, { force: true });

            const sorted = profile.wallets().sortBy('balance', 'asc');

            expect(sorted).toHaveLength(2);
        });
    });

    describe('forget', () => {
        it('removes a wallet by id', async () => {
            const wallet = await importAddress('addr-1');
            profile.wallets().push(wallet);

            profile.wallets().forget(wallet.id());

            expect(profile.wallets().count()).toBe(0);
        });

        it('throws when the wallet does not exist', () => {
            expect(() => profile.wallets().forget('unknown-id')).toThrow(
                'Failed to find a wallet for [unknown-id].',
            );
        });
    });
});
