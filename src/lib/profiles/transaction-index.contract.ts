import { Services } from "@/lib/mainsail";

import { ConfirmedTransactionData } from "@/lib/mainsail/confirmed-transaction.dto";
import { ConfirmedTransactionDataCollection } from "@/lib/mainsail/transactions.collection";
import { UnconfirmedTransactionDataCollection } from "@/lib/mainsail/unconfirmed-transactions.collection";

export interface ITransactionIndex {
	/**
	 * Get a list of sent and received transactions.
	 *
	 * @param {Services.ClientTransactionsInput} [query]
	 * @return {Promise<ConfirmedTransactionDataCollection>}
	 * @memberof IReadWriteWallet
	 */
	all(query?: Services.ClientTransactionsInput): Promise<ConfirmedTransactionDataCollection>;

	/**
	 * Get a list of sent transactions.
	 *
	 * @param {Services.ClientTransactionsInput} [query]
	 * @return {Promise<ConfirmedTransactionDataCollection>}
	 * @memberof IReadWriteWallet
	 */
	sent(query?: Services.ClientTransactionsInput): Promise<ConfirmedTransactionDataCollection>;

	/**
	 * Get a list of received transactions.
	 *
	 * @param {Services.ClientTransactionsInput} [query]
	 * @return {Promise<ConfirmedTransactionDataCollection>}
	 * @memberof IReadWriteWallet
	 */
	received(query?: Services.ClientTransactionsInput): Promise<ConfirmedTransactionDataCollection>;

	/**
	 * Get a list of received transactions.
	 *
	 * @param {Services.ClientTransactionsInput} [query]
	 * @return {Promise<UnconfirmedTransactionDataCollection>}
	 * @memberof IReadWriteWallet
	 */
	unconfirmed(query?: Services.ClientTransactionsInput): Promise<UnconfirmedTransactionDataCollection>;

	/**
	 * Find a transaction by the given ID.
	 *
	 * @param {string} id
	 * @return {Promise<ConfirmedTransactionData>}
	 * @memberof IReadWriteWallet
	 */
	findById(id: string): Promise<ConfirmedTransactionData>;

	/**
	 * Find many transactions by the given IDs.
	 *
	 * @param {string[]} ids
	 * @return {Promise<ConfirmedTransactionData[]>}
	 * @memberof IReadWriteWallet
	 */
	findByIds(ids: string[]): Promise<ConfirmedTransactionData[]>;
}
