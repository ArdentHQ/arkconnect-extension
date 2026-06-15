import { Exceptions } from '@/lib/mainsail';
import { TransactionData, KeyValuePair } from './transaction-data.dto';
import { BigNumber } from '@/lib/helpers';

interface ReceiptData {
    gasRefunded: number;
    gasUsed: number;
    status: number;
    gasLimit?: number;
    output?: string;
    decodedError?: string;
}

class TransactionReceipt {
    #receipt: ReceiptData;
    #gasLimit: number;
    #insufficientGasThreshold: number = 0.95;

    constructor(receipt: ReceiptData, gasLimit: number = 0) {
        this.#receipt = receipt;
        this.#gasLimit = gasLimit;
    }

    public isSuccess(): boolean {
        return this.#receipt.status === 1;
    }

    public hasUnknownError(): boolean {
        if (this.isSuccess()) {
            return false;
        }

        if (this.hasInsufficientGasError()) {
            return false;
        }

        const error = this.error();

        if (error === 'execution reverted') {
            return true;
        }

        return !error;
    }

    public error(): string | undefined {
        if (this.isSuccess()) {
            return undefined;
        }

        return this.#receipt.decodedError;
    }

    public prettyError(): string | undefined {
        const error = this.error();

        if (!error) {
            return undefined;
        }

        if (error === 'execution reverted' && this.hasInsufficientGasError()) {
            return 'Out of gas?';
        }

        if (error.indexOf(' ') === -1) {
            return error.replace(/([A-Z])/g, ' $1').trim();
        }

        return error.replace(/^./, error[0].toUpperCase());
    }

    public hasInsufficientGasError(): boolean {
        if (!this.#gasLimit) {
            throw new Error(
                '[TransactionReceipt#hasInsufficientGasError] Gas limit is not provided.',
            );
        }

        const gasUsed = BigNumber.make(this.#receipt.gasUsed);
        const ratio = gasUsed.divide(this.#gasLimit).decimalPlaces(2).toNumber();

        return ratio > this.#insufficientGasThreshold;
    }
}

export class ConfirmedTransactionData extends TransactionData {
    public publicKeys(): string[] {
        throw new Exceptions.NotImplemented(this.constructor.name, this.publicKeys.name);
    }

    public min(): number {
        throw new Exceptions.NotImplemented(this.constructor.name, this.min.name);
    }

    public confirmations(): BigNumber {
        return BigNumber.make(this.data.confirmations);
    }

    public toObject(): KeyValuePair {
        return {
            ...super.toObject(),
            confirmations: this.confirmations(),
        };
    }

    public toJSON(): KeyValuePair {
        return {
            ...super.toJSON(),
            confirmations: this.confirmations().toString(),
        };
    }

    public toHuman(): KeyValuePair {
        return {
            ...super.toHuman(),
            confirmations: this.confirmations().toString(),
        };
    }

    public isSuccess(): boolean {
        return this.data.receipt.status === 1;
    }

    public receipt(): TransactionReceipt {
        return new TransactionReceipt(this.data.receipt, this.data.gas);
    }

    public isConfirmed(): boolean {
        return this.confirmations().isGreaterThanOrEqualTo(1);
    }

    public gasLimit(): number {
        return this.data.gas;
    }

    public gasUsed(): number {
        return this.data.receipt.gasUsed;
    }
}
