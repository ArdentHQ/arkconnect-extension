import { Paginator } from './collections';
import {
    EvmCallData,
    EvmCallResponse,
    KeyValuePair,
    SignedTransactionData,
    WalletData,
} from './contracts';

import { ConfirmedTransactionData } from '@/lib/mainsail/confirmed-transaction.dto';
import { TransactionType } from './networks';

export type ClientPaginatorCursor = string | number | undefined;

export interface MetaPagination {
    prev: ClientPaginatorCursor;
    self: ClientPaginatorCursor;
    next: ClientPaginatorCursor;
    last: ClientPaginatorCursor;
    totalCount?: ClientPaginatorCursor;
}

export interface BroadcastResponse {
    accepted: string[];
    rejected: string[];
    errors: Record<string, string>;
}

export interface WalletIdentifier {
    type: 'address' | 'publicKey' | 'extendedPublicKey' | 'username';
    value: string;
    method?: 'bip39' | 'bip44' | 'bip49' | 'bip84';
    networkId?: string;
}

export interface ClientService {
    transaction(id: string): Promise<ConfirmedTransactionData>;
    transactions(query: ClientTransactionsInput): Promise<Paginator<ConfirmedTransactionData>>;

    wallet(id: WalletIdentifier, options?: object): Promise<WalletData>;

    validator(id: string): Promise<WalletData>;
    validators(query?: ClientWalletsInput): Promise<Paginator<WalletData>>;

    votes(id: string): Promise<VoteReport>;

    broadcast(transactions: SignedTransactionData[]): Promise<BroadcastResponse>;

    evmCall(callData: EvmCallData): Promise<EvmCallResponse>;
}

export interface ClientPagination {
    cursor?: string | number;
    limit?: number;
    orderBy?: string;
}

export interface RangeCriteria {
    from?: number;
    to?: number;
}

export interface WalletTokensQuery extends ClientPagination {
    addresses: string[];
    page?: number;
    minBalance?: string;
    whitelist?: string[];
}

export interface TokenTransfersQuery extends ClientPagination {
    addresses?: string[];
    whitelist?: string[];
    from?: string[];
    to?: string[];
    page?: number;
    ignoreWhitelist?: boolean;
}

export interface ClientTransactionsInput extends ClientPagination {
    // Addresses
    identifiers?: WalletIdentifier[];
    from?: string;
    to?: string;
    // Public Keys
    senderPublicKey?: string;
    recipientPublicKey?: string;
    // Meta
    asset?: Record<string, any>;
    memo?: string;
    timestamp?: RangeCriteria;
    // Transaction Types
    type?: TransactionType;
    types?: TransactionType[];
    fullReceipt?: boolean;
}

export interface ClientWalletsInput extends ClientPagination {
    identifiers?: WalletIdentifier[];
}

export interface VoteReport {
    used: number;
    available: number;
    votes: { id: string; amount: number }[];
}
