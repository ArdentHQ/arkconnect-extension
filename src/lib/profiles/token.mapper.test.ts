import { describe, expect, it } from "vitest";

import { ConfirmedTransactionData } from "@/lib/mainsail/confirmed-transaction.dto";
import { ExtendedConfirmedTransactionData } from "./transaction.dto";
import { ExtendedConfirmedTransactionDataCollection } from "./transaction.collection";
import { transformTokenTransferData, transformTokenTransferDataCollection } from "./token.mapper";
import { makeCollection, makePagination, makeTransaction, makeWallet } from "./token.test-fixtures";

describe("transformTokenTransferData", () => {
	it("wraps a ConfirmedTransactionData in an ExtendedConfirmedTransactionData", () => {
		const result = transformTokenTransferData(makeWallet(), makeTransaction());

		expect(result).toBeInstanceOf(ExtendedConfirmedTransactionData);
		expect(result.hash()).toBe("tx-hash-1");
	});

	it("associates the wallet with the resulting extended transaction", () => {
		const wallet = makeWallet();
		const result = transformTokenTransferData(wallet, makeTransaction());

		expect(result.wallet()).toBe(wallet);
	});
});

describe("transformTokenTransferDataCollection", () => {
	it("maps all transactions in the collection", () => {
		const tx1 = makeTransaction();
		const tx2 = new ConfirmedTransactionData();
		tx2.configure({
			confirmations: 1,
			data: "0x",
			gas: 0,
			gasPrice: 0,
			hash: "tx-hash-2",
			nonce: 2,
			receipt: { status: 1 },
			from: "sender-address",
			to: "recipient-address",
		});

		const result = transformTokenTransferDataCollection(makeWallet(), makeCollection([tx1, tx2]));

		expect(result).toBeInstanceOf(ExtendedConfirmedTransactionDataCollection);
		expect(result.items()).toHaveLength(2);
		expect(result.items()[0]).toBeInstanceOf(ExtendedConfirmedTransactionData);
		expect(result.items()[0].hash()).toBe("tx-hash-1");
		expect(result.items()[1].hash()).toBe("tx-hash-2");
	});

	it("preserves pagination from the source collection", () => {
		const pagination = { next: "page-2", last: "page-5", totalCount: "50" };
		const result = transformTokenTransferDataCollection(
			makeWallet(),
			makeCollection([makeTransaction()], pagination),
		);

		expect(result.getPagination()).toStrictEqual(makePagination(pagination));
	});

	it("returns an empty collection when the source has no transactions", () => {
		const result = transformTokenTransferDataCollection(makeWallet(), makeCollection());

		expect(result.items()).toHaveLength(0);
		expect(result.isEmpty()).toBe(true);
	});
});
