import { Contracts } from '@/lib/mainsail';
import { IReadWriteWallet } from './contracts.js';

import { BigNumber } from '@/lib/helpers';
import { DateTime } from '@/lib/intl';
import { ConfirmedTransactionData } from '../mainsail/confirmed-transaction.dto.js';
import { TransactionToken } from '@/lib/profiles/transaction-token';

export interface ExtendedTransactionRecipient {
    address: string;
    amount: BigNumber;
}

export class ExtendedConfirmedTransactionData {
    readonly #wallet: IReadWriteWallet;
    readonly #data: ConfirmedTransactionData;

    public constructor(wallet: IReadWriteWallet, data: ConfirmedTransactionData) {
        this.#wallet = wallet;
        this.#data = data;
    }

    public hash(): string {
        return this.#data.hash();
    }

    public timestamp(): DateTime | undefined {
        return this.#data.timestamp();
    }

    public from(): string {
        return this.#data.from();
    }

    public to(): string {
        return this.#data.to();
    }

    // @ts-ignore
    public recipients(): ExtendedTransactionRecipient[] {
        /* istanbul ignore next */
        return this.#data.recipients().map(({ address, amount }) => ({ address, amount }));
    }

    // @ts-ignore
    public value(): BigNumber {
        return this.#data.value();
    }

    // @ts-ignore
    public fee(): BigNumber {
        return this.#data.fee();
    }

    public memo(): string | undefined {
        // @ts-ignore
        return this.#data.memo?.();
    }

    public isConfirmed(): boolean {
        return this.#data.isConfirmed();
    }

    public isSent(): boolean {
        return this.#data.isSent();
    }

    public isReceived(): boolean {
        return this.#data.isReceived();
    }

    public isReturn(): boolean {
        return this.#data.isReturn();
    }

    public isTransfer(): boolean {
        return this.#data.isTransfer();
    }

    public isValidatorRegistration(): boolean {
        return this.#data.isValidatorRegistration();
    }

    public isVote(): boolean {
        return this.#data.isVote();
    }

    public isUnvote(): boolean {
        return this.#data.isUnvote();
    }

    public isMultiPayment(): boolean {
        return this.#data.isMultiPayment();
    }

    public isValidatorResignation(): boolean {
        return this.#data.isValidatorResignation();
    }

    public username(): string {
        return this.data<Contracts.ConfirmedTransactionData>().username();
    }

    public publicKeys(): string[] {
        return this.data<Contracts.ConfirmedTransactionData>().publicKeys();
    }

    public min(): number {
        return this.data<Contracts.ConfirmedTransactionData>().min();
    }

    public votes(): string[] {
        return this.data<Contracts.ConfirmedTransactionData>().votes();
    }

    public explorerLink(): string {
        return this.#wallet.link().transaction(this.hash());
    }

    public token(): TransactionToken | undefined {
        return this.#data.token();
    }

    public tokens(): TransactionToken[] | undefined {
        return this.#data.tokens();
    }

    public getMeta(key: string): Contracts.TransactionDataMeta {
        return this.#data.getMeta(key);
    }

    public setMeta(key: string, value: Contracts.TransactionDataMeta): void {
        return this.#data.setMeta(key, value);
    }

    public total(): BigNumber {
        if (this.isReturn()) {
            return this.value().minus(this.fee());
        }

        if (this.isSent() && !this.isTokenTransfer()) {
            return this.value().plus(this.fee());
        }

        let total = this.value();

        if (this.isMultiPayment()) {
            for (const recipient of this.recipients()) {
                if (recipient.address !== this.wallet().address()) {
                    total = total.minus(recipient.amount);
                }
            }
        }

        return total;
    }

    public wallet(): IReadWriteWallet {
        return this.#wallet;
    }

    protected data<T>(): T {
        return this.#data as unknown as T;
    }

    public normalizeData(): void {
        return this.#data.normalizeData();
    }

    public isTokenTransfer(): boolean {
        return this.#data.isTokenTransfer();
    }
}
