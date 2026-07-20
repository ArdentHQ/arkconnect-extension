import { TokenTransfersQuery } from "@/lib/mainsail/client.contract";

import { ConfirmedTransactionDataCollection } from "@/lib/mainsail/transactions.collection";

export interface ITokenIndex {
	/**
	 * Get a list of token transactions.
	 *
	 * @param {TokenTransfersQuery} [query]
	 * @return {Promise<ConfirmedTransactionDataCollection>}
	 * @memberof IReadWriteWallet
	 */
	all(query?: TokenTransfersQuery): Promise<ConfirmedTransactionDataCollection>;
}
