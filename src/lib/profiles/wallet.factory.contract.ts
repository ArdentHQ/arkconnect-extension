import { IReadWriteWallet } from './contracts.js';
import { Services } from '@/lib/mainsail';

export interface IGenerateOptions {
    locale?: string;
    wordCount?: number;
    withPublicKey?: boolean;
}

export type IGenerateHDOptions = IGenerateOptions & {
    coin?: BIP44CoinType;
    mnemonic?: string;
    levels: Services.IdentityLevels;
};

export interface IMnemonicOptions {
    mnemonic: string;
    password?: string;
}

export enum BIP44CoinType {
    ARK = "1'", // 111 for mainnet, 1 for devnet (core), todo: https://app.clickup.com/t/86dxuqw2q
    ETH = "60'",
}

export interface IMnemonicBIP44DerivativeOptions extends IMnemonicOptions {
    levels: Services.IdentityLevels;
    coin?: BIP44CoinType;
}

export interface IMnemonicDerivativeOptions extends IMnemonicOptions {
    levels: Services.IdentityLevels;
}

export interface IAddressOptions {
    address: string;
}

export interface IPublicKeyOptions {
    publicKey: string;
    bip44?: Services.IdentityLevels;
    bip49?: Services.IdentityLevels;
    bip84?: Services.IdentityLevels;
}

export interface IPrivateKeyOptions {
    privateKey: string;
}

export interface IAddressWithDerivationPathOptions {
    address: string;
    path: string;
}

export interface ISecretOptions {
    secret: string;
    password?: string;
}

export interface IWifOptions {
    wif: string;
    password?: string;
}

export interface IWalletFactory {
    generate(options?: IGenerateOptions): Promise<{ mnemonic: string; wallet: IReadWriteWallet }>;

    generateHD(
        options?: IGenerateHDOptions,
    ): Promise<{ mnemonic: string; wallet: IReadWriteWallet }>;

    fromMnemonicWithBIP39(options: IMnemonicOptions): Promise<IReadWriteWallet>;

    fromMnemonicWithBIP44(options: IMnemonicBIP44DerivativeOptions): Promise<IReadWriteWallet>;

    fromMnemonicWithBIP49(options: IMnemonicDerivativeOptions): Promise<IReadWriteWallet>;

    fromMnemonicWithBIP84(options: IMnemonicDerivativeOptions): Promise<IReadWriteWallet>;

    fromAddress(options: IAddressOptions): Promise<IReadWriteWallet>;

    fromPublicKey(options: IPublicKeyOptions): Promise<IReadWriteWallet>;

    fromPrivateKey(options: IPrivateKeyOptions): Promise<IReadWriteWallet>;

    fromAddressWithDerivationPath(
        options: IAddressWithDerivationPathOptions,
    ): Promise<IReadWriteWallet>;

    fromSecret(options: ISecretOptions): Promise<IReadWriteWallet>;
}
