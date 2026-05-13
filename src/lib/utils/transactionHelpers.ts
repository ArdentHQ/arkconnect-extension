import { RecipientItem } from '@/lib/hooks/useSendTransferForm';
import { BroadcastResponse } from '@/lib/mainsail/client.contract';

interface BuildTransferDataProperties {
    isMultiSignature?: boolean;
    recipients?: RecipientItem[];
    preserveAmountPrecision?: boolean;
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
    amount: number | string;
    to: string;
    memo?: string;
    expiration?: number;
}

const normalizeAmount = (amount: string | undefined, preserve: boolean): number | string => {
    if (preserve) {
        return amount ?? '0';
    }
    return +(amount ?? 0);
};

export const buildTransferData = async ({
    recipients,
    preserveAmountPrecision = false,
}: BuildTransferDataProperties): Promise<BuildTransferData> => {
    let data: Record<string, any> = {};

    if (recipients?.length === 1) {
        data = {
            amount: normalizeAmount(recipients[0].amount, preserveAmountPrecision),
            to: recipients[0].address,
        };
    }

    if (!!recipients?.length && recipients.length > 1) {
        data = {
            payments: recipients.map(({ address, amount }) => ({
                amount: normalizeAmount(amount, preserveAmountPrecision),
                to: address,
            })),
        };
    }

    return data as BuildTransferData;
};
