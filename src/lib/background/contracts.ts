export enum EnvironmentData {
    HasOnboarded = 'HAS_ONBOARDED',
}

export enum ProfileData {
    Sessions = 'SESSIONS',
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
