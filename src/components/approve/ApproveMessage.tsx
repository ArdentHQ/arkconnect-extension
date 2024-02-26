import ApproveBody from '@/components/approve/ApproveBody';
import ApproveFooter from '@/components/approve/ApproveFooter';
import ApproveHeader from '@/components/approve/ApproveHeader';
import { useLocation } from 'react-router-dom';
import { useErrorHandlerContext } from '@/lib/context/ErrorHandler';
import { useProfileContext } from '@/lib/context/Profile';
import browser from 'webextension-polyfill';
import { ApproveActionType } from '@/pages/Approve';
import { useMessageSigner } from '@/lib/hooks/useMessageSigner';
import removeWindowInstance from '@/lib/utils/removeWindowInstance';
import { Contracts } from '@ardenthq/sdk-profiles';
import { useAppDispatch } from '@/lib/store';
import * as ModalStore from '@/lib/store/modal';
import useWalletSync from '@/lib/hooks/useWalletSync';
import { useEnvironmentContext } from '@/lib/context/Environment';
import RequestedSignatureMessage from '@/components/approve/RequestedSignatureMessage';
import { useNotifyOnUnload } from '@/lib/hooks/useNotifyOnUnload';
import constants from '@/constants';

type Props = {
  abortReference: AbortController;
  approveWithLedger: (
    profile: Contracts.IProfile,
    wallet: Contracts.IReadWriteWallet,
  ) => Promise<void>;
  wallet: Contracts.IReadWriteWallet;
  closeLedgerScreen: () => void;
};

const ApproveMessage = ({
  abortReference,
  approveWithLedger,
  wallet,
  closeLedgerScreen,
}: Props) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { env } = useEnvironmentContext();
  const { domain, tabId, session, message } = location.state;
  const { profile } = useProfileContext();
  const { syncAll } = useWalletSync({ env, profile });
  const { onError } = useErrorHandlerContext();
  const { sign } = useMessageSigner();

  const reject = (message: string = 'Sign message denied!') => {
    browser.runtime.sendMessage({
      type: 'SIGN_MESSAGE_REJECT',
      data: {
        domain,
        status: 'failed',
        message,
        tabId,
      },
    });
  };

  const setSubmitted = useNotifyOnUnload(reject);

  const onSubmit = async () => {
    try {
      const loadingModal = {
        isOpen: true,
        isLoading: true,
        completedMessage: 'Signed Successfully',
        loadingMessage: 'Signing...',
      };

      if (wallet.isLedger()) {
        await approveWithLedger(profile, wallet);
      } else {
        dispatch(ModalStore.loadingModalUpdated(loadingModal));
      }

      await syncAll(wallet);

      const signedMessageResult = await sign(wallet, message, {
        abortSignal: abortReference.signal,
      });

      if (wallet.isLedger()) {
        closeLedgerScreen();
      }

      await browser.runtime.sendMessage({
        type: 'SIGN_MESSAGE_RESOLVE',
        data: {
          domain,
          status: 'success',
          message: message,
          signature: signedMessageResult.signature,
          signatory: signedMessageResult.signatory,
          tabId,
          sessionId: session.id,
        },
      });

      dispatch(
        ModalStore.loadingModalUpdated({
          ...loadingModal,
          isLoading: false,
        }),
      );

      setSubmitted();

      await removeWindowInstance(
        location.state?.windowId,
        constants.CLOSE_WINDOW_AFTER_ACTION_TIMEOUT,
      );
    } catch (error: any) {
      if (wallet.isLedger()) {
        closeLedgerScreen();
      }

      reject(error.message);
      onError(error);
    }
  };

  const onCancel = async () => {
    reject();

    dispatch(
      ModalStore.loadingModalUpdated({
        isOpen: false,
        isLoading: false,
      }),
    );
    await removeWindowInstance(location.state?.windowId, 100);
  };

  return (
    <>
      <ApproveHeader
        actionType={ApproveActionType.SIGNATURE}
        appName={session.domain}
        appLogo={session.logo}
      />
      <ApproveBody header='Signing with' wallet={wallet}>
        <RequestedSignatureMessage data={{ message }} />
      </ApproveBody>
      <ApproveFooter onSubmit={onSubmit} onCancel={onCancel} />
    </>
  );
};

export default ApproveMessage;
