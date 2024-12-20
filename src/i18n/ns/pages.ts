/* eslint-disable quotes */
export default {
    HOME: {
        INSUFFICIENT_FUNDS: 'Insufficient funds to send',
        LATEST_TRANSACTIONS: 'Latest Transactions',
        NO_TRANSACTIONS: 'You don’t have any transactions',
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
        ARE_YOU_CERTAIN_TO_DISCONNECT_ALL: 'Are you certain you want to disconnect all ',
        OF_YOUR_CONNECTIONS: 'of your connections',
        ARE_YOU_CERTAIN_TO_DISCONNECT_YOUR_CONNECTION:
            'Are you certain you want to disconnect your connection with ',
    },
    VOTE: {
        VOTE: 'Vote',
        FIND_A_DELEGATE: 'Find a delegate',
        NO_RESULTS:
            'The delegate is either unregistered or resigned. Check your search term and try again.',
        ACTIONS: {
            SELECT: 'Select',
            SELECTED: 'Selected',
            UNSELECTED: 'Unselected',
            CURRENT: 'Current',
        },
        EDIT_FEE: 'Edit Fee',
        USE_SEARCH_TO_FIND_DELEGATES: 'Use the search to find other delegates',
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
        STATUS: {
            OPEN_ARK_APP: 'Open the ARK app on your Ledger device',
            CLICK_CONNECT: 'Connect and choose your Ledger device in the browser window',
            WAITING_FOR_YOUR_SIGNATURE: 'Waiting for your signature',
        },
    },
    LOGOUT: {
        REMOVE_ADDRESS: 'Remove Address',
        REMOVE_ADDRESSES: 'Remove Addresses',
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
        SELECT_ADDRESSES_TO_REMOVE: 'Select Addresses to Remove.',
        REMOVE_ALL_ADDRESSES: 'Remove All Addresses',
    },
    ONBOARDING: {
        CREATE_NEW_ADDRESS: 'Create New Address',
        IMPORT_AN_ADDRESS: 'Import an Address',
        SCREEN_HEADINGS: {
            EASILY_SECURE: 'Easily & securely log in to <br /> your favorite web3 apps.',
            CONTROL_YOUR_IDENTITY:
                'Control your identity with our <br /> session management feature.',
            SIGN_TRANSACTIONS: 'Sign transactions and <br /> perform on-chain actions.',
            SHORTCUT: {
                MAC: 'You can open the extension by <br /> pressing Shift + Option + C.',
                DEFAULT: 'You can open the extension by <br /> pressing Shift + Alt + C.',
            },
        },
    },
    TRANSACTION_APPROVED: {
        TRANSACTION_APPROVED: 'Transaction Approved',
    },
    PENDING_CONFIRMATION: 'Pending Confirmation',
    PENDING_CONFIRMATION_MESSAGE: 'This transaction is pending confirmation',
    VOTE_APPROVED: {
        VOTE_APPROVED: 'Vote Approved',
        UNVOTE_APPROVED: 'Unvote Approved',
        VOTE_SWAP_APPROVED: 'Vote Swap Approved',
    },
    WALLET_NOT_FOUND: {
        YOU_DONT_HAVE_ANY_WALLET:
            "You don't have any wallet imported in ARK Connect! <br /> Please create or import a wallet first!",
    },
    APPROVE: {
        SIGNING_WITH: 'Signing with',
        SENDING_WITH: 'Sending with',
        APPROVING_WITH: 'Approving with',
        FEEDBACK: {
            SIGNED_SUCCESSFULLY: 'Signed Successfully',
            SIGNING: 'Signing...',
            SIGN_MESSAGE_DENIED: 'Sign message denied!',
            PROCESSING_TRANSACTION: 'Processing transaction...',
            SIGN_TRANSACTION_DENIED: 'Sign transaction denied!',
            INSUFFICIENT_BALANCE: 'Insufficient balance. Add funds or switch address.',
            PROCESSING_THE_VOTE: 'Processing the Vote...',
            PROCESSING_THE_UNVOTE: 'Processing the Unvote...',
            PROCESSING_THE_VOTE_SWAP: 'Processing the Vote Swap...',
            SIGN_VOTE_DENIED: 'Sign vote denied!',
        },
    },
    SETTINGS: {
        AUTO_LOCK_TIMER: 'Auto Lock Timer',
        ABOUT_ARK_CONNECT: 'About ARK Connect',
        OFFICIAL_WEBSITE: 'Official Website',
        CHANGE_LOCAL_PASSWORD: 'Change Local Password',
        CHANGE_PASSWORD_FOR_YOUR_WALLET:
            'Change password for your wallet. Your password is only stored locally.',
        CREATE_N_IMPORT_ADDRESS: 'Create & Import Address',
        CREATE_NEW_ADDRESS: 'Create New Address',
        BY_CREATING_A_NEW_PASSPHRASE: 'By creating a new passphrase',
        IMPORT_AN_ADDRESS: 'Import an Address',
        BY_USING_EXISTING_PASSPHRASE: 'By using existing passphrase',
        ARK_CONNECT_REQUIRES_TO_USE_CHROMIUM:
            'ARK Connect requires the use of a chromium <br /> based browser when using a Ledger.',
        CONNECT_A_LEDGER: 'Connect a Ledger',
        IMPORT_ADDRESSES_USING_LEDGER: 'Import addresses using a Ledger',
        EDIT_ADDRESS_NAME: 'Edit Address Name',
        NAME_YOUR_ADDRESS_SO_YOU_CAN_IDENTIFY:
            'Name your address so you can identify it later. This name is only stored locally.',
        SELECT_NETWORK_TYPE: 'Select Network Type',
        SELECT_NETWORK_TO_CREATE: 'Select a network to create your new address with.',
        SELECT_NETWORK_TO_IMPORT: 'Select a network to import your address with.',
        SHOW_PASSPHRASE: 'Show Passphrase',
        SHOW_PASSPHRASE_DISCLAIMER:
            'Remember, anyone with your passphrase can steal your assets. Do not share this publicly.',
        SHOW_PRIVATE_KEY: 'Show Private Key',
        SHOW_PRIVATE_KEY_DISCLAIMER:
            'Remember, anyone with your private key can steal your assets. Do not share this publicly.',
        CHANGE_LOCAL_CURRENCY: 'Change Local Currency',
        FEEDBACK: {
            UPDATING_YOUR_PASWORD: 'Updating your password...',
            PASSWORD_CHANGED_SUCCESSFULLY: 'Password changed successfully',
            ADDRESS_NAME_UPDATED: 'Address name updated',
            AUTOLOCK_TIMER_CHANGED_SUCCESSFULLY: 'Auto lock timer changed successfully',
            CURRENCY_CHANGED_SUCCESSFULLY: 'Currency changed successfully',
        },
        FORM: {
            ENTER_NAME: 'Enter name...',
            ADDRESS_NAME: 'Address Name',
            OLD_PASSWORD: 'Old Password',
            ENTER_OLD_PASSWORD: 'Enter old password',
            NEW_PASSWORD: 'New Password',
            ENTER_NEW_PASSWORD: 'Enter new password',
            CONFIRM_NEW_PASSWORD: 'Confirm New Password',
            ENTER_NEW_PASSWORD_AGAIN: 'Enter new password again',
            SAVE_NEW_PASSWORD: 'Save New Password',
            YOUR_PASSWORD: 'Your Password',
            ENTER_PASSWORD_TO_ACCESS: 'Enter Password to Access',
        },
        MENU: {
            ADDRESS_BOOK: 'Address Book',
            LOCK_EXTENSION: 'Lock Extension',
            DARK_MODE: 'Dark Mode',
            THEME: 'Theme',
            CHANGE_PASSWORD: 'Change Password',
            CHANGE_LOCAL_CURRENCY: 'Change Local Currency',
            AUTO_LOCK_TIMER: 'Auto Lock Timer',
            ABOUT_ARK_CONNECT: 'About ARK Connect',
            REMOVE_ADDRESSES: 'Remove Addresses',
            CONNECTED_APPS: 'Connected Apps',
            CREATE_N_IMPORT_ADDRESS: 'Create & Import Address',
            VOTE: 'Vote',
        },
    },
    TRANSACTION_DETAILS: {
        PAGE_TITLE: 'Transaction Details',
    },
    RECEIVE: {
        QR_CODE_WILL_BE_UPDATED_AUTOMATICALLY: 'The QR-code will be updated automatically.',
        SPECIFY_AMOUNT: 'Specify Amount',
    },
    ADDRESS_BOOK: {
        TITLE: 'Address Book',
        NO_CONTACTS: 'No contacts added yet.',
        ADD_NEW_CONTACT: 'Add New Contact',
        ADD_NEW_CONTACTS_AT_ANYTIME: 'Add a new contact at any time.',
        CONTACT_ADDED: 'New contact has been saved',
        CONTACT_REMOVED: 'Contact deleted from the address book',
        CONTACT_EDITED: 'Contact edited successfully',
        DELETE_SAVED_CONTACT: 'Delete Saved Contact',
        ARE_YOU_SURE_YOU_WANT_TO_DELETE: 'Are you sure you want to delete',
        FROM_YOUR_ADDRESS_BOOK: 'from your address book',
        EDIT_CONTACT: 'Edit Contact',
    },
    SEND: {
        ENTER_OR_CHOOSE_FROM_SAVED_ADDRESSES: 'Enter or choose from saved addresses',
        RECIPIENT_ADDRESS: 'Recipient Address',
        QR_MODAL: {
            UPLOAD_QR: 'Upload QR',
            CHOOSE_YOUR_QR_CODE: 'Choose your QR Code, and the fields will auto-populate',
            PROCESSING_IMAGE: "We're processing your image...",
            FIREFOX_NOT_SUPPORTED: 'QR Code upload is only supported on Chromium based browsers',
        },
    },
    ADDRESS_SETTINGS: {
        TITLE: 'Address Settings',
        OPTIONS: {
            EDIT_NAME: 'Edit Name',
            COPY_ADDRESS: 'Copy Address',
            SHOW: 'Show {{ name }}',
            VIEW_ON_ARKSCAN: 'View on ARKscan',
            REMOVE_ADDRESS: 'Remove Address',
        },
        TOOLTIP: {
            LEDGER_DEVICES_DO_NOT_ALLOW: 'Ledger devices do not allow',
            ACCESS_TO: 'access to the {{ name }}',
        },
    },
};
