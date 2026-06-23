import { IReadWriteWallet } from './contracts.js';

export interface IGenerateOptions {
    locale?: string;
    wordCount?: number;
    withPublicKey?: boolean;
}

export interface IMnemonicOptions {
    mnemonic: string;
    password?: string;
}

export interface IAddressOptions {
    address: string;
}

export interface IAddressWithDerivationPathOptions {
    address: string;
    path: string;
}

export interface IWalletFactory {
    generate(options?: IGenerateOptions): Promise<{ mnemonic: string; wallet: IReadWriteWallet }>;

    fromMnemonicWithBIP39(options: IMnemonicOptions): Promise<IReadWriteWallet>;

    fromAddress(options: IAddressOptions): Promise<IReadWriteWallet>;

    fromAddressWithDerivationPath(
        options: IAddressWithDerivationPathOptions,
    ): Promise<IReadWriteWallet>;
}
