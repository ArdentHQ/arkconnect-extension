import { RecipientItem } from '@/lib/hooks/useSendTransferForm';
import { BroadcastResponse } from '@/lib/mainsail/client.contract';

interface BuildTransferDataProperties {
    isMultiSignature?: boolean;
    recipients?: RecipientItem[];
}

export const handleBroadcastError = ({ errors }: BroadcastResponse) => {
    const allErrors = Object.values(errors);

    if (allErrors.length === 0) {
        return;
    }

    throw new Error(allErrors[0]);
};

export const withAbortPromise =
    (signal?: AbortSignal, callback?: () => void) =>
    <T>(promise: Promise<T>) =>
        new Promise<T>((resolve, reject) => {
            if (signal) {
                signal.addEventListener('abort', () => {
                    callback?.();
                    reject('ERR_ABORT');
                });
            }

            return promise.then(resolve).catch(reject);
        });

interface BuildTransferData {
    amount: number;
    to: string;
    memo?: string;
    expiration?: number;
}

export const buildTransferData = async ({
    recipients,
}: BuildTransferDataProperties): Promise<BuildTransferData> => {
    let data: Record<string, any> = {};

    if (recipients?.length === 1) {
        data = {
            amount: +(recipients[0].amount ?? 0),
            to: recipients[0].address,
        };
    }

    if (!!recipients?.length && recipients.length > 1) {
        data = {
            payments: recipients.map(({ address, amount }) => ({
                amount: +(amount ?? 0),
                to: address,
            })),
        };
    }

    return data as BuildTransferData;
};
