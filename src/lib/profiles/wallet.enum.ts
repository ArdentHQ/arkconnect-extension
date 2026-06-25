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
    },
};

export enum AddressViewSelection {
    single = 'single',
    multiple = 'multiple',
}

export type AddressViewType = 'single' | 'multiple';
