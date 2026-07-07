import { beforeEach, describe, expect, it } from 'vitest';
import { UUID } from '@ardenthq/arkvault-crypto';
import { connectedTransport as ledgerTransportFactory } from '@/lib/Ledger/transport';
import { StubStorage } from '@/tests/mocks/StubStorage/StubStorage';
import { Environment } from '@/lib/profiles';

describe('Environment', () => {
    let env: Environment;
    let storage: StubStorage;

    beforeEach(() => {
        storage = new StubStorage();
        env = new Environment({ storage, ledgerTransportFactory });
    });

    describe('boot', () => {
        it('does not activate a profile when storage has none', async () => {
            await env.verify();
            await env.boot();

            expect(env.profiles().first()).toBeUndefined();
        });

        it('activates the profile found in storage', async () => {
            const id = UUID.random();

            await env.verify({
                data: {},
                profiles: { [id]: { data: 'stub-data', id, name: 'test' } },
            });
            await env.boot();

            expect(env.profiles().first()?.id()).toBe(id);
        });
    });

    describe('persist', () => {
        it('writes an empty profiles object when there is no active profile', async () => {
            await env.persist();

            await expect(storage.get('profiles')).resolves.toStrictEqual({});
        });

        it('writes the active profile to storage', async () => {
            const profile = await env.profiles().create('test');

            await env.persist();

            await expect(storage.get('profiles')).resolves.toStrictEqual({
                [profile.id()]: env.profiles().dump(profile),
            });
        });
    });

    it('reloads whatever is on disk on every verify()+boot(), overwriting the in-memory profile', async () => {
        // boot() always re-reads storage, so calling it again wipes out
        // whatever profile was set in memory since.
        const staleId = UUID.random();

        await env.verify({
            data: {},
            profiles: { [staleId]: { data: 'stub-data', id: staleId, name: 'stale' } },
        });
        await env.boot();
        await env.persist();

        const freshProfile = await env.profiles().createDetached('fresh');
        env.profiles().push(freshProfile);

        expect(env.profiles().first()?.id()).toBe(freshProfile.id());

        await env.verify();
        await env.boot();

        expect(env.profiles().first()?.id()).toBe(staleId);
    });
});
