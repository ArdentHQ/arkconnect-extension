import { IdentityOptions } from './services';
import { ForbiddenMethodCallException } from './exceptions';

export type SignatoryType = 'mnemonic' | 'ledger';

export interface SignatoryData {
    type: SignatoryType;
    signingKey: string;
    address?: string;
    publicKey?: string;
    path?: string;
    options?: IdentityOptions;
}

// Mnemonic signatories are NFD-normalised; ledger paths are passed through untouched.
const isNormalised = (type: SignatoryType): boolean => type !== 'ledger';

// A single value object covering every way a transaction can be signed. The
// `type` discriminator replaces what used to be a class per signing method.
export class Signatory {
    readonly #data: SignatoryData;

    public constructor(data: SignatoryData) {
        this.#data = {
            ...data,
            signingKey: isNormalised(data.type)
                ? data.signingKey.normalize('NFD')
                : data.signingKey,
        };
    }

    public signingKey(): string {
        return this.#data.signingKey;
    }

    public address(): string | undefined {
        return this.#data.address;
    }

    public publicKey(): string | undefined {
        return this.#data.publicKey;
    }

    public path(): string {
        if (this.#data.path === undefined) {
            throw new ForbiddenMethodCallException(this.constructor.name, this.path.name);
        }

        return this.#data.path;
    }

    public actsWithMnemonic(): boolean {
        return this.#data.type === 'mnemonic';
    }

    public actsWithLedger(): boolean {
        return this.#data.type === 'ledger';
    }
}
