import { Contracts } from ".";
import { Networks } from "@/lib/mainsail";
import { ClientService } from "@/lib/mainsail/client.service";
import { WalletTokenCollection } from "@/lib/mainsail/wallet-token.collection";
import { TokenTransfersQuery, WalletTokensQuery } from "@/lib/mainsail/client.contract";
import { WalletToken } from "./wallet-token";
import { ConfirmedTransactionDataCollection } from "@/lib/mainsail/transactions.collection";
import { WalletTokenDTO } from "./wallet-token.dto";
import { BigNumber } from "@/lib/helpers";
import { ProfileSetting } from "./profile.enum.contract";
import { ConfirmedTransactionData } from "@/lib/mainsail/confirmed-transaction.dto";

export class TokenService {
	#profile: Contracts.IProfile;
	#network: Networks.Network;
	#dustBalanceThreshold = "0.01";
	#walletTokensCollection: WalletTokenCollection;
	#lastQuery: WalletTokensQuery | undefined;
	#addressToPage: Map<string, string | number | undefined>;

	public constructor({ profile, network }: { profile: Contracts.IProfile; network: Networks.Network }) {
		this.#profile = profile;
		this.#network = network;
		this.#walletTokensCollection = new WalletTokenCollection([], {
			last: undefined,
			next: 0,
			prev: undefined,
			self: undefined,
			totalCount: undefined,
		});
		this.#addressToPage = new Map();
	}

	/**
	 * Synchronises tokens for all selected wallets.
	 *
	 * @returns {Promise<void>}
	 */
	public async sync(query?: WalletTokensQuery): Promise<void> {
		await this.#syncTokenAddresses(query);
		const walletTokens = this.#walletTokensCollection.items();

		for (const walletToken of walletTokens) {
			const wallet = this.#profile.wallets().findByAddressWithNetwork(walletToken.address(), this.#network.id());

			wallet?.tokens().push(walletToken);
		}
	}

	/**
	 * Retrieves the total count of tokens from all selected wallets.
	 *
	 * @returns {number}
	 */
	selectedCount(): number {
		return this.selected().totalCount();
	}

	/**
	 * Retrieves all tokens from selected wallets.
	 *
	 * @returns {WalletTokenRepository}
	 */
	async #syncTokenAddresses(query?: WalletTokensQuery): Promise<void> {
		const clientService = new ClientService({
			config: this.#profile.activeNetwork().config(),
			profile: this.#profile,
		});

		const hideDustTokens = this.#profile.settings().get(ProfileSetting.HideDustTokens);

		try {
			const addresses = this.#profile
				.wallets()
				.selected()
				.map((wallet) => wallet.address());

			if (addresses.length === 0) {
				throw new Error("No address selected");
			}

			let tokensQuery: WalletTokensQuery = {
				addresses,
				minBalance: hideDustTokens ? this.#dustBalanceThreshold : "0",
			};

			const whitelistedContractAddresses = this.#profile.whitelistedContractAddresses();

			if (whitelistedContractAddresses.length > 0) {
				tokensQuery = {
					...tokensQuery,
					whitelist: whitelistedContractAddresses,
				};
			}

			this.#lastQuery = {
				...tokensQuery,
				...(query ?? {}),
			};

			const response = await clientService.tokenAddresses(this.#lastQuery);

			for (const item of response.items()) {
				this.#addressToPage.set(item.address(), this.#lastQuery.page ?? 1);
			}

			this.#walletTokensCollection = new WalletTokenCollection(response.items(), response.getPagination());
		} catch {
			this.#walletTokensCollection = new WalletTokenCollection([], {
				last: undefined,
				next: 0,
				prev: undefined,
				self: undefined,
				totalCount: undefined,
			});
		}
	}

	#aggregateTokens(tokens: WalletToken[]): WalletToken[] {
		const aggregated = new Map<string, WalletToken>();
		for (const token of tokens) {
			const existing = aggregated.get(token.token().address());

			if (existing) {
				const updatedWithBalance = new WalletToken({
					network: this.#profile.activeNetwork(),
					profile: this.#profile,
					token: existing.token(),
					walletToken: new WalletTokenDTO({
						address: token.address(),
						balance: BigNumber.make(token.balanceRaw()).plus(existing.balanceRaw()).toString(),
						tokenAddress: token.token().address(),
					}),
				});

				aggregated.set(token.token().address(), updatedWithBalance);
				continue;
			}

			aggregated.set(token.token().address(), token);
		}
		return [...aggregated.values()];
	}

	selected(): WalletTokenCollection {
		return this.#walletTokensCollection;
	}

	aggregated(): WalletTokenCollection {
		return new WalletTokenCollection(this.#aggregateTokens(this.#walletTokensCollection.items()), {
			last: this.#walletTokensCollection.lastPage(),
			next: this.#walletTokensCollection.nextPage(),
			prev: this.#walletTokensCollection.previousPage(),
			self: undefined,
			totalCount: this.#walletTokensCollection.totalCount(),
		});
	}

	#getTransactionWallet(
		transaction: ConfirmedTransactionData,
		queryAddresses?: string[],
	): Contracts.IReadWriteWallet | undefined {
		const address = queryAddresses?.find((address) =>
			[
				transaction.to()?.toLowerCase(),
				transaction.from()?.toLowerCase(),
				transaction.token()?.to().toLowerCase(),
				transaction.token()?.from().toLowerCase(),
			].includes(address.toLowerCase()),
		);

		if (address) {
			return this.#profile
				.wallets()
				.values()
				.find((wallet) => wallet.address().toLowerCase() === address.toLowerCase());
		}
	}

	#attachTransactionWallets(transactions: ConfirmedTransactionDataCollection): void {
		const addresses = this.#profile
			.wallets()
			.values()
			.map((wallet) => wallet.address());

		for (const transaction of transactions.items()) {
			const wallet = this.#getTransactionWallet(transaction, addresses);

			if (wallet) {
				transaction.withWallet(wallet);
			}
		}
	}

	/**
	 * Retrieves token transfers
	 *
	 * @returns {ConfirmedTransactionDataCollection}
	 */
	async transfers(query: TokenTransfersQuery | undefined = {}): Promise<ConfirmedTransactionDataCollection> {
		const activeNetwork = this.#profile.activeNetwork();

		const clientService = new ClientService({
			config: activeNetwork.config(),
			profile: this.#profile,
		});

		let response: ConfirmedTransactionDataCollection;

		const transfersQuery = {
			from: this.#profile
				.wallets()
				.selected()
				.map((wallet) => wallet.address()),
			...query,
		};

		try {
			const whitelist = this.#profile.whitelistedContractAddresses();
			if (whitelist.length > 0) {
				transfersQuery.whitelist = whitelist;
			}

			response = await clientService.tokenTransfers(transfersQuery);

			this.#attachTransactionWallets(response);
		} catch {
			return new ConfirmedTransactionDataCollection([], {
				last: undefined,
				next: 0,
				prev: undefined,
				self: undefined,
				totalCount: undefined,
			});
		}

		return response;
	}

	#client(): ClientService {
		return new ClientService({
			config: this.#profile.activeNetwork().config(),
			profile: this.#profile,
		});
	}
	/**
	 * Calculates the total balance of all tokens from selected wallets.
	 *
	 * @returns {number}
	 */
	selectedTotalBalance(): BigNumber {
		let total = BigNumber.make(0);

		for (const wallet of this.#profile.wallets().selected().values()) {
			for (const token of wallet.tokens().values()) {
				total = total.plus(token.balance());
			}
		}

		return total;
	}

	public async syncOne(address: string): Promise<void> {
		const page = this.#addressToPage.get(address) as number | undefined;
		if (!page || !this.#lastQuery) {
			return;
		}

		try {
			const response = await this.#client().tokenAddresses({
				...this.#lastQuery,
				page: page,
			});

			const items = response.items();

			if (items.length === 0) {
				return;
			}

			for (const item of items) {
				this.#addressToPage.set(item.address(), page);
			}

			this.#walletTokensCollection.transform((token: WalletToken) => {
				const item = items.find((item) => item.address() === token.address());
				return item
					? new WalletToken({
							network: this.#profile.activeNetwork(),
							profile: this.#profile,
							token: token.token(),
							walletToken: new WalletTokenDTO({
								address: item.address(),
								balance: item.balanceRaw(),
								tokenAddress: item.token().address(),
							}),
						})
					: token;
			});
		} catch {
			return;
		}
	}
}
