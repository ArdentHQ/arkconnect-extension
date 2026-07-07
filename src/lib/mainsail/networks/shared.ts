/* eslint unicorn/no-abusive-eslint-disable: "off" */
/* eslint-disable */
import { Networks } from '@/lib/mainsail';

export const transactions: Networks.NetworkManifestTransactions = {
    expirationType: 'height',
    fees: {
        ticker: 'ARK',
        type: 'dynamic',
    },
    memo: false,
    multiPaymentRecipients: 64,
    types: [
        'validatorRegistration',
        'usernameRegistration',
        'usernameResignation',
        'updateValidator',
        'validatorResignation',
        'multiPayment',
        'transfer',
        'vote',
    ],
};

export const explorer: Networks.NetworkManifestExplorer = {
    block: 'blocks/{0}',
    transaction: 'transactions/{0}',
    wallet: 'addresses/{0}',
};
