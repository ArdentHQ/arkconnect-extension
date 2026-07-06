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

export interface ConfirmedTransactionData {
    configure(data: any): ConfirmedTransactionData;

    hash(): string;

    timestamp(): DateTime | undefined;

    from(): string;

    to(): string;

    recipients(): MultiPaymentRecipient[];

    value(): BigNumber;

    fee(): BigNumber;

    token(): TransactionToken | undefined;

    tokens(): TransactionToken[] | undefined;

    isConfirmed(): boolean;

    isReturn(): boolean;

    isSent(): boolean;

    isReceived(): boolean;

    isTransfer(): boolean;

    isValidatorRegistration(): boolean;

    isVote(): boolean;

    isUnvote(): boolean;

    isMultiPayment(): boolean;

    isValidatorResignation(): boolean;

    username(): string;

    votes(): string[];

    publicKeys(): string[];

    min(): number;

    methodHash(): string;

    getMeta(key: string): TransactionDataMeta;

    setMeta(key: string, value: TransactionDataMeta): void;

    normalizeData(): void;
}
