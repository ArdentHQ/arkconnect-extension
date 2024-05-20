import { Contracts } from '@ardenthq/sdk-profiles';
import { useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Layout } from '@/shared/components';
import ApproveTransaction from '@/components/approve/ApproveTransaction';
import ApproveMessage from '@/components/approve/ApproveMessage';
import ApproveVote from '@/components/approve/ApproveVote';
import { useLedgerContext, useWaitForAvailableDevice } from '@/lib/Ledger';
import Modal from '@/shared/components/modal/Modal';
import ApproveWithLedger from '@/components/ledger/ApproveWithLedger';
import { isLedgerTransportSupported } from '@/lib/Ledger/transport';
import * as WalletStore from '@/lib/store/wallet';
import { useAppSelector } from '@/lib/store';
import { useProfileContext } from '@/lib/context/Profile';
import * as UIStore from '@/lib/store/ui';
import { assertIsUnlocked } from '@/lib/background/assertions';
import useWalletSync from '@/lib/hooks/useWalletSync';
import { useEnvironmentContext } from '@/lib/context/Environment';

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
    const abortReference = useRef(new AbortController());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { env } = useEnvironmentContext();
    const wallets = useAppSelector(WalletStore.selectWallets);
    const { waitUntilLedgerIsAvailable } = useWaitForAvailableDevice();
    const { syncAll } = useWalletSync({ env, profile });

    const walletData = wallets.find(
        (wallet) => wallet.walletId === location.state.session.walletId,
    )!;
    const wallet = profile.wallets().findById(walletData?.walletId);
    const { t } = useTranslation();

    useEffect(() => {
        (async () => {
            await syncAll(wallet);
        })();
    }, [wallet]);

    const locked = useAppSelector(UIStore.selectLocked);
    assertIsUnlocked(locked);

    const approveWithLedger = async (
        profile: Contracts.IProfile,
        wallet: Contracts.IReadWriteWallet,
    ) => {
        if (!isLedgerTransportSupported()) {
            throw new Error(t('ERROR.LEDGER_TRANSPORT_NOT_SUPPORTED'));
        }

        setIsModalOpen(true);

        await waitUntilLedgerIsAvailable();

        await connect(profile, wallet.coinId(), wallet.networkId(), undefined);
    };

    const closeLedgerScreen = () => {
        setIsModalOpen(false);
    };

    const hasVoted = wallet.voting().current().length > 0;
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
                    containerClassName='p-0'
                    className='m-0 max-h-screen min-h-screen overflow-auto bg-theme-warning-600 dark:bg-theme-warning-400'
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
                            location.state?.vote?.address ||
                            location.state?.unvote?.address ||
                            wallet?.address()
                        }
                        wallet={wallet}
                    />
                </Modal>
            )}
        </Layout>
    );
};

export default Approve;
