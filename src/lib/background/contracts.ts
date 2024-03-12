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

interface WalletImportScreenData {
    step: number;
    network: string;
}

export enum ScreenName {
    CreateWallet = '/wallet/create',
    ImportWallet = '/wallet/import',
}

interface WalletCreate {
    path: ScreenName.CreateWallet;
    data: WalletCreateScreenData
}

interface WalletImport {
    path: ScreenName.ImportWallet;
    data: WalletImportScreenData;
}

export type LastVisitedPage = WalletCreate | WalletImport;

export type SessionEntries = { [id: string]: Session };
