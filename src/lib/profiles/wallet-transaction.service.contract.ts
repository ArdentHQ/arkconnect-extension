import { Services } from '@/lib/mainsail';

import { ExtendedSignedTransactionData } from './signed-transaction.dto.js';

export type SignedTransactionDataDictionary = Record<string, ExtendedSignedTransactionData>;

export interface ITransactionService {
    signTransferToken(input: Services.TransferInput): Promise<string>;

    signTransfer(input: Services.TransferInput): Promise<string>;

    signVote(input: Services.VoteInput): Promise<string>;

    transaction(id: string): ExtendedSignedTransactionData;

    pending(): SignedTransactionDataDictionary;

    signed(): SignedTransactionDataDictionary;

    broadcasted(): SignedTransactionDataDictionary;

    hasBeenSigned(id: string): boolean;

    hasBeenBroadcasted(id: string): boolean;

    hasBeenConfirmed(id: string): boolean;

    isAwaitingConfirmation(id: string): boolean;

    canBeBroadcasted(id: string): boolean;

    broadcast(id: string): Promise<Services.BroadcastResponse>;

    confirm(id: string): Promise<boolean>;

    dump(): void;

    restore(): void;
}
