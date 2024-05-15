import { Contracts, Environment } from '@ardenthq/sdk-profiles';

import { EnvironmentData } from '@/lib/background/contracts';
import { getDefaultAlias } from '@/lib/utils/getDefaultAlias';
import { seededAddressBook } from '@/lib/data/addressBook';

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

export const createTestAddressBook = (): void => {
    const addressBook = localStorage.getItem('addressBook');

    if (!addressBook) {
        localStorage.setItem('addressBook', JSON.stringify(seededAddressBook));
    }
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

    profile.wallets().first().data().set(Contracts.WalletData.IsPrimary, true);

    env.data().set(EnvironmentData.HasOnboarded, true);

    await env.verify();
    await env.persist();
};
