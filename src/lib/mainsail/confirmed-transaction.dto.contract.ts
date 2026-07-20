import { BigNumber } from "@/lib/helpers";
import { DateTime } from "@/lib/intl";
import { TransactionToken } from "@/lib/profiles/transaction-token";

export interface MultiPaymentRecipient {
	address: string;
	amount: BigNumber;
}

export interface MultiPaymentItem {
	recipientId: string;
	amount: BigNumber;
}

export interface UnspentTransactionData {
	hash(): string;

	timestamp(): string;

	value(): BigNumber;

	address(): string;
}

export interface ApproveDetails {
	address: string;
	amount: bigint;
}

export interface ConfirmedTransactionData {
	configure(data: any): ConfirmedTransactionData;

	withDecimals(decimals?: number | string): ConfirmedTransactionData;

	hash(): string;

	blockHash(): string | undefined;

	type(): string;

	timestamp(): DateTime | undefined;

	confirmations(): BigNumber;

	from(): string;

	senders(): MultiPaymentRecipient[];

	to(): string;

	recipients(): MultiPaymentRecipient[];

	value(): BigNumber;

	fee(): BigNumber;

	nonce(): BigNumber;

	inputs(): UnspentTransactionData[];

	outputs(): UnspentTransactionData[];

	token(): TransactionToken | undefined;

	tokens(): TransactionToken[] | undefined;

	isConfirmed(): boolean;

	isReturn(): boolean;

	isSent(): boolean;

	isReceived(): boolean;

	isTransfer(): boolean;

	isUsernameRegistration(): boolean;

	isUsernameResignation(): boolean;

	isValidatorRegistration(): boolean;

	isVote(): boolean;

	isUnvote(): boolean;

	isMultiPayment(): boolean;

	isValidatorResignation(): boolean;

	// Second-Signature Registration
	secondPublicKey(): string;

	username(): string;

	validatorPublicKey(): string;

	approveDetails(): ApproveDetails;

	// Vote
	votes(): string[];

	unvotes(): string[];

	// Multi-Signature Registration
	publicKeys(): string[];

	min(): number;

	// Multi-Payment
	payments(): MultiPaymentItem[];

	methodHash(): string;

	expirationType(): number;

	expirationValue(): number;

	toObject(): Record<string, any>;

	toJSON(): Record<string, any>;

	toHuman(): Record<string, any>;

	hasPassed(): boolean;

	hasFailed(): boolean;

	normalizeData(): void;

	isSuccess(): boolean;
}

export type ConfirmedTransactionDataCollection = ConfirmedTransactionData[];
