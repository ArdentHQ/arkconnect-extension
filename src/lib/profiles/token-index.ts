import { TokenTransfersQuery } from "@/lib/mainsail/client.contract";

import { IReadWriteWallet, ITokenIndex, WalletData } from "./contracts";
import { ExtendedConfirmedTransactionDataCollection } from "./transaction.collection";
import { transformTokenTransferDataCollection } from "./token.mapper";
import { WalletFlag } from "./wallet.enum";

export class TokenIndex implements ITokenIndex {
	readonly #wallet: IReadWriteWallet;

	public constructor(wallet: IReadWriteWallet) {
		this.#wallet = wallet;
	}

	/** {@inheritDoc ITokenIndex.all} */
	public async all(query: TokenTransfersQuery = {}): Promise<ExtendedConfirmedTransactionDataCollection> {
		return this.#fetch({
			addresses: [this.#wallet.address()],
			...query,
		});
	}

	async #fetch(query: TokenTransfersQuery): Promise<ExtendedConfirmedTransactionDataCollection> {
		const result = await this.#wallet.client().tokenTransfers({
            ...query,
            ignoreWhitelist: true,
        });

		const transactions = result.items();

		for (const transaction of transactions) {
			transaction.setMeta("address", this.#wallet.address());
			transaction.setMeta("publicKey", this.#wallet.publicKey());
		}

		if (this.#wallet.isCold() && transactions.some((t) => t.isSent() || t.isReturn())) {
			this.#wallet.data().set(WalletData.Status, WalletFlag.Hot);
		}

		return transformTokenTransferDataCollection(this.#wallet, result);
	}
}
