export interface IWalletImportFormat {
    get(password: string): Promise<string>;

    set(mnemonic: string, password: string): Promise<void>;

    exists(): boolean;

    forget(password: string): void;
}
