import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import browser from 'webextension-polyfill';
import ConnectFooter from '@/components/connect/ConnectFooter';
import ConnectWithWallet from '@/components/connect/ConnectWithWallet';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { Layout } from '@/shared/components';
import { selectSessions, sessionAdded } from '@/lib/store/session';
import { selectPrimaryWalletId } from '@/lib/store/wallet';
import { loadingModalUpdated } from '@/lib/store/modal';
import { useProfileContext } from '@/lib/context/Profile';
import { selectLocked } from '@/lib/store/ui';
import { assertIsUnlocked } from '@/lib/background/assertions';
import ActionHeader from '@/shared/components/actions/ActionHeader';
import { useNotifyOnUnload } from '@/lib/hooks/useNotifyOnUnload';

const Connect = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const sessions = useAppSelector(selectSessions);
  const { profile } = useProfileContext();
  const primaryWalletId = useAppSelector(selectPrimaryWalletId);
  const primaryWallet = primaryWalletId ? profile.wallets().findById(primaryWalletId) : undefined;

  const locked = useAppSelector(selectLocked);
  assertIsUnlocked(locked);

  const reject = (message = 'Connection denied!') => {
    browser.runtime.sendMessage({
      type: 'CONNECT_REJECT',
      data: {
        domain: location.state?.domain,
        status: 'failed',
        message,
        tabId: location.state?.tabId,
      },
    });
  };

  const setSubmitted = useNotifyOnUnload(reject);

  const isAlreadyConnected = () => {
    return Object.values(sessions).some((session) => {
      return session.domain === location.state?.domain && session.walletId === primaryWallet?.id();
    });
  };

  const onSubmit = async () => {
    const loadingModal = {
      isOpen: true,
      isLoading: true,
      completedMessage: 'Securely Connected',
      loadingMessage: 'Connecting...',
    };

    const isConnected = isAlreadyConnected();

    dispatch(loadingModalUpdated(loadingModal));

    if (!primaryWallet) {
      reject('Wallet not found');
      return;
    }

    if (isConnected) {
      reject('Already connected!');
      return;
    }

    if (primaryWallet) {
      const sessionId = uuidv4();
      await dispatch(
        sessionAdded({
          id: sessionId,
          domain: location.state?.domain,
          createdAt: new Date().toISOString(),
          logo: location.state?.favicon,
          walletId: primaryWallet.id(),
        }),
      );

      await browser.runtime.sendMessage({
        type: 'CONNECT_RESOLVE',
        data: {
          domain: location.state?.domain,
          status: 'success',
          tabId: location.state?.tabId,
          sessionId: sessionId,
        },
      });

      setSubmitted();

      await browser.windows.remove(location.state?.windowId);
      return;
    }
  };

  const onCancel = async () => {
    reject();
    await browser.windows.remove(location.state?.windowId);
  };

  return (
    <Layout withHeader={false}>
      <ActionHeader
        appDomain={location.state?.domain}
        appLogo={location.state?.favicon}
        icon='action-connect'
        actionLabel='Connect to App'
        iconDimensions={{ width: 22, height: 31 }}
      />

      <ConnectWithWallet wallet={primaryWallet} />

      <ConnectFooter onSubmit={onSubmit} onCancel={onCancel} />
    </Layout>
  );
};

export default Connect;
