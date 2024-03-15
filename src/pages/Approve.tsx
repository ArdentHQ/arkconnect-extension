import { Contracts } from '@ardenthq/sdk-profiles';
import { useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Layout } from '@/shared/components';
import ApproveTransaction from '@/components/approve/ApproveTransaction';
import ApproveMessage from '@/components/approve/ApproveMessage';
import ApproveVote from '@/components/approve/ApproveVote';
import { useLedgerContext } from '@/lib/Ledger';
import Modal from '@/shared/components/modal/Modal';
import ApproveWithLedger from '@/components/ledger/ApproveWithLedger';
import { isLedgerTransportSupported } from '@/lib/Ledger/transport';
import * as WalletStore from '@/lib/store/wallet';
import { useAppSelector } from '@/lib/store';
import { useProfileContext } from '@/lib/context/Profile';
import * as UIStore from '@/lib/store/ui';
import { assertIsUnlocked } from '@/lib/background/assertions';

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
    const { connect, listenDevice, hasDeviceAvailable } = useLedgerContext();
    const abortReference = useRef(new AbortController());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const wallets = useAppSelector(WalletStore.selectWallets);
    const [approveWithLedgerResolver, setApproveWithLedgerResolver] = useState<() => void>();

    const walletData = wallets.find(
        (wallet) => wallet.walletId === location.state.session.walletId,
    )!;
    const wallet = profile.wallets().findById(walletData?.walletId);

    const locked = useAppSelector(UIStore.selectLocked);
    assertIsUnlocked(locked);

    // Resolve the promise that waits for the device to be available once it is
    useEffect(() => {
        if (hasDeviceAvailable && approveWithLedgerResolver !== undefined) {
            approveWithLedgerResolver();

            setApproveWithLedgerResolver(undefined);
        }
    }, [hasDeviceAvailable, approveWithLedgerResolver]);

    const approveWithLedger = async (
        profile: Contracts.IProfile,
        wallet: Contracts.IReadWriteWallet,
    ) => {
        if (!isLedgerTransportSupported()) {
            throw new Error('Ledger Transport is not supported!');
        }

        setIsModalOpen(true);

        // Wait for the device to be available
        await new Promise<void>((resolve) => {
            if (!hasDeviceAvailable) {
                listenDevice();

                setApproveWithLedgerResolver(() => resolve);
            } else {
                resolve();
            }
        });

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
                    className='m-0 min-h-screen bg-theme-warning-600 dark:bg-theme-warning-400'
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
        </Layout>
    );
};

export default Approve;
