import { Contracts, Environment } from '@ardenthq/sdk-profiles';
import { getDefaultAlias } from '@/lib/utils/getDefaultAlias';
import { setLocalValue } from '@/lib/utils/localStorage';

type TestingAddress = {
    coin: string;
    network: string;
    mnemonic: string;
};

export const isDev = (): boolean => {
    return import.meta.env.VITE_SEED_ADDRESSES === 'true';
};

const getTestingPassphrases = (): string[] => {
    const passphrases = import.meta.env.VITE_DEV_PASSPHRASES;
    return passphrases ? passphrases.split(',') : [];
};

const getTestingAddresses = (): TestingAddress[] => {
    const passphrases = getTestingPassphrases();
    const addresses: TestingAddress[] = [];

    for (const passphrase of passphrases) {
        addresses.push({ coin: 'ARK', network: 'ark.mainnet', mnemonic: passphrase });
        addresses.push({ coin: 'ARK', network: 'ark.devnet', mnemonic: passphrase });
    }
    return addresses;
};

export const createTestProfile = async ({ env }: { env: Environment }): Promise<void> => {
    const password = 'password';

    env.profiles().flush();
    const profile = await env.profiles().create('development');

    env.profiles().push(profile);

    await env.profiles().restore(profile);
    await profile.sync();

    profile.auth().setPassword(password);
    profile.settings().set(Contracts.ProfileSetting.ExchangeCurrency, 'USD');

    const walletFixtures = getTestingAddresses();

    for (const fixtureWallet of walletFixtures) {
        const wallet = await profile.walletFactory().fromMnemonicWithBIP39(fixtureWallet);

        wallet.mutator().alias(getDefaultAlias({ profile, network: wallet.network() }));

        wallet.confirmKey().set(fixtureWallet.mnemonic, password);
        profile.wallets().push(wallet);
    }

    await env.wallets().syncByProfile(profile);

    await env.verify();
    await env.persist();

    setLocalValue('hasOnboarded', true);
};
