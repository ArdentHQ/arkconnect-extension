import { describe, expect, it, vi } from "vitest";

import { ConfirmedTransactionDataCollection } from "@/lib/mainsail/transactions.collection";
import { TokenIndex } from "./token-index";
import { WalletData, WalletFlag } from "./wallet.enum";
import { makeCollection, makeTransaction, makeWallet } from "./token.test-fixtures";

describe("TokenIndex", () => {
	describe("all", () => {
		it("fetches token transfers for the wallet address", async () => {
			const wallet = makeWallet();
			wallet._tokenTransfers.mockResolvedValue(makeCollection());

			await new TokenIndex(wallet).all();

			expect(wallet._tokenTransfers).toHaveBeenCalledWith(
				expect.objectContaining({
					addresses: ["wallet-address"],
					ignoreWhitelist: true,
				}),
			);
		});

		it("merges a custom query with the wallet address", async () => {
			const wallet = makeWallet();
			wallet._tokenTransfers.mockResolvedValue(makeCollection());

			await new TokenIndex(wallet).all({ page: 2, limit: 5 });

			expect(wallet._tokenTransfers).toHaveBeenCalledWith(
				expect.objectContaining({
					addresses: ["wallet-address"],
					ignoreWhitelist: true,
					page: 2,
					limit: 5,
				}),
			);
		});

		it("returns a ConfirmedTransactionDataCollection", async () => {
			const wallet = makeWallet();
			wallet._tokenTransfers.mockResolvedValue(makeCollection([makeTransaction()]));

			const result = await new TokenIndex(wallet).all();

			expect(result).toBeInstanceOf(ConfirmedTransactionDataCollection);
			expect(result.items()).toHaveLength(1);
		});

		it("associates the wallet with each transaction", async () => {
			const wallet = makeWallet();
			const tx = makeTransaction();
			wallet._tokenTransfers.mockResolvedValue(makeCollection([tx]));

			await new TokenIndex(wallet).all();

			expect(tx.wallet()).toBe(wallet);
		});

		it("does not change wallet status when wallet is not cold", async () => {
			const wallet = makeWallet();
			wallet.isCold.mockReturnValue(false);
			const tx = makeTransaction();
			vi.spyOn(tx, "isSent").mockReturnValue(true);
			wallet._tokenTransfers.mockResolvedValue(makeCollection([tx]));

			await new TokenIndex(wallet).all();

			expect(wallet._dataStore.get(WalletData.Status)).toBeUndefined();
		});

		it("promotes a cold wallet to Hot when it has sent transactions", async () => {
			const wallet = makeWallet();
			wallet.isCold.mockReturnValue(true);
			const tx = makeTransaction();
			vi.spyOn(tx, "isSent").mockReturnValue(true);
			vi.spyOn(tx, "isReturn").mockReturnValue(false);
			wallet._tokenTransfers.mockResolvedValue(makeCollection([tx]));

			await new TokenIndex(wallet).all();

			expect(wallet._dataStore.get(WalletData.Status)).toBe(WalletFlag.Hot);
		});

		it("promotes a cold wallet to Hot when it has return transactions", async () => {
			const wallet = makeWallet();
			wallet.isCold.mockReturnValue(true);
			const tx = makeTransaction();
			vi.spyOn(tx, "isSent").mockReturnValue(false);
			vi.spyOn(tx, "isReturn").mockReturnValue(true);
			wallet._tokenTransfers.mockResolvedValue(makeCollection([tx]));

			await new TokenIndex(wallet).all();

			expect(wallet._dataStore.get(WalletData.Status)).toBe(WalletFlag.Hot);
		});

		it("does not promote a cold wallet when it only has received transactions", async () => {
			const wallet = makeWallet();
			wallet.isCold.mockReturnValue(true);
			const tx = makeTransaction();
			vi.spyOn(tx, "isSent").mockReturnValue(false);
			vi.spyOn(tx, "isReturn").mockReturnValue(false);
			wallet._tokenTransfers.mockResolvedValue(makeCollection([tx]));

			await new TokenIndex(wallet).all();

			expect(wallet._dataStore.get(WalletData.Status)).toBeUndefined();
		});
	});
});
