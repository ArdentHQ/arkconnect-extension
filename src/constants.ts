const SUPPORT_EMAIL = 'support@arkconnect.io ';
const ARKSCAN_MAINNET_TRANSACTIONS = 'https://live.arkscan.io/transactions';
const ARKSCAN_TESTNET_TRANSACTIONS = 'https://test.arkscan.io/transactions';
const ARKSCAN_ADDRESSES = 'https://live.arkscan.io/addresses';
const ARKSCAN_TEST_ADDRESSES = 'https://test.arkscan.io/addresses';
const ARKSCAN_EXCHANGES = 'https://live.arkscan.io/exchanges';
const ARKSCAN_FAUCET = 'https://faucet.ark.io/';
const TERMS_OF_SERVICE = 'https://arkconnect.io/terms-of-service';
const PRIVACY_POLICY = 'https://arkconnect.io/privacy-policy';
const ARK_CONNECT = 'https://arkconnect.io/';
const ARK_CONNECT_DEMO = 'https://demo.arkconnect.io';
const ARKVAULT_BASE_URL = 'https://app.arkvault.io/';
const ARKVAULT_API_MAINNET_BASE_URL = 'https://api.ark.io/';
const ARKVAULT_API_DEVNET_BASE_URL = 'https://ark-test.arkvault.io/';

const SHOW_MESSAGE_AFTER_ACTION_DURING_MS = 3000;

const TRANSACTION_CONFIRMATION_DELAY_MS = 3000;

const ADDRESS_LENGTH = 34;

// Using 9 considering that the minimum amount of ARK is 0.00000001 which
// is 8 digits in total.
const MAX_CURRENCY_DIGITS_ALLOWED = 9;

const constants = {
    SUPPORT_EMAIL,
    ARKSCAN_MAINNET_TRANSACTIONS,
    ARKSCAN_TESTNET_TRANSACTIONS,
    ARKSCAN_ADDRESSES,
    ARKSCAN_TEST_ADDRESSES,
    ARKSCAN_EXCHANGES,
    ARKSCAN_FAUCET,
    ARKVAULT_BASE_URL,
    ARKVAULT_API_MAINNET_BASE_URL,
    ARKVAULT_API_DEVNET_BASE_URL,
    TERMS_OF_SERVICE,
    PRIVACY_POLICY,
    ARK_CONNECT,
    MAX_CURRENCY_DIGITS_ALLOWED,
    ARK_CONNECT_DEMO,
    SHOW_MESSAGE_AFTER_ACTION_DURING_MS,
    TRANSACTION_CONFIRMATION_DELAY_MS,
    ADDRESS_LENGTH,
};

export default constants;
