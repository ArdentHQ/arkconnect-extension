import { Contracts } from '@ardenthq/sdk-profiles';
import { Button, Layout } from '@/shared/components';
import { useLocation } from 'react-router-dom';
import ApproveTransaction from '@/components/approve/ApproveTransaction';
import ApproveMessage from '@/components/approve/ApproveMessage';
import ApproveVote from '@/components/approve/ApproveVote';
import { useEffect, useRef, useState } from 'react';
import { useLedgerContext } from '@/lib/Ledger';
import Modal from '@/shared/components/modal/Modal';
import ApproveWithLedger from '@/components/ledger/ApproveWithLedger';
import { isLedgerTransportSupported } from '@/lib/Ledger/transport';
import * as WalletStore from '@/lib/store/wallet';
import useCountTestnetAddresses from '@/lib/hooks/useNoTestnetAddressFound';
import NoTestnetAddressFound from '@/components/approve/NoTestnetAddressFound';
import removeWindowInstance from '@/lib/utils/removeWindowInstance';
import { useAppSelector } from '@/lib/store';
import { useProfileContext } from '@/lib/context/Profile';
import * as UIStore from '@/lib/store/ui';
import { assertIsUnlocked } from '@/lib/background/assertions';
import useThemeMode from '@/lib/hooks/useThemeMode';

export enum ApproveActionType {
  SIGNATURE = 'signature',
  TRANSACTION = 'transfer',
  VOTE = 'vote',
  UNVOTE = 'unvote',
  SWITCH_VOTE = 'switch-vote',
}

const Approve = () => {
  const location = useLocation();
  const { profile } = useProfileContext();
  const { connect } = useLedgerContext();
  const { getThemeColor } = useThemeMode();
  const abortReference = useRef(new AbortController());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTestnetModalOpen, setIsTestnetModalOpen] = useState(false);
  const testnetWalletsLength = useCountTestnetAddresses();
  const wallets = useAppSelector(WalletStore.selectWallets);

  const walletData = wallets.find((wallet) => wallet.walletId === location.state.session.walletId)!;
  const wallet = profile.wallets().findById(walletData?.walletId);

  const locked = useAppSelector(UIStore.selectLocked);
  assertIsUnlocked(locked);

  useEffect(() => {
    if (location.state?.network === WalletStore.WalletNetwork.MAINNET) return;

    if (!testnetWalletsLength) setIsTestnetModalOpen(true);
  }, []);

  const approveWithLedger = async (
    profile: Contracts.IProfile,
    wallet: Contracts.IReadWriteWallet,
  ) => {
    if (!isLedgerTransportSupported()) {
      throw new Error('Ledger Transport is not supported!');
    }
    setIsModalOpen(true);
    await connect(profile, wallet.coinId(), wallet.networkId(), undefined, true);
  };

  const closeLedgerScreen = () => {
    setIsModalOpen(false);
  };

  const handleRemoveWindowInstance = async () => {
    await removeWindowInstance(location.state?.windowId);
  };

  let actionType =
    location.state?.type === ApproveActionType.VOTE
      ? ApproveActionType.VOTE
      : ApproveActionType.UNVOTE;

  const hasVoted = wallet.voting().current().length > 0;

  if (actionType === ApproveActionType.VOTE && hasVoted) {
    actionType = ApproveActionType.SWITCH_VOTE;
  }

  const getActionType = (actionType: ApproveActionType): ApproveActionType => {
    switch (actionType) {
      case ApproveActionType.VOTE:
        return hasVoted ? ApproveActionType.SWITCH_VOTE : ApproveActionType.VOTE;
      default:
        return actionType;
    }
  };

  return (
    <Layout withHeader={false}>
      {location.state?.type === ApproveActionType.SIGNATURE && (
        <ApproveMessage
          abortReference={abortReference.current}
          approveWithLedger={approveWithLedger}
          wallet={wallet}
          closeLedgerScreen={closeLedgerScreen}
        />
      )}
      {location.state?.type === ApproveActionType.TRANSACTION && (
        <ApproveTransaction
          abortReference={abortReference.current}
          approveWithLedger={approveWithLedger}
          wallet={wallet}
          closeLedgerScreen={closeLedgerScreen}
        />
      )}
      {(location.state?.type === ApproveActionType.VOTE ||
        location.state?.type === ApproveActionType.UNVOTE) && (
        <ApproveVote
          abortReference={abortReference.current}
          approveWithLedger={approveWithLedger}
          wallet={wallet}
          closeLedgerScreen={closeLedgerScreen}
        />
      )}
      {isModalOpen && (
        <Modal
          onClose={() => {}}
          containerPadding='0'
          contentStyles={{
            minHeight: '100vh',
            margin: '0',
            backgroundColor: getThemeColor('warning600', 'warning400'),
          }}
          activateFocusTrap={false}
          hideCloseButton
        >
          <ApproveWithLedger
            actionType={getActionType(location.state?.type)}
            appName={location.state?.session?.domain}
            appLogo={location.state?.session?.logo}
            closeLedgerScreen={closeLedgerScreen}
            address={
              location.state?.receiverAddress ||
              location.state?.vote?.delegateAddress ||
              location.state?.unvote?.delegateAddress ||
              wallet?.address()
            }
            wallet={wallet}
          />
        </Modal>
      )}

      {isTestnetModalOpen && (
        <Modal
          onClose={() => {}}
          variant='danger'
          icon='alert-octagon'
          onCancel={handleRemoveWindowInstance}
          hideCloseButton
          footer={({ onCancel }) => (
            <Button variant='secondaryBlack' onClick={onCancel}>
              Close
            </Button>
          )}
        >
          <NoTestnetAddressFound />
        </Modal>
      )}
    </Layout>
  );
};

export default Approve;
