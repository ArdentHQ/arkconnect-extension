import { Signatories } from '@/lib/mainsail';

export interface SignatoryInput {
    encryptionPassword?: string;
    mnemonic?: string;
}

export interface ISignatoryFactory {
    make(input: SignatoryInput): Promise<Signatories.Signatory>;
    fromSigningKeys(input?: {
        key?: string;
        encryptionPassword?: string;
    }): Promise<Signatories.Signatory>;
}
