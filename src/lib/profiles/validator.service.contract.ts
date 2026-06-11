import { IReadOnlyWallet, IReadWriteWallet } from './contracts.js';

export interface IValidatorService {
    all(network: string): IReadOnlyWallet[];

    findByAddress(network: string, address: string): IReadOnlyWallet;

    findByPublicKey(network: string, publicKey: string): IReadOnlyWallet;

    findByUsername(network: string, username: string): IReadOnlyWallet;

    sync(network: string): Promise<void>;

    syncAll(): Promise<void>;

    map(wallet: IReadWriteWallet, publicKeys: string[]): IReadOnlyWallet[];

    mapByIdentifier(wallet: IReadWriteWallet, identifier: string): IReadOnlyWallet | undefined;
}
