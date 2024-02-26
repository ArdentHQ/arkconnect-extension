import { Services, Coins } from '@ardenthq/sdk';
import { RecipientItem } from '../hooks/useSendTransferForm';

interface BuildTransferDataProperties {
  isMultiSignature?: boolean;
  coin: Coins.Coin;
  recipients?: RecipientItem[];
  memo?: string;
}

export const handleBroadcastError = ({ errors }: Services.BroadcastResponse) => {
  const allErrors = Object.values(errors);

  if (allErrors.length === 0) {
    return;
  }

  throw new Error(allErrors[0]);
};

export const getTransferType = ({
  recipients,
}: {
  recipients: RecipientItem[];
}): 'multiPayment' | 'transfer' => (recipients.length > 1 ? 'multiPayment' : 'transfer');

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
  coin,
  recipients,
  memo,
  isMultiSignature,
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

  if (memo) {
    data.memo = memo;
  }

  const rounds = isMultiSignature ? '211' : '5';
  const expiration = await coin.transaction().estimateExpiration(rounds);

  if (expiration) {
    data.expiration = Number.parseInt(expiration);
  }

  return data as BuildTransferData;
};
