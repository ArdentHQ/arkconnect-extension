import { BigNumber } from '@ardenthq/sdk-helpers';
import { Networks, Services } from '@ardenthq/sdk';
import { Contracts } from '@ardenthq/sdk-profiles';
import { useEffect, useState } from 'react';
import browser from 'webextension-polyfill';
import { useEnvironmentContext } from '../context/Environment';
import { precisionRound } from '../utils/precisionRound';
import { assertWallet } from '../utils/assertions';
import {
  buildTransferData,
  handleBroadcastError,
  withAbortPromise,
} from '../utils/transactionHelpers';
import { useAppSelector } from '../store';
import { useProfileContext } from '../context/Profile';
import { useErrorHandlerContext } from '../context/ErrorHandler';
import { useLedgerContext } from '../Ledger';
import { useFees } from './useFees';
import * as SessionStore from '@/lib/store/session';
import { ApproveActionType } from '@/pages/Approve';
import { selectWallets } from '@/lib/store/wallet';

export interface RecipientItem {
  address: string;
  alias?: string;
  amount?: number;
  isDelegate?: boolean;
}

interface SendTransferForm {
  senderAddress: string;
  fee: number;
  remainingBalance: number;
  amount: number;
  isSendAllSelected: string;
  network?: Networks.Network;
  recipients: RecipientItem[];
  total: number;
  mnemonic: string;
  secondMnemonic: string;
  memo: string;
  encryptionPassword: string;
  wif: string;
  privateKey: string;
  secret: string;
  secondSecret: string;
}

type ApproveRequest = {
  session: SessionStore.Session;
  amount: number;
  receiverAddress: string;
};

const defaultState = {
  senderAddress: '',
  fees: {
    avg: 0,
  },
  fee: 0,
  remainingBalance: 0,
  amount: 0,
  isSendAllSelected: '',
  recipients: [],
  total: 0,
  mnemonic: '',
  secondMnemonic: '',
  memo: '',
  encryptionPassword: '',
  wif: '',
  privateKey: '',
  secret: '',
  secondSecret: '',
};

const prepareLedger = async (wallet: Contracts.IReadWriteWallet) => {
  const signature = await wallet
    .signatory()
    .ledger(wallet.data().get<string>(Contracts.WalletData.DerivationPath)!);
  // Prevents "The device is already open" exception when running the signing function
  await wallet.ledger().disconnect();

  return {
    signatory: signature,
  };
};

export const useSendTransferForm = (
  wallet: Contracts.IReadWriteWallet,
  request: ApproveRequest,
) => {
  const { profile } = useProfileContext();
  const { onError } = useErrorHandlerContext();
  const { calculate } = useFees();
  const [formValues, setFormValues] = useState<SendTransferForm>(defaultState);
  const [formValuesLoaded, setFormValuesLoaded] = useState(false);
  const { persist } = useEnvironmentContext();
  const wallets = useAppSelector(selectWallets);
  const { abortConnectionRetry } = useLedgerContext();

  const resetForm = () => {
    setFormValues(defaultState);
  };

  const submitForm = async (abortReference: AbortController) => {
    assertWallet(wallet);

    const { fee, recipients, memo } = formValues;

    if (wallet.isLedger()) {
      const abortSignal = abortReference.signal;
      const { signatory } = await withAbortPromise(
        abortSignal,
        abortConnectionRetry,
      )(prepareLedger(wallet));

      const data = await buildTransferData({
        coin: wallet.coin(),
        isMultiSignature: signatory.actsWithMultiSignature() || signatory.hasMultiSignature(),
        memo,
        recipients,
      });

      const transactionInput: Services.TransferInput = {
        data,
        fee: +fee,
        signatory,
      };

      const uuid = await wallet.transaction().signTransfer(transactionInput);
      const response = await wallet.transaction().broadcast(uuid);

      handleBroadcastError(response);

      const transaction = wallet.transaction().transaction(uuid);

      return {
        ...transaction.toObject(),
        amount: transaction.amount().toString(),
        fee: transaction.fee(),
        total: transaction.total(),
      };
    }

    const { response, error, transaction } = await browser.runtime.sendMessage({
      type: 'SEND_TRANSACTION',
      data: {
        recipients,
        fee: +fee,
      },
    });

    if (error) {
      onError(error);
      return;
    }

    handleBroadcastError(response);

    return transaction;
  };

  useEffect(() => {
    (async () => {
      try {
        if (!wallet) return;

        await profile.sync();
        await persist();

        const walletData = wallets.find((w) => w.walletId === wallet.id());

        const passphrase = walletData?.passphrase;

        const fee = await calculate({
          coin: wallet.network().coin(),
          network: wallet.network().id(),
          type: ApproveActionType.TRANSACTION,
        });

        setFormValues((prevFormValues) => ({
          ...prevFormValues,
          senderAddress: wallet.address(),
          remainingBalance: wallet.balance(),
          network: wallet.network(),
          fee,
          mnemonic: passphrase?.join(' ') || '',
          total: BigNumber.make(fee).plus(request.amount).toHuman(),
          recipients: [
            {
              address: request.receiverAddress,
              amount: request.amount,
            },
          ],
        }));

        setFormValuesLoaded(true);
      } catch (error) {
        onError(error);
      }
    })();
  }, [wallet]);

  useEffect(() => {
    const remaining = formValues.remainingBalance - formValues.fee;

    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      amount: precisionRound(remaining, 8),
    }));
  }, [formValues.fee]);

  return {
    formValues,
    setFormValues,
    resetForm,
    submitForm,
    values: {
      fee: formValues.fee,
      total: formValues.total,
      network: formValues.network,
      senderAddress: formValues.senderAddress,
    },
    formValuesLoaded,
  };
};
