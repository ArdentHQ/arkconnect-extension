import { Services } from '@/lib/mainsail';

import { Paginator } from '@/lib/mainsail/collections';
import { ExtendedConfirmedTransactionDataCollection } from './transaction.collection.js';
import { ExtendedConfirmedTransactionData } from './transaction.dto.js';
import { UnconfirmedTransactionData } from '@/lib/mainsail/unconfirmed-transaction.dto';

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
    ): Promise<Paginator<UnconfirmedTransactionData>>;

    findById(id: string): Promise<ExtendedConfirmedTransactionData>;

    findByIds(ids: string[]): Promise<ExtendedConfirmedTransactionData[]>;
}
