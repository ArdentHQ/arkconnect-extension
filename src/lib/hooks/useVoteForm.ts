import { Networks, Services } from '@ardenthq/sdk';
import { Contracts } from '@ardenthq/sdk-profiles';
import { useEffect, useState } from 'react';
import { useEnvironmentContext } from '../context/Environment';
import { precisionRound } from '../utils/precisionRound';
import { handleBroadcastError } from '../utils/transactionHelpers';
import * as SessionStore from '@/lib/store/session';
import * as WalletStore from '@/lib/store/wallet';
import { useAppSelector } from '../store';
import { useFees } from './useFees';
import { ApproveActionType } from '@/pages/Approve';
import { useProfileContext } from '../context/Profile';
import { useErrorHandlerContext } from '../context/ErrorHandler';
import browser from 'webextension-polyfill';
import { useLocation } from 'react-router-dom';
import { withAbortPromise } from '../utils/transactionHelpers';
import { useLedgerContext } from '../Ledger';

interface SendVoteForm {
  senderAddress: string;
  fee: number;
  remainingBalance: number;
  amount: number;
  network?: Networks.Network;
  vote: Contracts.VoteRegistryItem | null;
  unvote: Contracts.VoteRegistryItem | null;
}

type VoteDelegateProperties = {
  delegateAddress: string;
  amount: number;
};

type ApproveVoteRequest = {
  domain: string;
  session: SessionStore.Session;
  vote: VoteDelegateProperties;
  unvote: VoteDelegateProperties;
  tabId: number;
};

const defaultState = {
  senderAddress: '',
  fee: 0,
  remainingBalance: 0,
  amount: 0,
  vote: null,
  unvote: null,
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

export const useVoteForm = (wallet: Contracts.IReadWriteWallet, request: ApproveVoteRequest) => {
  const { env } = useEnvironmentContext();
  const { profile } = useProfileContext();
  const { onError } = useErrorHandlerContext();
  const { state } = useLocation();
  const { calculate } = useFees();
  const [loading, setLoading] = useState(true);
  const [formValues, setFormValues] = useState<SendVoteForm>(defaultState);
  const { persist } = useEnvironmentContext();
  const wallets = useAppSelector(WalletStore.selectWallets);
  const { abortConnectionRetry } = useLedgerContext();

  const resetForm = () => {
    setFormValues(defaultState);
  };

  const submitForm = async (abortReference: AbortController) => {
    const { fee, vote, unvote } = formValues;

    const data = {
      fee: +fee,
      data: {
        unvotes: unvote && [
          {
            amount: unvote.amount,
            id: unvote.wallet?.governanceIdentifier(),
          },
        ],
        votes: vote && [
          {
            amount: vote.amount,
            id: vote.wallet?.governanceIdentifier(),
          },
        ],
      },
    };

    if (wallet.isLedger()) {
      const abortSignal = abortReference.signal;
      const { signatory } = await withAbortPromise(
        abortSignal,
        abortConnectionRetry,
      )(prepareLedger(wallet));

      const voteTransactionInput: Services.TransactionInputs = {
        ...data,
        signatory,
      };

      // @ts-ignore
      const uuid = await wallet.transaction().signVote(voteTransactionInput);
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

    const { transaction, response, error } = await browser.runtime.sendMessage({
      type: 'SEND_VOTE',
      data,
    });

    if (error) {
      throw new Error(error);
    }

    handleBroadcastError(response);

    return transaction;
  };

  const getVote = async () => {
    try {
      env.delegates().all(wallet.network().coin(), wallet.network().id());
    } catch {
      await env.delegates().sync(profile, wallet.network().coin(), wallet.network().id());
    }
    const vote = request.vote && {
      amount: request.vote?.amount,
      wallet: env
        .delegates()
        .findByAddress(
          wallet.network().coin(),
          wallet.network().id(),
          request.vote?.delegateAddress,
        ),
    };
    const unvote = request.unvote && {
      amount: request.unvote?.amount,
      wallet: env
        .delegates()
        .findByAddress(
          wallet.network().coin(),
          wallet.network().id(),
          request.unvote?.delegateAddress,
        ),
    };
    return { vote, unvote };
  };

  useEffect(() => {
    (async () => {
      if (
        !wallet.id() ||
        !wallets.some((w) => w.walletId === wallet.id()) ||
        wallet.network().name() !== state?.network
      ) {
        return;
      }

      try {
        await profile.sync();
        await persist();

        const fee = await calculate({
          coin: wallet.network().coin(),
          network: wallet.network().id(),
          type: ApproveActionType.VOTE,
        });

        const { vote, unvote } = await getVote();

        setFormValues((prevFormValues) => ({
          ...prevFormValues,
          senderAddress: wallet.address(),
          remainingBalance: wallet.balance(),
          fee,
          vote: vote,
          unvote: unvote,
        }));
      } catch (error: any) {
        onError(error);
        browser.runtime.sendMessage({
          type: 'SIGN_VOTE_REJECT',
          data: {
            domain: request.domain,
            status: 'failed',
            message: error.message,
            tabId: request.tabId,
          },
        });
      } finally {
        setLoading(false);
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
    loading,
    values: {
      fee: formValues.fee,
      vote: formValues.vote,
      unvote: formValues.unvote,
    },
  };
};
