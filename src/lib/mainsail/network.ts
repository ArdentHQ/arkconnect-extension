import { CoinManifest, NetworkManifest } from "./network.models";
import { ConfigRepository } from ".";

import { Client } from "@arkecosystem/typescript-client";
import { Contracts } from "@/lib/profiles";
import { FeeService } from "./fee.service";
import { get } from "@/lib/helpers";

export class Network {
	/**
	 * The coin of the network.
	 *
	 * @memberof Network
	 */
	readonly #coin: CoinManifest;

	/**
	 * The profile associated with fees config.
	 *
	 * @memberof Network
	 */
	readonly #profile: Contracts.IProfile;

	/**
	 * The fee service instance.
	 *
	 * @memberof Network
	 */
	readonly #feeService: FeeService;

	/**
	 * The manifest of the network.
	 *
	 * @memberof Network
	 */
	readonly #network: NetworkManifest;

	/**
	 * The config of the network.
	 *
	 * @memberof Network
	 */
	readonly #config: ConfigRepository;

	/**
	 * Create a new Network instance.
	 *
	 * @param {string} coin
	 * @param {NetworkManifest} network
	 * @memberof Network
	 */
	public constructor(coin: CoinManifest, network: NetworkManifest, profile: Contracts.IProfile) {
		this.#coin = coin;
		this.#network = network;
		this.#profile = profile;
		this.#config = new ConfigRepository({ network });
		this.#feeService = new FeeService({ config: this.#config, profile: this.#profile });
	}

	/**
	 * Get the parent coin of the network.
	 */
	public coin(): string {
		return this.#coin.name;
	}

	/**
	 * Get the coin of the network.
	 */
	public coinName(): string {
		return this.#network.coin;
	}

	/**
	 * Get the ID of the network.
	 */
	public id(): string {
		return this.#network.id;
	}

	/**
	 * Get the name of the network.
	 */
	public name(): string {
		return this.#network.name;
	}

	/**
	 * Get the display name of the network.
	 */
	public displayName(): string {
		if (this.isLive()) {
			return this.coinName();
		}

		return `${this.coinName()} ${this.name()}`;
	}

	/**
	 * Get the ticker of the coin that is used.
	 */
	public ticker(): string {
		return this.#network.currency.ticker;
	}

	/**
	 * Get the symbol of the coin that is used.
	 */
	public symbol(): string {
		return this.#network.currency.symbol;
	}

	/**
	 * Determine if this is a production network.
	 */
	public isLive(): boolean {
		return this.#network.type === "live";
	}

	/**
	 * Determine if this is a development network.
	 */
	public isTest(): boolean {
		return this.#network.type === "test";
	}

	/**
	 * Determine if voting is supported on this network.
	 */
	public allowsVoting(): boolean {
		return get(this.#network, "governance") !== undefined;
	}

	/**
	 * Get the number of delegates that forge blocks.
	 */
	public validatorCount(): number {
		return get(this.#network, "governance.validatorCount", 0);
	}

	/**
	 * Get the property by which validators are identified for voting.
	 */
	public validatorIdentifier(): string {
		return get(this.#network, "governance.validatorIdentifier", "publicKey");
	}

	/**
	 * Determine if the network uses an extended public key for derivation.
	 */
	public usesExtendedPublicKey(): boolean {
		return get(this.#network, "meta.extendedPublicKey") === true;
	}

	/**
	 * Determine if the given feature is enabled.
	 *
	 * @param feature
	 */
	public allows(feature: string): boolean {
		if (!feature) {
			return false;
		}

		const [root, ...child] = feature.split(".");

		const features: string[] = get(this.#network.featureFlags, root);

		if (Array.isArray(features)) {
			return features.includes(child.join("."));
		}

		return false;
	}

	/**
	 * Determine if the given feature is disabled.
	 *
	 * @param feature
	 */
	public denies(feature: string): boolean {
		return !this.allows(feature);
	}

	/**
	 * Returns the meta data of the network.
	 *
	 * @return {*}  {Record<string, any>}
	 * @memberof Network
	 */
	public meta(): Record<string, any> {
		return get(this.#network, "meta", {});
	}

	/**
	 * Returns the number of words for newly generated BIP39 phrases.
	 *
	 * @return {*}  {number}
	 * @memberof Network
	 */
	public wordCount(): number {
		return get(this.#network, "constants.bip39.wordCount", 24);
	}

	/**
	 * Returns the config repository of the network.
	 *
	 * @memberof Network
	 * @returns {ConfigRepository}
	 */
	public config(): ConfigRepository {
		return this.#config;
	}

	/**
	 * Updates block number & crypto config from network.
	 *
	 * @memberof Network
	 * @returns {Promise<void>}
	 */
	public async sync(): Promise<void> {
		const host = this.#network.hosts.find((host) => host.type === "full");

		if (!host) {
			throw new Error(`Expected network host to be a url but received ${typeof host}`);
		}

		const client = new Client(host.host);
		const [crypto, status] = await Promise.all([client.node().crypto(), client.node().syncing()]);

		const dataCrypto = crypto.data;
		const { blockNumber } = status.data;

		this.config().set("height", blockNumber);
		this.config().set("crypto", dataCrypto);
	}

	public milestone(height?: number): { [key: string]: any } {
		const currentHeight = this.config().get("height") as number;
		const crypto = this.config().get("crypto") as Record<string, any>;

		const milestones = crypto.milestones.sort((a, b) => a.height - b.height);
		const milestone = {
			data: milestones[0],
			index: 0,
		};

		if (!milestone.data) {
			throw new Error("Milestone not found.");
		}

		if (!height && currentHeight) {
			height = currentHeight;
		}

		if (!height) {
			height = 1;
		}

		while (milestone.index < milestones.length - 1 && height >= milestones[milestone.index + 1].height) {
			milestone.index++;
			milestone.data = milestones[milestone.index];
		}

		while (height < milestones[milestone.index].height) {
			milestone.index--;
			milestone.data = milestones[milestone.index];
		}

		return milestone.data;
	}
	/**
	 * Returns the fee service of the network.
	 *
	 * @returns {FeeService}
	 * @memberof Network
	 */
	fees(): FeeService {
		return this.#feeService;
	}

	/**
	 * Returns the block time.
	 *
	 * @returns {number}
	 * @memberof Network
	 */
	blockTime(): number {
		return get(this.milestone(), "timeouts.blockTime");
	}
}
