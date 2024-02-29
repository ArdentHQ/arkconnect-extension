export enum ProfileData {
    PrimaryWalletId = 'PRIMARY_WALLET_ID',
    Sessions = 'SESSIONS',
    LastScreen = 'LAST_SCREEN',
}

export type Session = {
    id: string;
    domain: string;
    logo: string;
    createdAt: string;
    walletId: string;
};

export enum ScreenName {
    ImportWallet = 'IMPORT_WALLET',
    CreateWallet = 'CREATE_WALLET',
}

export interface LastScreen {
    screenName: ScreenName;
    step?: number;
    data: unknown;
}

export type SessionEntries = { [id: string]: Session };
