import { vi } from "vitest";

import { ConfirmedTransactionData } from "@/lib/mainsail/confirmed-transaction.dto";
import { ConfirmedTransactionDataCollection } from "@/lib/mainsail/transactions.collection";
import { MetaPagination } from "@/lib/mainsail/client.contract";

export const makePagination = (overrides: Partial<MetaPagination> = {}): MetaPagination => ({
	prev: undefined,
	self: undefined,
	next: undefined,
	last: undefined,
	totalCount: "0",
	...overrides,
});

export const makeTransaction = (overrides: Record<string, unknown> = {}): ConfirmedTransactionData => {
	const tx = new ConfirmedTransactionData();
	tx.configure({
		confirmations: 1,
		data: "0x",
		gas: 21000,
		gasPrice: 1,
		hash: "tx-hash-1",
		nonce: 1,
		receipt: { status: 1 },
		from: "sender-address",
		to: "recipient-address",
		...overrides,
	});
	return tx;
};

export const makeCollection = (
	transactions: ConfirmedTransactionData[] = [],
	pagination: Partial<MetaPagination> = {},
): ConfirmedTransactionDataCollection =>
	new ConfirmedTransactionDataCollection(transactions, makePagination(pagination));

export const makeWallet = (overrides: Record<string, unknown> = {}) => {
	const dataStore = new Map<string, unknown>();
	const tokenTransfers = vi.fn();

	return {
		address: vi.fn().mockReturnValue("wallet-address"),
		publicKey: vi.fn().mockReturnValue("wallet-public-key"),
		isCold: vi.fn().mockReturnValue(false),
		client: vi.fn().mockReturnValue({ tokenTransfers }),
		data: vi.fn().mockReturnValue({
			get: (key: string) => dataStore.get(key),
			set: (key: string, value: unknown) => dataStore.set(key, value),
		}),
		currency: vi.fn().mockReturnValue("ARK"),
		exchangeCurrency: vi.fn().mockReturnValue("USD"),
		link: vi.fn().mockReturnValue({
			transaction: (hash: string) => `https://explorer.example.com/tx/${hash}`,
			block: (hash: string) => `https://explorer.example.com/block/${hash}`,
		}),
		exchangeRates: vi.fn().mockReturnValue({
			exchange: () => ({ toString: () => "0" }),
		}),
		_dataStore: dataStore,
		_tokenTransfers: tokenTransfers,
		...overrides,
	} as any;
};
