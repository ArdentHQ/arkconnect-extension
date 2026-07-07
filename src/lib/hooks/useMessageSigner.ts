import { runtime } from 'webextension-polyfill';
import { Contracts as ProfileContracts } from '@/lib/profiles';
import { SignedMessage } from '@/lib/mainsail/message.contract';

const sign = async (
    _wallet: ProfileContracts.IReadWriteWallet,
    message: string,
): Promise<SignedMessage> => {
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
