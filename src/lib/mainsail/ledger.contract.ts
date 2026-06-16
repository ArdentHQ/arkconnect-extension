import { WalletData } from './contracts';

export type LedgerTransport = any;
export type LedgerTransportFactory = () => Promise<LedgerTransport>;

export interface LedgerService {
    connect(): Promise<void>;

    disconnect(): Promise<void>;

    getVersion(): Promise<string>;

    getPublicKey(path: string): Promise<string>;

    getExtendedPublicKey(path: string): Promise<string>;

    sign(path: string, payload: Buffer): Promise<{ r: string; s: string; v: string }>;

    signMessage(path: string, payload: string): Promise<string>;

    scan(options?: {
        useLegacy: boolean;
        startPath?: string;
        onProgress?: (wallet: WalletData) => void;
    }): Promise<Record<string, WalletData>>;

}
