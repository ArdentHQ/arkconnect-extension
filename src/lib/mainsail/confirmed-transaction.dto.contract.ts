import { BigNumber } from '@/lib/helpers';
import { DateTime } from '@/lib/intl';
import { TransactionToken } from '@/lib/profiles/transaction-token';

export interface MultiPaymentRecipient {
    address: string;
    amount: BigNumber;
}

export interface MultiPaymentItem {
    recipientId: string;
    amount: BigNumber;
}

// These types and interfaces are responsible for transaction-specific methods.
export type TransactionDataMeta = string | number | boolean | undefined;

export interface ApproveDetails {
    address: string;
    amount: bigint;
}

export interface ConfirmedTransactionData {
    configure(data: any): ConfirmedTransactionData;

    hash(): string;

    blockHash(): string | undefined;

    type(): string;

    timestamp(): DateTime | undefined;

    confirmations(): BigNumber;

    from(): string;

    to(): string;

    recipients(): MultiPaymentRecipient[];

    value(): BigNumber;

    fee(): BigNumber;

    nonce(): BigNumber;

    token(): TransactionToken | undefined;

    tokens(): TransactionToken[] | undefined;

    isConfirmed(): boolean;

    isReturn(): boolean;

    isSent(): boolean;

    isReceived(): boolean;

    isTransfer(): boolean;

    isUsernameRegistration(): boolean;

    isUsernameResignation(): boolean;

    isValidatorRegistration(): boolean;

    isVote(): boolean;

    isUnvote(): boolean;

    isMultiPayment(): boolean;

    isValidatorResignation(): boolean;

    // Second-Signature Registration
    secondPublicKey(): string;

    username(): string;

    validatorPublicKey(): string;

    approveDetails(): ApproveDetails;

    // Vote
    votes(): string[];

    unvotes(): string[];

    // Multi-Signature Registration
    publicKeys(): string[];

    min(): number;

    // Multi-Payment
    payments(): MultiPaymentItem[];

    methodHash(): string;

    expirationType(): number;

    expirationValue(): number;

    toObject(): Record<string, any>;

    toJSON(): Record<string, any>;

    toHuman(): Record<string, any>;

    hasPassed(): boolean;

    hasFailed(): boolean;

    getMeta(key: string): TransactionDataMeta;

    setMeta(key: string, value: TransactionDataMeta): void;

    normalizeData(): void;

    isSuccess(): boolean;
}

export type ConfirmedTransactionDataCollection = ConfirmedTransactionData[];
