import { ConfirmedTransactionDataCollection } from "@/lib/mainsail/transactions.collection";

import { IReadWriteWallet } from "./contracts";
import { ExtendedConfirmedTransactionDataCollection } from "./transaction.collection";
import { ExtendedConfirmedTransactionData } from "./transaction.dto";
import { ConfirmedTransactionData } from "@/lib/mainsail/confirmed-transaction.dto";

export const transformTokenTransferData = (
	wallet: IReadWriteWallet,
	transaction: ConfirmedTransactionData,
): ExtendedConfirmedTransactionData => new ExtendedConfirmedTransactionData(wallet, transaction);

export const transformTokenTransferDataCollection = (
	wallet: IReadWriteWallet,
	transactions: ConfirmedTransactionDataCollection,
): ExtendedConfirmedTransactionDataCollection =>
	new ExtendedConfirmedTransactionDataCollection(
		transactions
			.items()
			.map((transaction: ConfirmedTransactionData) => transformTokenTransferData(wallet, transaction)),
		transactions.getPagination(),
	);
