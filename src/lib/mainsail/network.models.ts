import { ConfigRepository } from './config.repository';

export type FeeType = 'static' | 'dynamic' | 'gas' | 'free' | 'weight' | 'size';

export type ExpirationType = 'height' | 'timestamp';

export type NetworkHostType = 'full' | 'tx' | 'musig' | 'archival' | 'explorer' | 'evm';

export type TransactionType =
    | 'usernameRegistration'
    | 'usernameResignation'
    | 'validatorResignation'
    | 'validatorRegistration'
    | 'updateValidator'
    | 'multiPayment'
    | 'transfer'
    | 'vote';

export interface NetworkHost {
    id?: string;
    type: NetworkHostType;
    host: string;
    custom?: boolean;
    failedCount?: number;
    height?: number;
    query?: Record<string, string>;
    enabled?: boolean;
}

export type NetworkHostSelector = (
    configRepository: ConfigRepository,
    type?: NetworkHostType,
) => NetworkHost;

export interface NetworkManifestTransactions {
    expirationType: ExpirationType;
    types: TransactionType[];
    fees: {
        type: FeeType;
        ticker: string;
    };
    memo?: boolean;
    utxo?: boolean;
    multiPaymentRecipients?: number;
    lockedBalance?: boolean;
}

export interface NetworkManifestExplorer {
    block: string;
    transaction: string;
    wallet: string;
}

export interface NetworkManifestToken {
    name: string;
    symbol: string;
    address: string;
    decimals: number;
}

export interface NetworkManifestConstants {
    epoch?: string;
    slip44: number;
    slip44Legacy: number;
    slip44Eth: number;
    bech32?: string;
    bip32?: {
        private: number;
        public: number;
    };
    bip39?: {
        wordCount: number;
    };
    wif?: number;
}

export type VotingMethod = 'simple' | 'split' | 'transfer';

export interface NetworkManifest {
    id: string;
    type: string;
    name: string;
    coin: string;
    currency: {
        ticker: string;
        symbol: string;
        decimals?: number;
    };
    hosts: NetworkHost[];
    constants: NetworkManifestConstants;
    governance?: {
        /**
         * If the type is "simple" then the transaction can be send as is.
         * ARK for example can do everything in a single vote transaction.
         *
         * If the type is "split" then a vote and unvote have to be performed separately.
         * BIND for exampel can't vote and unvote in a single vote transaction.
         *
         * If the type is "transfer" then funds have to be transfered before voting.
         * AVAX for example operates on multiple blockchains and requires fund transfers.
         */
        method?: VotingMethod;
        validatorIdentifier?: 'address' | 'publicKey';
        validatorCount: number;
        votesPerWallet: number;
        votesPerTransaction: number;
        // Only LSK at the moment
        votesAmountStep?: number;
        votesAmountMinimum?: number;
        votesAmountMaximum?: number;
    };
    transactions: NetworkManifestTransactions;
    knownWallets?: string;
    explorer: NetworkManifestExplorer;
    tokens?: NetworkManifestToken[];
    meta?: Record<string, any>;
}

export interface CoinManifest {
    name: string;
    networks: Record<string, NetworkManifest>;
}
