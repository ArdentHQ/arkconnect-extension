import { BigNumber } from '@/lib/helpers';

export type KeyValuePair = Record<string, any>;

export interface WalletBalance {
    total: BigNumber;
    available: BigNumber;
    fees: BigNumber;
    locked?: BigNumber;
    lockedVotes?: BigNumber;
    lockedUnvotes?: BigNumber;
    tokens?: Record<string, BigNumber>;
}

export interface WalletData {
    fill(data: any): WalletData;

    // Wallet
    primaryKey(): string;

    address(): string;

    publicKey(): string | undefined;

    balance(): WalletBalance;

    nonce(): BigNumber;

    // Second Signature
    secondPublicKey(): string | undefined;

    // Delegate
    username(): string | undefined;

    validatorPublicKey(): string | undefined;

    rank(): number | undefined;

    tokenCount(): number;

    votes(): BigNumber | undefined;

    // Flags
    isValidator(): boolean;

    isLegacyValidator(): boolean;

    isResignedValidator(): boolean;

    toObject(): KeyValuePair;

    hasPassed(): boolean;

    hasFailed(): boolean;

    isSelected(): boolean;
}

type LedgerTransport = any;

export type { LedgerTransport };

export type {
    ConfirmedTransactionData,
    MultiPaymentRecipient,
    TransactionDataMeta,
    UnspentTransactionData,
} from './confirmed-transaction.dto.contract.js';
export type { EvmCallData, EvmCallResponse } from './evm.contract.js';
export type {
    RawTransactionData,
    SignedTransactionData,
} from './signed-transaction.dto.contract.js';

