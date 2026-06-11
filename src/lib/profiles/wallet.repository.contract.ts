import { IReadWriteWallet, IWalletData, IWalletExportOptions } from './contracts.js';

export interface IWalletRepository {
    all(): Record<string, IReadWriteWallet>;

    first(): IReadWriteWallet;

    last(): IReadWriteWallet;

    keys(): string[];

    values(): IReadWriteWallet[];

    selected(): IReadWriteWallet[];

    selectAll(): void;

    selectOnly(selected: IReadWriteWallet[]): void;

    selectOne(selected: IReadWriteWallet): void;

    fill(struct: Record<string, IWalletData>): void;

    restore(options?: { networkId?: string; ttl?: number }): Promise<void>;

    findById(id: string): IReadWriteWallet;

    filterByAddress(address: string): IReadWriteWallet[];

    findByAddressWithNetwork(address: string, network: string): IReadWriteWallet | undefined;

    findByPublicKey(publicKey: string): IReadWriteWallet | undefined;

    findByAlias(alias: string): IReadWriteWallet | undefined;

    push(wallet: IReadWriteWallet, options?: { force: boolean }): IReadWriteWallet;

    update(id: string, data: { alias?: string }): void;

    has(id: string): boolean;

    forget(id: string): void;

    flush(): void;

    count(): number;

    toObject(options?: IWalletExportOptions): Record<string, IWalletData>;

    sortBy(column: string, direction: 'asc' | 'desc'): IReadWriteWallet[];

    findByCoin(coin: string): IReadWriteWallet[];
}
