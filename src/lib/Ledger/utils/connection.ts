import retry, { AbortError, Options } from 'p-retry';

// const accessLedgerDevice = async (coin: Coins.Coin) => {
//     try {
//         await coin.__construct();
//         await coin.ledger().connect();
//     } catch (error: any) {
//         // If the device is open, continue normally.
//         // Can be triggered when the user retries ledger connection.
//         if (error.message !== 'The device is already open.') {
//             throw error;
//         }
//     }
// };

// const accessLedgerApp = async ({ profile }: { profile: Contracts.IProfile }) => {
//     await profile.ledger().connect();
//
//     // TODO fix validation
//     // if (!(await hasRequiredAppVersion(coin))) {
//     //     throw new Error('VERSION_ERROR');
//     // }
//
//     // Ensure that the app is accessible.
//     await profile.ledger().getPublicKey(
//         formatLedgerDerivationPath({
//             // TODO fix coinType
//             coinType: 3
//         }),
//     );
// };

export const persistLedgerConnection = async ({
    options,
    hasRequestedAbort,
}: {
    options: Options;
    hasRequestedAbort: () => boolean;
}) => {
    const retryAccess: any = async (attempts: number) => {
        if (hasRequestedAbort() && attempts > 1) {
            throw new AbortError('CONNECTION_ERROR');
        }

        try {
            // TODO enable ledger
            // await accessLedgerApp({ coin });
        } catch (error: any) {
            // Abort on version error or continue retrying access.
            if (error.message === 'VERSION_ERROR') {
                throw new AbortError('VERSION_ERROR');
            }

            throw error;
        }
    };

    await retry(retryAccess, options);
};
