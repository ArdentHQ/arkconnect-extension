import { runtime } from 'webextension-polyfill';
import { Contracts as ProfileContracts } from '@/lib/profiles';
import { SignedMessage } from '@/lib/mainsail/message.contract';

const signWithLedger = async (message: string, wallet: ProfileContracts.IReadWriteWallet) => {
    const path = wallet.data().get<string>(ProfileContracts.WalletData.DerivationPath);

    const signatory = wallet.publicKey();

    // TODO fix ledger signing
    // if (!signatory) {
    //     signatory = await wallet.coin().ledger().getPublicKey(path!);
    // }

    const signature = await wallet.ledger().signMessage(path!, message);

    return {
        message,
        signatory,
        signature,
    };
};

const withAbortPromise =
    (signal?: AbortSignal) =>
    <T>(promise: Promise<T>) =>
        new Promise<T>((resolve, reject) => {
            if (signal) {
                signal.addEventListener('abort', () => reject('ERR_ABORT'));
            }

            return promise.then(resolve).catch(reject);
        });

const sign = async (
    wallet: ProfileContracts.IReadWriteWallet,
    message: string,
    options?: {
        abortSignal?: AbortSignal;
    },
): Promise<SignedMessage> => {
    if (wallet.isLedger()) {
        return withAbortPromise(options?.abortSignal)(signWithLedger(message, wallet));
    }

    const { error, signatory, signature } = await runtime.sendMessage({
        type: 'SIGN_MESSAGE',
        data: {
            message,
        },
    });

    if (error) {
        throw new Error(error);
    }

    return {
        signatory,
        message,
        signature,
    };
};

export const useMessageSigner = () => ({ sign });
