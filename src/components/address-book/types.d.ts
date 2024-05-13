export type ContactFormik = {
    name: string;
    address: string;
};

export type ValidateAddressResponse = {
    isValid: boolean;
    network?: WalletNetwork;
};