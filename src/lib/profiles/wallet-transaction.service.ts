import { Services } from '@/lib/mainsail';
import { IReadWriteWallet, ITransactionService, WalletData } from './contracts';

import { ExtendedSignedTransactionData } from './signed-transaction.dto';
import { SignedTransactionDataDictionary } from './wallet-transaction.service.contract';
import { SignedTransactionData } from '@/lib/mainsail/signed-transaction.dto';
import { ConfirmedTransactionData } from '@/lib/mainsail/confirmed-transaction.dto';

export class TransactionService implements ITransactionService {
    readonly #wallet: IReadWriteWallet;

    #signed: SignedTransactionDataDictionary = {};

    #broadcasted: SignedTransactionDataDictionary = {};

    #confirmed: SignedTransactionDataDictionary = {};

    #pending: SignedTransactionDataDictionary = {};

    public constructor(wallet: IReadWriteWallet) {
        this.#wallet = wallet;

        this.restore();
    }

    public async signTransfer(input: Services.TransferInput): Promise<string> {
        return this.#signTransaction('transfer', input);
    }

    public async signTransferToken(input: Services.TransferInput): Promise<string> {
        return this.#signTransaction('tokenTransfer', input);
    }

    public async signVote(input: Services.VoteInput): Promise<string> {
        return this.#signTransaction('vote', input);
    }

    public transaction(id: string): ExtendedSignedTransactionData {
        this.#assertHasValidIdentifier(id);

        const transaction =
            this.#confirmed[id] || this.#broadcasted[id] || this.#signed[id] || this.#pending[id];

        if (!transaction) {
            throw new Error(`Transaction [${id}] could not be found.`);
        }

        return transaction;
    }

    public pending(): SignedTransactionDataDictionary {
        return {
            ...this.signed(),
            ...this.broadcasted(),
            ...this.#pending,
        };
    }

    public signed(): SignedTransactionDataDictionary {
        return this.#signed;
    }

    public broadcasted(): SignedTransactionDataDictionary {
        return this.#broadcasted;
    }

    public hasBeenSigned(id: string): boolean {
        this.#assertHasValidIdentifier(id);

        return this.#signed[id] !== undefined;
    }

    public hasBeenBroadcasted(id: string): boolean {
        this.#assertHasValidIdentifier(id);

        return this.#broadcasted[id] !== undefined;
    }

    public hasBeenConfirmed(id: string): boolean {
        this.#assertHasValidIdentifier(id);

        return this.#confirmed[id] !== undefined;
    }

    public isAwaitingConfirmation(id: string): boolean {
        return this.hasBeenBroadcasted(id);
    }

    public canBeBroadcasted(id: string): boolean {
        this.#assertHasValidIdentifier(id);

        if (!this.#signed[id]) {
            return false;
        }

        return true;
    }

    public async broadcast(id: string): Promise<Services.BroadcastResponse> {
        this.#assertHasValidIdentifier(id);

        const transaction: ExtendedSignedTransactionData = this.transaction(id);

        let result: Services.BroadcastResponse = {
            accepted: [],
            errors: {},
            rejected: [],
        };

        if (this.canBeBroadcasted(id)) {
            result = await this.#wallet.client().broadcast([transaction.data()]);
        }

        if (result.accepted.includes(transaction.hash())) {
            this.#broadcasted[id] = this.#signed[id];
        }

        return result;
    }

    public async confirm(id: string): Promise<boolean> {
        this.#assertHasValidIdentifier(id);

        if (!this.isAwaitingConfirmation(id)) {
            throw new Error(`Transaction [${id}] is not awaiting confirmation.`);
        }

        try {
            const transactionLocal: ExtendedSignedTransactionData = this.transaction(id);
            const transaction: ConfirmedTransactionData = await this.#wallet
                .client()
                .transaction(transactionLocal.hash());

            if (transaction.isConfirmed()) {
                delete this.#signed[id];
                delete this.#broadcasted[id];
                delete this.#pending[id];

                // We store the transaction here to be able to access it after it
                // has been confirmed. This list won't be persisted which means
                // it will be gone after a reboot of the consumer application.
                this.#confirmed[id] = transactionLocal;
            }

            return transaction.isConfirmed();
        } catch {
            return false;
        }
    }

    public dump(): void {
        // eslint-disable-next-line unicorn/consistent-function-scoping
        const dumpStorage = (storage: object, storageKey: string) => {
            const result: Record<string, object> = {};

            for (const [id, transaction] of Object.entries(storage)) {
                this.#assertHasValidIdentifier(id);

                result[id] = transaction;
            }

            this.#wallet.data().set(storageKey, result);
        };

        dumpStorage(this.#signed, WalletData.SignedTransactions);
        dumpStorage(this.#broadcasted, WalletData.BroadcastedTransactions);
    }

    public restore(): void {
        // eslint-disable-next-line unicorn/consistent-function-scoping
        const restoreStorage = (storage: object, storageKey: string) => {
            const transactions: object = this.#wallet.data().get(storageKey) || {};

            for (const [id, transaction] of Object.entries(transactions)) {
                this.#assertHasValidIdentifier(id);

                storage[id] = new ExtendedSignedTransactionData(
                    // @TODO: Serialize transaction data within SignedTransactionData instead of requiring it as a property.
                    new SignedTransactionData().configure(transaction, '1'),
                    this.#wallet,
                );
            }
        };

        restoreStorage(this.#signed, WalletData.SignedTransactions);
        restoreStorage(this.#broadcasted, WalletData.BroadcastedTransactions);
    }

    async #signTransaction(type: string, input: any): Promise<string> {
        const transaction: ExtendedSignedTransactionData =
            this.#createExtendedSignedTransactionData(
                await this.#wallet.transactionService()[type](input),
            );

        this.#signed[transaction.hash()] = transaction;

        return transaction.hash();
    }

    #assertHasValidIdentifier(id: string): void {
        if (id === undefined) {
            throw new Error('Encountered a malformed ID. This looks like a bug.');
        }
    }

    #createExtendedSignedTransactionData(
        transaction: SignedTransactionData,
    ): ExtendedSignedTransactionData {
        return new ExtendedSignedTransactionData(transaction, this.#wallet);
    }
}
