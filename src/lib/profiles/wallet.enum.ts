export enum WalletData {
    // Identity
    Coin = 'COIN',
    Network = 'NETWORK',
    Address = 'ADDRESS',
    PublicKey = 'PUBLIC_KEY',
    // Other
    Balance = 'BALANCE',
    EncryptedSigningKey = 'ENCRYPTED_SIGNING_KEY',
    EncryptedConfirmKey = 'ENCRYPTED_CONFIRM_KEY',
    BroadcastedTransactions = 'BROADCASTED_TRANSACTIONS',
    Validators = 'VALIDATORS',
    DerivationPath = 'DERIVATION_PATH',
    DerivationType = 'DERIVATION_TYPE',
    ExchangeCurrency = 'EXCHANGE_CURRENCY',
    ImportMethod = 'IMPORT_METHOD',
    Sequence = 'SEQUENCE',
    SignedTransactions = 'SIGNED_TRANSACTIONS',
    Votes = 'VOTES',
    VotesAvailable = 'VOTES_AVAILABLE',
    VotesUsed = 'VOTES_USED',
    LedgerModel = 'LEDGER_MODEL',
    Status = 'STATUS',
    IsPrimary = 'IS_PRIMARY',
    AddressIndex = 'ADDRESS_INDEX',
    TokenCount = 'TOKEN_COUNT',
}

export enum WalletFlag {
    Starred = 'STARRED',
    Hot = 'HOT',
    Cold = 'COLD',
}

export enum WalletLedgerModel {
    NanoX = 'nanoX',
    NanoS = 'nanoS',
    NanoSP = 'nanoSP',
}

export enum WalletSetting {
    AccountName = 'ACCOUNT_NAME',
    Alias = 'ALIAS',
    Avatar = 'AVATAR',
    Peer = 'PEER',
    IsSelected = 'IS_SELECTED',
}

export const WalletImportMethod = {
    Address: 'ADDRESS',
    BIP39: {
        MNEMONIC: 'BIP39.MNEMONIC',
        MNEMONIC_WITH_ENCRYPTION: 'BIP39.MNEMONIC_WITH_ENCRYPTION',
    },
    BIP44: {
        DERIVATION_PATH: 'BIP44.DERIVATION_PATH',
        MNEMONIC: 'BIP44.MNEMONIC',
        MNEMONIC_WITH_ENCRYPTION: 'BIP44.MNEMONIC_WITH_ENCRYPTION',
    },
    BIP49: {
        DERIVATION_PATH: 'BIP49.DERIVATION_PATH',
        MNEMONIC: 'BIP49.MNEMONIC',
        MNEMONIC_WITH_ENCRYPTION: 'BIP49.MNEMONIC_WITH_ENCRYPTION',
    },
    BIP84: {
        DERIVATION_PATH: 'BIP84.DERIVATION_PATH',
        MNEMONIC: 'BIP84.MNEMONIC',
        MNEMONIC_WITH_ENCRYPTION: 'BIP84.MNEMONIC_WITH_ENCRYPTION',
    },
    PrivateKey: 'PRIVATE_KEY',
    PublicKey: 'PUBLIC_KEY',
    SECRET: 'SECRET',
    SECRET_WITH_ENCRYPTION: 'SECRET_WITH_ENCRYPTION',
    WIF: 'WIF',
    WIFWithEncryption: 'WIF_WITH_ENCRYPTION',
};

export enum AddressViewSelection {
    single = 'single',
    multiple = 'multiple',
}

export type AddressViewType = 'single' | 'multiple';
