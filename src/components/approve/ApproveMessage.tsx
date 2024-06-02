import { useLocation } from 'react-router-dom';
import { runtime } from 'webextension-polyfill';
import { Contracts } from '@ardenthq/sdk-profiles';
import { useTranslation } from 'react-i18next';
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
import RequestedBy from '@/shared/components/actions/RequestedBy';

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

            const signedMessageResult = await sign(wallet, message, {
                abortSignal: abortReference.signal,
            });

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

            loadingModal.setCompleted();

            await removeWindowInstance(
                location.state?.windowId,
                constants.SHOW_MESSAGE_AFTER_ACTION_DURING_MS,
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

        loadingModal.close();

        await removeWindowInstance(location.state?.windowId, 100);
    };

    return (
        <div className='flex flex-col h-screen'>
            <div className='flex-none'>
                <RequestedBy appDomain={session.domain} appLogo={session.logo} />
            </div>
            <div className="flex-1 overflow-y-auto pt-6">
                <ApproveHeader actionType={ApproveActionType.SIGNATURE} />
                <ApproveBody header={t('PAGES.APPROVE.SIGNING_WITH')} wallet={wallet}>
                    <RequestedSignatureMessage data={{ message }} />
                </ApproveBody>
            </div>
            <div className='flex-none'>
                <ApproveFooter onSubmit={onSubmit} onCancel={onCancel} />
            </div>
        </div>
    );
};

export default ApproveMessage;
