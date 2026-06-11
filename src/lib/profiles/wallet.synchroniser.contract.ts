export interface IWalletSynchroniser {
    identity(options?: { ttl?: number }): Promise<void>;

    votes(): Promise<void>;
}
