import { TokenTransfersQuery } from "@/lib/mainsail/client.contract";

import { ExtendedConfirmedTransactionDataCollection } from "./transaction.collection.js";

export interface ITokenIndex {
	/**
	 * Get a list of token transactions.
	 *
	 * @param {TokenTransfersQuery} [query]
	 * @return {Promise<ExtendedConfirmedTransactionDataCollection>}
	 * @memberof IReadWriteWallet
	 */
	all(query?: TokenTransfersQuery): Promise<ExtendedConfirmedTransactionDataCollection>;
}
