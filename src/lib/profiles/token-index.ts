import { TokenTransfersQuery } from "@/lib/mainsail/client.contract";

import { IReadWriteWallet, ITokenIndex, WalletData } from "./contracts";
import { WalletFlag } from "./wallet.enum";
import { ConfirmedTransactionDataCollection } from "@/lib/mainsail/transactions.collection";

export class TokenIndex implements ITokenIndex {
	readonly #wallet: IReadWriteWallet;

	public constructor(wallet: IReadWriteWallet) {
		this.#wallet = wallet;
	}

	/** {@inheritDoc ITokenIndex.all} */
	public async all(query: TokenTransfersQuery = {}): Promise<ConfirmedTransactionDataCollection> {
		return this.#fetch({
			addresses: [this.#wallet.address()],
			...query,
		});
	}

	async #fetch(query: TokenTransfersQuery): Promise<ConfirmedTransactionDataCollection> {
		const result = await this.#wallet.client().tokenTransfers({
            ...query,
            ignoreWhitelist: true,
        });

		const transactions = result.items();

		for (const transaction of transactions) {
			transaction.withWallet(this.#wallet);
		}

		if (this.#wallet.isCold() && transactions.some((t) => t.isSent() || t.isReturn())) {
			this.#wallet.data().set(WalletData.Status, WalletFlag.Hot);
		}

		return result;
	}
}
