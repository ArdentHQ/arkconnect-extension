/* eslint-disable sonarjs/cognitive-complexity */

import { Collections, Contracts, DTO, Services } from '@/lib/mainsail';
import { ConfigKey, ConfigRepository } from '@/lib/mainsail';
import {
    Helpers,
    TransactionFunctionSigs,
    TransactionTypeIdentifier,
} from '@arkecosystem/typescript-crypto';
import { TokenAddressesData, WalletTokenData } from '@/lib/profiles/token.contracts';

import { Client } from '@arkecosystem/typescript-client';
import { ConfirmedTransactionData } from './confirmed-transaction.dto';
import { DateTime } from '@/lib/intl';
import { IProfile } from '@/lib/profiles/profile.contract';
import { Paginator } from '@/lib/mainsail/collections';
import { SignedTransactionData } from './signed-transaction.dto';
import { TokenDTO } from '@/lib/profiles/token.dto';
import { TokenRepository } from '@/lib/profiles/token.repository';
import { TokenTransfersQuery } from '@/lib/mainsail/client.contract';
import { UnconfirmedTransactionData } from './unconfirmed-transaction.dto';
import { WalletData } from './wallet.dto';
import { WalletToken } from '@/lib/profiles/wallet-token';
import { WalletTokenDTO } from '@/lib/profiles/wallet-token.dto';
import dotify from 'node-dotify';

type searchParams<T extends Record<string, any> = {}> = T & { page: number; limit?: number };

export class ClientService {
    readonly #client!: Client;
    #config: ConfigRepository;
    #profile: IProfile;

    public constructor({ config, profile }: { config: ConfigRepository; profile: IProfile }) {
        this.#config = config;
        this.#profile = profile;

        const api = config.host('full', profile);
        const evm = config.host('evm', profile);
        const transactions = config.host('tx', profile);

        this.#client = new Client({
            api,
            evm,
            transactions,
        });
    }

    public async transaction(
        id: string,
        query?: Record<string, string | number | boolean | null>,
    ): Promise<ConfirmedTransactionData> {
        const body = await this.#client.transactions().get(id, {
            ...query,
            includeTokens: true,
        });
        return new ConfirmedTransactionData().configure(body.data);
    }

    public async tokens(): Promise<TokenRepository> {
        const response = await this.#client.tokens().all();
        const tokens = new TokenRepository();
        tokens.fill(response.data);
        return tokens;
    }

    public async tokenAddresses(query: Services.WalletTokensQuery): Promise<Paginator<WalletToken>> {
        const response = await this.#client.wallets().tokens(query);

        const walletTokens = response.data.map((tokenAddresses: TokenAddressesData) => {
            const token = new TokenDTO({
                address: tokenAddresses.token,
                decimals: tokenAddresses.decimals,
                deploymentHash: '',
                name: tokenAddresses.name,
                symbol: tokenAddresses.symbol,
                totalSupply: tokenAddresses.supply,
            });

            const walletTokens: WalletTokenDTO[] = [];

            for (const [walletAddress, balance] of Object.entries(tokenAddresses.addresses)) {
                walletTokens.push(
                    new WalletTokenDTO({
                        address: walletAddress,
                        balance,
                        tokenAddress: tokenAddresses.token,
                    }),
                );
            }

            return walletTokens.map(
                (walletToken) =>
                    new WalletToken({
                        network: this.#profile.activeNetwork(),
                        profile: this.#profile,
                        token,
                        walletToken,
                    }),
            );
        }) as Array<WalletToken[]>;

        return new Paginator<WalletToken>(walletTokens.flat(), this.#createMetaPagination(response));
    }

    public async walletTokens(address: string): Promise<WalletTokenDTO[]> {
        const response = await this.#client.wallets().tokensFor(address);
        return response.data.map((tokenData: WalletTokenData) => new WalletTokenDTO(tokenData));
    }

    public async tokenHolders(contractAddress: string): Promise<TokenRepository> {
        const response = await this.#client.tokens().holdersFor(contractAddress);
        const holders = new TokenRepository();
        holders.fill(response.results);
        return holders;
    }

    public async tokenByContractAddress(contractAddress: string): Promise<TokenDTO> {
        const response = await this.#client.tokens().whitelist(contractAddress);
        return new TokenDTO(response.data);
    }

    public async tokenTransfers(
        query?: TokenTransfersQuery,
    ): Promise<Paginator<ConfirmedTransactionData>> {
        const response = await this.#client.tokens().transfers({
            ...query,
            from: query?.from?.join(','),
            to: query?.to?.join(','),
        });

        return new Paginator<ConfirmedTransactionData>(
            response.data.map((transfer) =>
                new ConfirmedTransactionData().configure({
                    confirmations: 1,
                    data: transfer.functionSig,
                    gas: 0,
                    gasPrice: 0,
                    hash: transfer.transactionHash,
                    nonce: 0,
                    receipt: {
                        status: 1,
                    },
                    ...transfer,
                    to: TransactionTypeIdentifier.isTokenTransfer(transfer.functionSig)
                        ? transfer.to
                        : undefined,
                    tokens: [
                        {
                            from: transfer.from,
                            index: 0,
                            metadata: {
                                tokenAddress: transfer.token.address,
                                tokenDecimals: transfer.token.decimals,
                                tokenName: transfer.token.name,
                                tokenSymbol: transfer.token.symbol,
                            },
                            to: transfer.to,
                            value: transfer.value,
                        },
                    ],
                }),
            ),
            this.#createMetaPagination(response),
        );
    }

    public async transactions(
        query: Services.ClientTransactionsInput,
    ): Promise<Paginator<ConfirmedTransactionData>> {
        const { searchParams } = this.#createSearchParams(query);
        const { limit = 10, page = 1, ...parameters } = searchParams;

        const response = await this.#client.transactions().all({ ...parameters, limit, page });

        return new Paginator<ConfirmedTransactionData>(
            response.data.map((transaction) =>
                new ConfirmedTransactionData().configure(transaction),
            ),
            this.#createMetaPagination(response),
        );
    }

    public async unconfirmedTransactions(
        query: Services.ClientTransactionsInput = {},
    ): Promise<Paginator<UnconfirmedTransactionData>> {
        const { searchParams } = this.#createSearchParams(query);
        const { limit = 10, page = 1, ...parameters } = searchParams;

        const response = await this.#client
            .transactions()
            .allUnconfirmed({ ...parameters, limit, page });

        return new Paginator<UnconfirmedTransactionData>(
            response.data.map((transaction) =>
                new UnconfirmedTransactionData().configure(transaction),
            ),
            this.#createMetaPagination(response),
        );
    }

    public async wallet(id: Services.WalletIdentifier): Promise<Contracts.WalletData> {
        const body = await this.#client.wallets().get(id.value);
        return new WalletData({ config: this.#config }).fill(body.data);
    }

    public async wallets(
        query: Services.ClientWalletsInput,
    ): Promise<Paginator<WalletData>> {
        const { searchParams } = this.#createSearchParams(query);
        const { limit = 10, page = 1 } = searchParams;

        const response = await this.#client.wallets().all({ limit, page });

        return new Paginator<WalletData>(
            response.data.map((wallet) => new WalletData({ config: this.#config }).fill(wallet)),
            this.#createMetaPagination(response),
        );
    }

    public async validator(id: string): Promise<Contracts.WalletData> {
        const body = await this.#client.validators().get(id);
        return new WalletData({ config: this.#config }).fill(body.data);
    }

    public async validators(
        query?: Contracts.KeyValuePair,
    ): Promise<Paginator<WalletData>> {
        const { searchParams } = this.#createSearchParams(query ?? {});
        const { limit = 10, page = 1, ...parameters } = searchParams;

        const body = await this.#client.validators().all({ ...parameters, limit, page });

        return new Paginator<WalletData>(
            body.data.map((wallet) => new WalletData({ config: this.#config }).fill(wallet)),
            this.#createMetaPagination(body),
        );
    }

    public async votes(id: string): Promise<Services.VoteReport> {
        const { data } = await this.#client.wallets().get(id);

        const vote = data.vote || data.attributes?.vote;
        const hasVoted = vote !== undefined;

        return {
            available: hasVoted ? 0 : 1,
            used: hasVoted ? 1 : 0,
            votes: hasVoted
                ? [
                      {
                          amount: 0,
                          id: vote,
                      },
                  ]
                : [],
        };
    }

    public async broadcast(
        transactions: SignedTransactionData[],
    ): Promise<Services.BroadcastResponse> {
        const transactionToBroadcast: any[] = [];

        for (const transaction of transactions) {
            const data = await transaction.toBroadcast();
            transactionToBroadcast.push(data);
        }

        let response: Contracts.KeyValuePair;

        try {
            response = await this.#client
                .transactions()
                .create({ transactions: transactionToBroadcast });
        } catch (error) {
            response = error.response.json();
        }

        const { data, errors } = response;

        const result: Services.BroadcastResponse = {
            accepted: [],
            errors: {},
            rejected: [],
        };

        if (Array.isArray(data.accept)) {
            for (const acceptedIndex of data.accept) {
                result.accepted.push(transactions[acceptedIndex]?.hash());
            }
        }

        if (Array.isArray(data.invalid)) {
            for (const rejected of data.invalid) {
                result.rejected.push(transactions[rejected]?.hash());
            }
        }

        if (errors) {
            const responseErrors: [string, { message: string }][] = Object.entries(errors);

            for (const [key, value] of responseErrors) {
                if (Array.isArray(value)) {
                    result.errors[key] = value[0].message;
                } else {
                    result.errors[key] = value.message;
                }
            }
        }

        return result;
    }

    public async evmCall(callData: Contracts.EvmCallData): Promise<Contracts.EvmCallResponse> {
        try {
            // @ts-ignore
            const response = await this.#client.evm().call({
                id: 1,
                method: 'eth_call',
                params: [callData, 'latest'],
            });

            return {
                id: response.id,
                jsonrpc: response.jsonrpc,
                result: response.result,
            };
        } catch (error) {
            const errorResponse = error.response?.json();
            throw new Error(errorResponse?.error?.message || 'Failed to make EVM call');
        }
    }

    #createMetaPagination(body): Services.MetaPagination {
        const getPage = (url: string): string | undefined => {
            const match: RegExpExecArray | null = new RegExp(/page=(\d+)/).exec(url);

            return match?.[1] || undefined;
        };

        return {
            last: getPage(body.meta.last) || undefined,
            next: getPage(body.meta.next) || undefined,
            prev: getPage(body.meta.previous) || undefined,
            self: getPage(body.meta.self) || undefined,
            totalCount: body.meta.totalCount || undefined,
        };
    }

    #createSearchParams(body: Services.ClientTransactionsInput): {
        body: object | null;
        searchParams: searchParams;
    } {
        if (Object.keys(body).length <= 0) {
            return { body: null, searchParams: { limit: 10, page: 1 } };
        }

        const result: any = {
            body,
            searchParams: {
                limit: 10,
                page: 1,
            },
        };

        const mappings: Record<string, string> = {
            address: 'address',
            cursor: 'page',
            from: 'from',
            limit: 'limit',
            memo: 'vendorField',
            orderBy: 'orderBy',
            senderPublicKey: 'senderPublicKey',
            to: 'to',
        };

        for (const [alias, original] of Object.entries(mappings)) {
            if (body[alias]) {
                result.searchParams[original] = body[alias];

                delete result.body[alias];
            }
        }

        if (body.identifiers) {
            const identifiers: Services.WalletIdentifier[] = body.identifiers;

            const addresses = identifiers.map(({ value }) => value).join(',');
            if (addresses.length > 0) {
                result.searchParams.address = addresses;
            }

            // @ts-ignore
            delete body.identifiers;
        }

        const transactionTypeMap: Record<string, string | undefined> = {
            multiPayment: TransactionFunctionSigs.MultiPayment,
            transfer: TransactionFunctionSigs.Transfer,
            updateValidator: TransactionFunctionSigs.UpdateValidator,
            usernameRegistration: TransactionFunctionSigs.RegisterUsername,
            usernameResignation: TransactionFunctionSigs.ResignUsername,
            validatorRegistration: TransactionFunctionSigs.RegisterValidator,
            validatorResignation: TransactionFunctionSigs.ResignValidator,
            vote: [
                Helpers.removeLeadingHexZero(TransactionFunctionSigs.Vote),
                Helpers.removeLeadingHexZero(TransactionFunctionSigs.Unvote),
            ].join(','),
        };

        // @ts-ignore
        if (body.type) {
            const data = transactionTypeMap[body.type];
            if (data !== undefined) {
                result.searchParams.data = Helpers.removeLeadingHexZero(data);
            }

            delete body.type;
        }

        if (body.types) {
            const data: string[] = [];

            for (const type of body.types) {
                const datum = transactionTypeMap[type];

                // a transfer is an empty string, so explicitly check for undefined
                if (datum !== undefined) {
                    data.push(Helpers.removeLeadingHexZero(datum));
                }
            }

            if (data.length > 0) {
                result.searchParams.data = data.join(',');
            }

            delete body.types;
        }

        if (body.timestamp) {
            const normalizeTimestamps = (timestamp: Services.RangeCriteria) => {
                const epoch: string = this.#config.get<string>(ConfigKey.Epoch);

                const normalized = { ...timestamp };

                if (epoch) {
                    for (const [key, value] of Object.entries(normalized)) {
                        normalized[key] = Math.max(value - DateTime.make(epoch).toUNIX(), 0);
                    }
                }

                return normalized;
            };

            const normalized = normalizeTimestamps(body.timestamp);

            result.searchParams.timestamp = normalized;
            delete body.timestamp;
        }

        result.searchParams = dotify({ ...result.searchParams, ...result.body });
        result.body = null;

        return result;
    }
}
