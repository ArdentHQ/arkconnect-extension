import { Contracts } from '.';
import { Networks } from '@/lib/mainsail';
import { Paginator } from '@/lib/mainsail/collections';
import { ClientService } from '@/lib/mainsail/client.service';
import { TokenTransfersQuery, WalletTokensQuery } from '@/lib/mainsail/client.contract';
import { ConfirmedTransactionData } from '@/lib/mainsail/confirmed-transaction.dto';
import { ExtendedConfirmedTransactionData } from '@/lib/profiles/transaction.dto';
import { ExtendedConfirmedTransactionDataCollection } from '@/lib/profiles/transaction.collection';
import { WalletToken } from './wallet-token';
import { WalletTokenDTO } from './wallet-token.dto';
import { BigNumber } from '@/lib/helpers';
import { ProfileSetting } from './profile.enum.contract';

export class TokenService {
    #profile: Contracts.IProfile;
    #network: Networks.Network;
    #dustBalanceThreshold = '0.01';
    #walletTokensCollection: Paginator<WalletToken>;
    #lastQuery: WalletTokensQuery | undefined;
    #addressToPage: Map<string, string | number | undefined>;

    public constructor({
        profile,
        network,
    }: {
        profile: Contracts.IProfile;
        network: Networks.Network;
    }) {
        this.#profile = profile;
        this.#network = network;
        this.#walletTokensCollection = new Paginator<WalletToken>([], {
            last: undefined,
            next: 0,
            prev: undefined,
            self: undefined,
            totalCount: undefined,
        });
        this.#addressToPage = new Map();
    }

    public async sync(query?: WalletTokensQuery): Promise<void> {
        await this.#syncTokenAddresses(query);
        const walletTokens = this.#walletTokensCollection.items();

        for (const walletToken of walletTokens) {
            const wallet = this.#profile
                .wallets()
                .findByAddressWithNetwork(walletToken.address(), this.#network.id());

            wallet?.tokens().push(walletToken);
        }
    }

    selectedCount(): number {
        return this.selected().totalCount();
    }

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
                throw new Error('No address selected');
            }

            let tokensQuery: WalletTokensQuery = {
                addresses,
                minBalance: hideDustTokens ? this.#dustBalanceThreshold : '0',
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

            this.#walletTokensCollection = new Paginator<WalletToken>(
                response.items(),
                response.getPagination(),
            );
        } catch {
            this.#walletTokensCollection = new Paginator<WalletToken>([], {
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
                        balance: BigNumber.make(token.balanceRaw())
                            .plus(existing.balanceRaw())
                            .toString(),
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

    selected(): Paginator<WalletToken> {
        return this.#walletTokensCollection;
    }

    aggregated(): Paginator<WalletToken> {
        return new Paginator<WalletToken>(
            this.#aggregateTokens(this.#walletTokensCollection.items()),
            {
                last: this.#walletTokensCollection.lastPage(),
                next: this.#walletTokensCollection.nextPage(),
                prev: this.#walletTokensCollection.previousPage(),
                self: undefined,
                totalCount: this.#walletTokensCollection.totalCount(),
            },
        );
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

    #setTransactionMetadata(
        transactions: Paginator<ConfirmedTransactionData>,
        queryAddresses?: string[],
    ): void {
        for (const transaction of transactions.items()) {
            const wallet = this.#getTransactionWallet(transaction, queryAddresses);

            if (wallet) {
                transaction.setMeta('publicKey', wallet.publicKey());
                transaction.setMeta('address', wallet.address());
            }
        }
    }

    async transfers(
        query: TokenTransfersQuery | undefined = {},
    ): Promise<ExtendedConfirmedTransactionDataCollection> {
        const activeNetwork = this.#profile.activeNetwork();

        const clientService = new ClientService({
            config: activeNetwork.config(),
            profile: this.#profile,
        });

        let response: Paginator<ConfirmedTransactionData>;

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

            const queryAddresses = [...transfersQuery.from, ...(transfersQuery.to ?? [])].filter(
                (address) => !!address,
            );

            this.#setTransactionMetadata(response, queryAddresses);
        } catch {
            return new ExtendedConfirmedTransactionDataCollection([], {
                last: undefined,
                next: 0,
                prev: undefined,
                self: undefined,
                totalCount: undefined,
            });
        }

        const transfers = response.items().map((transfer) => {
            const wallet = this.#getTransactionWallet(
                transfer,
                this.#profile
                    .wallets()
                    .values()
                    .map((wallet) => wallet.address()),
            );

            return new ExtendedConfirmedTransactionData(wallet!, transfer);
        });

        return new ExtendedConfirmedTransactionDataCollection(transfers, response.getPagination());
    }

    #client(): ClientService {
        return new ClientService({
            config: this.#profile.activeNetwork().config(),
            profile: this.#profile,
        });
    }
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
