import { IReadOnlyWallet } from './contracts.js';

export interface VoteRegistryItem {
    amount?: number;
    wallet?: IReadOnlyWallet;
}

export interface IVoteRegistry {
    current(): VoteRegistryItem[];

    available(): number;

    used(): number;
}
