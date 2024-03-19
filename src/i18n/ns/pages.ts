/* eslint-disable quotes */
export default {
    HOME: {
        TRY_OUR_DEMO_APP_NOW: 'Try Our Demo App Now!',
    },
    CONNECT: {
        CONNECT_TO_APP: 'Connect to App',
        CONNECTING_WITH: 'Connecting with',
        NO_WALLETS_FOUND: 'No wallets found in your profile!',
        CREATE_OR_IMPORT_NEW_WALLET: 'Create or import new wallet',
        CAN_SEE_YOUR_ADDRESS_DISCLAIMER:
            'It can see your address, balance, activity, and can send requests for transactions. It cannot access your funds without your approval.',

        FEEDBACK: {
            ALREADY_CONNECTED: 'Already connected!',
            WALLET_NOT_FOUND: 'Wallet not found',
            CONNECTION_DENIED: 'Connection denied!',
            CONNECTING: 'Connecting...',
            SECURELY_CONNECTED: 'Securely Connected',
        },
    },
    CONNECTIONS: {
        CONNECTED_APPS: 'Connected Apps',
        NO_CONNECTED_APPS_DESCRIPTION: 'You are currently not connected to any applications.',
        CONNECTED_WITH: 'Connected with',
    },
    CREATE_WALLET: {
        SAVE_YOUR_SECRET_PASSPHRASE: 'Save Your Secret Passphrase',
        WRITE_DOWN_OR_COPY_YOUR_PASSPHRASE:
            'Write down or copy your passphrase. Make sure to store it safely.',
        SHOW_PASSPHRASE: 'Show Passphrase',
        FEEDBACK: {
            WALLET_IS_READY: 'Your Wallet is Ready!',
            SETTING_UP_THE_WALLET: 'Setting up the wallet, please wait!',
            SOMETHING_WENT_WRONG: 'Something went wrong while creating your wallet',
            FAILED_TO_GENERATE_WALLET: 'Failed to generate wallet.',
            PASSPHRASE_COPIED: 'Passphrase Copied to Clipboard',
            FAILED_TO_COPY_TO_CLIPBOARD: 'Failed to Copy to Clipboard',
        },
    },
    ENTER_PASSWORD: {
        ENTER_PASSWORD_TO_UNLOCK: 'Enter Password to Unlock',
        YOUR_PASSWORD: 'Your Password',
        INCORRECT_PASSWORD: 'Incorrect password',
        UNLOCK_EXTENSION: 'Unlock Extension',
        FORGOT_PASSWORD: 'Forgot Password?',
    },
    FORGOT_PASSWORD: {
        FORGOT_PASSWORD: 'Forgot Password?',
        NO_RECOVERY_METHOD_AVAILABLE_DISCLAIMER:
            'Unfortunately there is no recovery method available other than resetting the extension and re-importing your address(es). Ensure that you have your passphrase(s) saved.',
        RESET_EXTENSION: 'Reset Extension',
        RESET_WILL_RESULT_LOSS_OF_DATA_DISCLAIMER:
            'I am aware that resetting the extension will result in the loss of all data, including locally stored passphrases.',
    },
    IMPORT_NEW_WALLET: {
        ENTER_PASSPHRASE: 'Enter Passphrase',
        ENTER_YOUR_PASSPHRASE:
            'Enter your 12 or 24-word passphrase that you were given when you created the address.',
        INVALID_PASSPHRASE: 'Invalid passphrase. Please check again.',
        ENTER_YOUR_PASSPHRASE_HERE: 'Paste your 12 or 24-word passphrase here',
        ADDRESS_IMPORTED: 'Address Imported Successfully!',
        ADDRESS_DETAILS_ARE_SHOWN_BELOW: 'Your address details are shown below.',
        ADDRESS_NAME: 'Address Name',
        MAXIMUM_CHARACTERS: '20 characters maximum',
        NAME_YOUR_ADDRESS: 'Name your address so you can identify it later.',
        FEEDBACK: {
            YOUR_WALLET_IS_READY: 'Your Wallet is Ready!',
            SETTING_UP_THE_WALLET: 'Setting up the wallet, please wait!',
        },
    },
    IMPORT_WITH_LEDGER: {
        CONNECT_YOUR_LEDGER_DEVICE: 'Connect Your Ledger Device',
        COMPLETE_STEPS_TO_CONNECT:
            'Please complete the steps mentioned below to connect your Ledger.',
        REINITIATE_LEDGER_WINDOW: 'Reinitiate Ledger Window',
        WAITING_FOR_YOUR_SIGNATURE: 'Waiting for your signature',
        CONNECT_LEDGER_AND_SIGN_THE_REQUEST: 'Connect Ledger and Sign The {{action}} Request',
        CONNECT_YOUR_LEDGER_DEVICE_DISCLAIMER:
            'Connect your Ledger device, launch the ARK app, and carefully review the request on your device before confirming your approval.',
        SELECT_ADDRESSES_TO_IMPORT: 'Select Addresses to Import',
        MULTIPLE_ADDRESSES_CAN_BE_IMPORTED: 'Multiple addresses can be imported too!',
        ADDRESS_ALREADY_IMPORTED: 'Address already imported',
        FEEDBACK: {
            SETTING_UP_YOUR_WALLET: 'Setting up your wallet',
            YOUR_WALLET_IS_READY: 'Your wallet is ready!',
            OPEN_THE_EXTENSION_AND_MANAGE_YOUR_ADDRESSES:
                'You can now open the extension and manage your addresses!',
        },
        ERRORS: {
            FAILED_TO_REQUEST_DEVICE: "Failed to execute requestDevice on 'HID'",
            ACCESS_DENED_TO_USE_LEDGER_DEVICE: 'Access denied to use Ledger device',
        },
        CONNECT_STEPS: {
            CONNECT_YOUR_LEDGER: 'Connect your Ledger device and close other apps connected to it.',
            CLICK_CONNECT: 'Click Connect and choose your Ledger device in the browser window.',
            UNLOCK_AND_OPEN: 'Unlock and open the ARK app on the Ledger device.',
        },
    },
    LOGOUT: {
        REMOVE_ADDRESS: 'Remove Address',
        REMOVE_ADDRESSES: 'Remove Addresses',
        INCORRECT_PASSWORD: 'Incorrect password',
        ENTER_PASSWORD: 'Enter Password',
        ARE_YOU_SURE_YOU_WANT_TO_REMOVE_1: 'Are you sure you want to remove ',
        ARE_YOU_SURE_YOU_WANT_TO_REMOVE_2: 'addresses?',
        YOU_WONT_BE_ABLE_TO_LOGIN_AGAIN: 'You won’t be able to login again without',
        YOU_WONT_BE_ABLE_TO_LOGIN_AGAIN_WITHOUT_LEDGER:
            'Are you sure you want to remove this address? You will be unable to log in again using this address without a Ledger device.',
        YOU_WONT_BE_ABLE_TO_LOGIN_AGAIN_WITHOUT_PASSPHRASE:
            'Are you sure you want to remove this address? You will be unable to log in again using this address without a passphrase.',
        ADDRESS_TYPE: {
            PASSPHRASE_OR_LEDGER: 'a passphrase or a Ledger device',
            LEDGER: 'a Ledger device',
            PASSPHRASE: 'a passphrase',
        },
    },
    ONBOARDING: {
        CREATE_NEW_ADDRESS: 'Create New Address',
        IMPORT_AN_ADDRESS: 'Import an Address',
        SCREEN_HEADINGS: {
            EASILY_SECURE: 'Easily & securely log in to <br /> your favorite web3 apps.',
            CONTROL_YOUR_IDENTITY:
                'Control your identity with our <br /> session management feature.',
            SIGN_TRANSACTIONS: 'Sign transactions and <br /> perform on-chain actions.',
        },
    },
};
