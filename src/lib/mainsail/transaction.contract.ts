import { Signatory } from './signatories';
import { SignedTransactionData } from './contracts';
import { BigNumber } from '@/lib/helpers';
import { WalletToken } from '@/lib/profiles/wallet-token';

export interface TransactionService {
    transfer(input: TransferInput): Promise<SignedTransactionData>;
    tokenTransfer(input: TransferInput): Promise<SignedTransactionData>;
    vote(input: VoteInput): Promise<SignedTransactionData>;
}

// Transaction Signing
export interface TransactionInput {
    fee?: number;
    feeLimit?: number;
    gasPrice?: BigNumber;
    gasLimit?: BigNumber;
    nonce?: string;
    signatory: Signatory;
    contract?: {
        address: string;
    };
}

export interface TransferInput extends TransactionInput {
    data: {
        amount: number | string;
        to: string;
        memo?: string;
        expiration?: number;
    };
    token?: WalletToken;
}

export interface VoteInput extends TransactionInput {
    data: {
        votes: { id: string; amount: number }[];
        unvotes: { id: string; amount: number }[];
    };
}

export type TransactionInputs = Record<string, any> & {
    signatory: Signatory;
};
