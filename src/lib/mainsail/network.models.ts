import { ConfigRepository } from "./config.repository";

export type NetworkHostType = "full" | "tx" | "musig" | "archival" | "explorer" | "evm";

export type TransactionType =
	| "usernameRegistration"
	| "usernameResignation"
	| "validatorResignation"
	| "validatorRegistration"
	| "updateValidator"
	| "multiPayment"
	| "transfer"
	| "vote";

export interface NetworkHost {
	id?: string;
	type: NetworkHostType;
	host: string;
	custom?: boolean;
	failedCount?: number;
	height?: number;
	query?: Record<string, string>;
	enabled?: boolean;
}

export type NetworkHostSelector = (configRepository: ConfigRepository, type?: NetworkHostType) => NetworkHost;

export interface NetworkManifestFeatureFlags {
	Address?: AddressMethods;
}

export interface NetworkManifestConstants {
	epoch?: string;
	slip44: number;
	slip44Legacy: number;
	slip44Eth: number;
	bech32?: string;
	bip32?: {
		private: number;
		public: number;
	};
	bip39?: {
		wordCount: number;
	};
	wif?: number;
}

export interface NetworkManifest {
	id: string;
	type: string;
	name: string;
	coin: string;
	currency: {
		ticker: string;
		symbol: string;
		decimals?: number;
	};
	hosts: NetworkHost[];
	constants: NetworkManifestConstants;
	governance?: {
		validatorIdentifier?: "address" | "publicKey";
		validatorCount: number;
		votesPerWallet: number;
		votesPerTransaction: number;
	};
	knownWallets?: string;
	featureFlags: NetworkManifestFeatureFlags;
	meta?: Record<string, any>;
}

export type AddressMethod =
	| "mnemonic.bip39"
	| "mnemonic.bip44"
	| "mnemonic.bip49"
	| "mnemonic.bip84"
	| "privateKey"
	| "publicKey"
	| "secret"
	| "validate"
	| "wif";
export type AddressMethods = AddressMethod[];
