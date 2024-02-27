import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import browser from 'webextension-polyfill';
import { Contracts } from '@ardenthq/sdk-profiles';
import ApproveBody from '@/components/approve/ApproveBody';
import ApproveFooter from '@/components/approve/ApproveFooter';
import ApproveHeader from '@/components/approve/ApproveHeader';
import { WalletNetwork } from '@/lib/store/wallet';
import { useErrorHandlerContext } from '@/lib/context/ErrorHandler';
import { useProfileContext } from '@/lib/context/Profile';
import { useExchangeRate } from '@/lib/hooks/useExchangeRate';
import { ApproveActionType } from '@/pages/Approve';
import { useVoteForm } from '@/lib/hooks/useVoteForm';
import { HandleLoadingState } from '@/shared/components/handleStates/HandleLoadingState';
import removeWindowInstance from '@/lib/utils/removeWindowInstance';
import { useAppDispatch } from '@/lib/store';
import { loadingModalUpdated } from '@/lib/store/modal';
import useWalletSync from '@/lib/hooks/useWalletSync';
import { useEnvironmentContext } from '@/lib/context/Environment';
import RequestedVoteBody from '@/components/approve/RequestedVoteBody';
import { useNotifyOnUnload } from '@/lib/hooks/useNotifyOnUnload';

type Props = {
  abortReference: AbortController;
  approveWithLedger: (
    profile: Contracts.IProfile,
    wallet: Contracts.IReadWriteWallet,
  ) => Promise<void>;
  wallet: Contracts.IReadWriteWallet;
  closeLedgerScreen: () => void;
};

const ApproveVote = ({ abortReference, approveWithLedger, wallet, closeLedgerScreen }: Props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const { profile } = useProfileContext();
  const { env } = useEnvironmentContext();
  const { syncAll } = useWalletSync({ env, profile });
  const { onError } = useErrorHandlerContext();
  const [error, setError] = useState<string | undefined>();
  const { convert } = useExchangeRate({
    exchangeTicker: wallet.exchangeCurrency(),
    ticker: wallet.currency(),
  });

  const {
    resetForm,
    submitForm,
    loading,
    values: { fee, vote, unvote },
  } = useVoteForm(wallet, state);

  useEffect(() => {
    if (wallet.balance() < fee) {
      setError('Insufficient balance. Add funds or switch address.');
    } else {
      setError(undefined);
    }
  }, [wallet, fee]);

  let actionType =
    location.state?.type === ApproveActionType.VOTE
      ? ApproveActionType.VOTE
      : ApproveActionType.UNVOTE;

  const hasVoted = wallet.voting().current().length > 0;

  if (actionType === ApproveActionType.VOTE && hasVoted) {
    actionType = ApproveActionType.SWITCH_VOTE;
  }

  const getLoadingMessage = (actionType: string) => {
    switch (actionType) {
      case ApproveActionType.VOTE:
        return 'Processing the vote...';
      case ApproveActionType.UNVOTE:
        return 'Processing the unvote...';
      case ApproveActionType.SWITCH_VOTE:
        return 'Processing the vote switch...';
      default:
        return '';
    }
  };

  const reject = (message: string = 'Sign vote denied!') => {
    browser.runtime.sendMessage({
      type: 'SIGN_VOTE_REJECT',
      data: {
        domain: state.domain,
        status: 'failed',
        message,
        tabId: state.tabId,
      },
    });
  };

  const setSubmitted = useNotifyOnUnload(reject);

  const onSubmit = async () => {
    try {
      await syncAll(wallet);
      const loadingModal = {
        isOpen: true,
        isLoading: true,
        loadingMessage: getLoadingMessage(actionType),
      };
      if (wallet.isLedger()) {
        await approveWithLedger(profile, wallet);
      } else {
        dispatch(loadingModalUpdated(loadingModal));
      }

      const res = await submitForm(abortReference);

      if (wallet.isLedger()) {
        closeLedgerScreen();
      }

      setTimeout(() => {
        dispatch(
          loadingModalUpdated({
            isOpen: false,
            isLoading: false,
          }),
        );
      }, 3000);

      const voteInfo = {
        id: res.id as string,
        sender: res.sender as string,
        voteDelegateAddress: vote?.wallet?.address(),
        voteDelegateName: vote?.wallet?.username(),
        votePublicKey: vote?.wallet?.publicKey(),
        unvoteDelegateAddress: unvote?.wallet?.address(),
        unvoteDelegateName: unvote?.wallet?.username(),
        unvotePublicKey: unvote?.wallet?.publicKey(),
        exchangeCurrency: wallet.exchangeCurrency() ?? 'USD',
        fee: res.fee as number,
        convertedFee: convert(res.fee),
      };

      browser.runtime.sendMessage({
        type: 'SIGN_VOTE_RESOLVE',
        data: {
          domain: state.domain,
          status: 'success',
          vote: voteInfo,
          tabId: state.tabId,
          sessionId: state.session.id,
        },
      });

      setSubmitted();

      navigate('/vote/success', {
        state: {
          vote: voteInfo,
          windowId: location.state?.windowId,
          walletNetwork: wallet.network().isTest()
            ? WalletNetwork.DEVNET
            : WalletNetwork.MAINNET,
          isTestnet: wallet.network().isTest(),
          type: actionType,
          session: state.session,
        },
      });
    } catch (error: any) {
      closeLedgerScreen();
      reject(error.message);
      onError(error);
    }
  };

  const onCancel = async () => {
    abortReference.abort();
    resetForm();
    setError(undefined);

    reject();

    await removeWindowInstance(location.state?.windowId, 100);
  };

  return (
    <HandleLoadingState loading={loading}>
      <ApproveHeader
        actionType={actionType}
        appName={state.session.domain}
        appLogo={state.session.logo}
      />
      <ApproveBody header='Approving with' wallet={wallet} error={error}>
        <RequestedVoteBody
          unvote={unvote}
          vote={vote}
          fee={fee}
          convertedFee={convert(fee)}
          wallet={wallet}
        />
      </ApproveBody>
      <ApproveFooter disabled={!!error} onSubmit={onSubmit} onCancel={onCancel} />
    </HandleLoadingState>
  );
};

export default ApproveVote;
