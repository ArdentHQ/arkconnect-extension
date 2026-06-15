import { Services } from '@/lib/mainsail';

import { ExtendedConfirmedTransactionDataCollection } from './transaction.collection.js';
import { ExtendedConfirmedTransactionData } from './transaction.dto.js';
import { UnconfirmedTransactionDataCollection } from '@/lib/mainsail/unconfirmed-transactions.collection';

export interface ITransactionIndex {
    all(
        query?: Services.ClientTransactionsInput,
    ): Promise<ExtendedConfirmedTransactionDataCollection>;

    sent(
        query?: Services.ClientTransactionsInput,
    ): Promise<ExtendedConfirmedTransactionDataCollection>;

    received(
        query?: Services.ClientTransactionsInput,
    ): Promise<ExtendedConfirmedTransactionDataCollection>;

    unconfirmed(
        query?: Services.ClientTransactionsInput,
    ): Promise<UnconfirmedTransactionDataCollection>;

    findById(id: string): Promise<ExtendedConfirmedTransactionData>;

    findByIds(ids: string[]): Promise<ExtendedConfirmedTransactionData[]>;
}
