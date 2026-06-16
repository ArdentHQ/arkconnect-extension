export interface AddressDataTransferObject {
    type: 'bip39' | 'bip44' | 'bip49' | 'bip84' | 'ss58' | 'rfc6979' | 'bip44.legacy' | 'lip17';
    address: string;
    path?: string;
}

export interface AddressService {
    fromMnemonic(mnemonic: string): AddressDataTransferObject;
    fromPublicKey(publicKey: string): AddressDataTransferObject;
    fromPrivateKey(privateKey: string): AddressDataTransferObject;
    fromSecret(secret: string): AddressDataTransferObject;
    validate(address: string): boolean;
}
