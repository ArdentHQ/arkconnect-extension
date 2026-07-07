import { beforeEach, describe, expect, it } from 'vitest';
import { connectedTransport as ledgerTransportFactory } from '@/lib/Ledger/transport';
import { StubStorage } from '@/tests/mocks/StubStorage/StubStorage';
import { Environment } from '@/lib/profiles';

describe('ProfileRepository', () => {
    let env: Environment;

    beforeEach(() => {
        env = new Environment({ storage: new StubStorage(), ledgerTransportFactory });
    });

    it('has no active profile by default', () => {
        expect(env.profiles().first()).toBeUndefined();
    });

    it('creates and activates a profile', async () => {
        const profile = await env.profiles().create('test');

        expect(env.profiles().first()).toBe(profile);
        expect(profile.name()).toBe('test');
    });

    it('builds a detached profile without activating it', async () => {
        const active = await env.profiles().create('active');
        const detached = await env.profiles().createDetached('detached');

        expect(env.profiles().first()).toBe(active);
        expect(detached.name()).toBe('detached');
    });

    it('replaces the active profile on push', async () => {
        await env.profiles().create('first');
        const second = await env.profiles().createDetached('second');

        env.profiles().push(second);

        expect(env.profiles().first()).toBe(second);
    });

    it('clears the active profile on flush', async () => {
        await env.profiles().create('test');

        env.profiles().flush();

        expect(env.profiles().first()).toBeUndefined();
    });

    describe('forget', () => {
        it('clears the active profile when the id matches', async () => {
            const profile = await env.profiles().create('test');

            env.profiles().forget(profile.id());

            expect(env.profiles().first()).toBeUndefined();
        });

        it('throws when there is no active profile', () => {
            expect(() => env.profiles().forget('missing')).toThrow(
                'No profile found for [missing].',
            );
        });

        it('throws and leaves the active profile untouched when the id does not match', async () => {
            const profile = await env.profiles().create('test');

            expect(() => env.profiles().forget('not-the-active-id')).toThrow(
                'No profile found for [not-the-active-id].',
            );
            expect(env.profiles().first()).toBe(profile);
        });
    });

    describe('fill', () => {
        it('does nothing when given an empty object', () => {
            env.profiles().fill({});

            expect(env.profiles().first()).toBeUndefined();
        });

        it('activates a profile built from a single entry', () => {
            env.profiles().fill({ 'profile-id': { data: '', id: 'profile-id', name: 'test' } });

            expect(env.profiles().first().id()).toBe('profile-id');
        });

        it('throws when given more than one entry', () => {
            expect(() =>
                env.profiles().fill({
                    a: { data: '', id: 'a', name: 'a' },
                    b: { data: '', id: 'b', name: 'b' },
                }),
            ).toThrow('Expected at most one profile in storage.');
        });
    });

    describe('toObject', () => {
        it('returns an empty object when there is no active profile', () => {
            expect(env.profiles().toObject()).toStrictEqual({});
        });

        it('returns the active profile dump keyed by id', async () => {
            const profile = await env.profiles().create('test');

            expect(Object.keys(env.profiles().toObject())).toStrictEqual([profile.id()]);
        });
    });
});
