import { Networks } from '@/lib/mainsail';

export * from './authenticator.contract.js';
export * from './data.repository.contract.js';
export * from './password.contract.js';
export * from './profile.contract.js';
export * from './profile.enum.contract.js';
export * from './profile.status.contract.js';

export type Host = Networks.NetworkHost;
export type HostSet = { name: string; host: Host }[];
export type HostMap = Record<string, HostSet>;

export interface IHostRepository {
    all(): Record<string, HostMap>;
    allByNetwork(network: string): HostSet;
    push(data: { host: Host; name: string; network: string }): HostSet;
    fill(entries: object): void;
    forget(network: string, index?: number): void;
}

export type Network = Networks.NetworkManifest;
export type NetworkMap = Record<string, Network>;

export interface INetworkRepository {
    all(): NetworkMap;
    allByCoin(coin: string): Network[];
    get(network: string): Network;
    push(host: Network): Network;
    fill(entries: object): void;
    forget(network: string): void;
}

export * from './read-only-wallet.contract.js';
export * from './setting.repository.contract.js';
export * from './signatory.factory.contract.js';
export * from './transaction-index.contract.js';
export * from './vote-registry.contract.js';
export * from './wallet.contract.js';
export * from './wallet.enum'; // @TODO
export * from './wallet.factory.contract.js';
export * from './wallet.mutator.contract.js';
export * from './wallet.repository.contract.js';
export * from './wallet.synchroniser.contract.js';
export * from './wallet-transaction.service.contract.js';
export * from './wif.contract.js';
