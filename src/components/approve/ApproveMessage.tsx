import { useLocation, useNavigate } from 'react-router-dom';
import { runtime, windows } from 'webextension-polyfill';
import { useTranslation } from 'react-i18next';
import { ApproveLayout } from './ApproveLayout';
import { Contracts } from '@/lib/profiles';
import ApproveBody from '@/components/approve/ApproveBody';
import ApproveFooter from '@/components/approve/ApproveFooter';
import ApproveHeader from '@/components/approve/ApproveHeader';
import { useErrorHandlerContext } from '@/lib/context/ErrorHandler';
import { useProfileContext } from '@/lib/context/Profile';
import { ApproveActionType } from '@/pages/Approve';
import { useMessageSigner } from '@/lib/hooks/useMessageSigner';
import removeWindowInstance from '@/lib/utils/removeWindowInstance';
import useWalletSync from '@/lib/hooks/useWalletSync';
import { useEnvironmentContext } from '@/lib/context/Environment';
import RequestedSignatureMessage from '@/components/approve/RequestedSignatureMessage';
import { useNotifyOnUnload } from '@/lib/hooks/useNotifyOnUnload';
import useLoadingModal from '@/lib/hooks/useLoadingModal';
import constants from '@/constants';
import { useWaitForConnectedDevice } from '@/lib/Ledger';

type Props = {
    approveWithLedger: (
        profile: Contracts.IProfile,
        wallet: Contracts.IReadWriteWallet,
    ) => Promise<void>;
    wallet: Contracts.IReadWriteWallet;
    closeLedgerScreen: () => void;
};

const ApproveMessage = ({
    approveWithLedger,
    wallet,
    closeLedgerScreen,
}: Props) => {
    const location = useLocation();
    const { env } = useEnvironmentContext();
    const { domain, tabId, session, message } = location.state;
    const { profile } = useProfileContext();
    const { syncAll } = useWalletSync({ env, profile });
    const { onError } = useErrorHandlerContext();
    const { sign } = useMessageSigner();
    const { t } = useTranslation();
    const loadingModal = useLoadingModal({
        completedMessage: t('PAGES.APPROVE.FEEDBACK.SIGNED_SUCCESSFULLY'),
        loadingMessage: t('PAGES.APPROVE.FEEDBACK.SIGNING'),
    });
    const { waitUntilLedgerIsConnected } = useWaitForConnectedDevice();
    const navigate = useNavigate();

    const closeSidepanel = async () => {
        const win = await windows.getCurrent();
        if (win.id !== undefined) {
            await runtime.sendMessage({ type: 'CLOSE_SIDEPANEL', data: { windowId: win.id } });
        }
    };

    const dismissSidepanel = async () => {
        if (location.state?.sidepanelWasOpen) {
            navigate(-1);
        } else {
            await closeSidepanel();
        }
    };

    const reject = (message: string = t('PAGES.APPROVE.FEEDBACK.SIGN_MESSAGE_DENIED')) => {
        runtime.sendMessage({
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
            if (!wallet.isLedger()) {
                loadingModal.setLoading();
            }

            await syncAll(wallet);

            if (wallet.isLedger()) {
                await approveWithLedger(profile, wallet);

                await waitUntilLedgerIsConnected();
            }

            const signedMessageResult = await sign(wallet, message);

            if (wallet.isLedger()) {
                closeLedgerScreen();
            }

            await runtime.sendMessage({
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

            setSubmitted();

            if (location.state?.windowId) {
                loadingModal.setCompleted();
                await removeWindowInstance(
                    location.state.windowId,
                    constants.SHOW_MESSAGE_AFTER_ACTION_DURING_MS,
                );
            } else {
                await loadingModal.setCompletedAndClose();
                await dismissSidepanel();
            }
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

        loadingModal.close();

        if (location.state?.windowId) {
            await removeWindowInstance(location.state.windowId, 100);
        } else {
            await dismissSidepanel();
        }
    };

    return (
        <ApproveLayout
            appDomain={session.domain}
            appLogo={session.logo}
            footer={<ApproveFooter onSubmit={onSubmit} onCancel={onCancel} />}
            className='pt-6'
        >
            <>
                <ApproveHeader actionType={ApproveActionType.SIGNATURE} />
                <ApproveBody header={t('PAGES.APPROVE.SIGNING_WITH')} wallet={wallet}>
                    <RequestedSignatureMessage data={{ message }} />
                </ApproveBody>
            </>
        </ApproveLayout>
    );
};

export default ApproveMessage;
