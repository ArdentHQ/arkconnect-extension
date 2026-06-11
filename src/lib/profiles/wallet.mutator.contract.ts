import { Services } from '@/lib/mainsail';

export interface IWalletMutator {
    identity(mnemonic: string): Promise<void>;

    address(
        address: Partial<Services.AddressDataTransferObject>,
        options?: { ttl?: number },
    ): Promise<void>;

    avatar(value: string): void;

    alias(alias: string): void;

    accountName(name: string): void;

    isSelected(isSelected: boolean): void;

    removeEncryption(password: string): Promise<void>;
}
