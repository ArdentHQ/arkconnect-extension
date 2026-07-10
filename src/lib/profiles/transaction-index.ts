import { Services } from "@/lib/mainsail";

import { IReadWriteWallet, ITransactionIndex, WalletData } from "./contracts.js";
import { WalletFlag } from "./wallet.enum";
import { ConfirmedTransactionData } from "@/lib/mainsail/confirmed-transaction.dto";
import { ConfirmedTransactionDataCollection } from "@/lib/mainsail/transactions.collection";
import { UnconfirmedTransactionDataCollection } from "@/lib/mainsail/unconfirmed-transactions.collection";

export class TransactionIndex implements ITransactionIndex {
	readonly #wallet: IReadWriteWallet;

	public constructor(wallet: IReadWriteWallet) {
		this.#wallet = wallet;
	}

	/** {@inheritDoc ITransactionIndex.all} */
	public async all(
		query: Services.ClientTransactionsInput = {},
	): Promise<ConfirmedTransactionDataCollection> {
		return this.#fetch({
			identifiers: [
				{
					method: this.#wallet.data().get(WalletData.ImportMethod),
					type: "address",
					value: this.#wallet.address(),
				},
			],
			...query,
		});
	}

	/** {@inheritDoc ITransactionIndex.sent} */
	public async sent(
		query: Services.ClientTransactionsInput = {},
	): Promise<ConfirmedTransactionDataCollection> {
		return this.#fetch({ from: this.#wallet.address(), ...query });
	}

	/** {@inheritDoc ITransactionIndex.received} */
	public async received(
		query: Services.ClientTransactionsInput = {},
	): Promise<ConfirmedTransactionDataCollection> {
		return this.#fetch({ to: this.#wallet.address(), ...query });
	}

	public async unconfirmed(
		query: Services.ClientTransactionsInput = {},
	): Promise<UnconfirmedTransactionDataCollection> {
		return await this.#wallet.client().unconfirmedTransactions(query);
	}

	/** {@inheritDoc ITransactionIndex.findById} */
	public async findById(hash: string): Promise<ConfirmedTransactionData> {
		return (await this.#wallet.client().transaction(hash)).withWallet(this.#wallet);
	}

	/** {@inheritDoc ITransactionIndex.findByIds} */
	public async findByIds(hashes: string[]): Promise<ConfirmedTransactionData[]> {
		return Promise.all(hashes.map((hash: string) => this.findById(hash)));
	}

	async #fetch(query: Services.ClientTransactionsInput): Promise<ConfirmedTransactionDataCollection> {
		const result = await this.#wallet.client().transactions(query);

		const transactions = result.items();

		for (const transaction of transactions) {
			transaction.withWallet(this.#wallet);
		}

		if (this.#wallet.isCold() && transactions.some((t) => t.isSent() || t.isReturn())) {
			this.#wallet.data().set(WalletData.Status, WalletFlag.Hot);
		}

		await Promise.allSettled(transactions.map((transaction) => transaction.normalizeData()));

		return result;
	}
}
