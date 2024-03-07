export enum ProfileData {
    Sessions = 'SESSIONS',
    LastScreen = 'LAST_SCREEN',
}

type Session = {
    id: string;
    domain: string;
    logo: string;
    createdAt: string;
    walletId: string;
};

interface WalletCreateScreenData {
    mnemonic: string;
    network: string;
    coin: string;
    confirmationNumbers: number[];
    confirmPassphrase: string[];
    step: number;
}

export enum ScreenName {
    CreateWallet = 'CREATE_WALLET',
}

export interface LastScreen {
    screenName: ScreenName;
    step?: number;
    data: WalletCreateScreenData;
}

export type SessionEntries = { [id: string]: Session };
