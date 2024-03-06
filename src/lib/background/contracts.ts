export enum ProfileData {
    PrimaryWalletId = 'PRIMARY_WALLET_ID',
    Sessions = 'SESSIONS',
    LastScreen = 'LAST_SCREEN',
    LastVisitedPage = 'LAST_VISITED_PAGE',
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

export interface LastVisitedPage {
    name: ScreenName;
    data: WalletCreateScreenData;
}

export type SessionEntries = { [id: string]: Session };
