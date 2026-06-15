import { IReadOnlyWallet } from './contracts.js';
import { Avatar } from './helpers/avatar.js';
import { Contracts } from './index.js';
import { WalletAliasProvider } from './profile.wallet.alias.js';

export interface ROWallet {
    address: string;
    publicKey?: string;
    username?: string;
    rank?: number;
    explorerLink: string;
    isValidator: boolean;
    isResignedValidator: boolean;
    isLegacyValidator: boolean;
    governanceIdentifier: string;
}

export class ReadOnlyWallet implements IReadOnlyWallet {
    readonly #wallet: ROWallet;
    readonly #profile: Contracts.IProfile;

    public constructor(wallet: ROWallet, profile: Contracts.IProfile) {
        this.#wallet = wallet;
        this.#profile = profile;
    }

    public address(): string {
        return this.#wallet.address;
    }

    public alias(): string | undefined {
        return (
            new WalletAliasProvider(this.#profile).findAliasByAddress(this.address()) ??
            this.address()
        );
    }

    public publicKey(): string | undefined {
        return this.#wallet.publicKey;
    }

    public username(): string | undefined {
        return this.#wallet.username;
    }

    public rank(): number | undefined {
        return this.#wallet.rank;
    }

    public avatar(): string {
        return Avatar.make(this.address());
    }

    public explorerLink(): string {
        return this.#wallet.explorerLink;
    }

    public isValidator(): boolean {
        return this.#wallet.isValidator;
    }

    public isLegacyValidator(): boolean {
        return this.#wallet.isLegacyValidator;
    }

    public isResignedValidator(): boolean {
        return this.#wallet.isResignedValidator;
    }

    public governanceIdentifier(): string {
        if (this.#wallet.governanceIdentifier === 'address') {
            return this.address();
        }

        return this.publicKey()!;
    }
}
