export enum ProfileData {
    PrimaryWalletId = 'PRIMARY_WALLET_ID',
    Sessions = 'SESSIONS',
}

type Session = {
    id: string;
    domain: string;
    logo: string;
    createdAt: string;
    walletId: string;
};

export type SessionEntries = { [id: string]: Session };
