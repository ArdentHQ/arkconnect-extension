import { Networks } from "@/lib/mainsail";

export type Network = Networks.NetworkManifest;
export type NetworkMap = Record<string, Network>;

export interface INetworkRepository {
	all(): NetworkMap;

	fill(entries: object): void;
}
