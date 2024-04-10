import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { runtime } from 'webextension-polyfill';
import { Contracts } from '@ardenthq/sdk-profiles';
import { useTranslation } from 'react-i18next';
import { HigherFeeBanner } from './HigherCustomFee.blocks';
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
import useWalletSync from '@/lib/hooks/useWalletSync';
import { useEnvironmentContext } from '@/lib/context/Environment';
import { useNotifyOnUnload } from '@/lib/hooks/useNotifyOnUnload';
import useLoadingModal from '@/lib/hooks/useLoadingModal';
import { useWaitForConnectedDevice } from '@/lib/Ledger';
import { ActionBody } from '@/components/approve/ActionBody';
import { getNetworkCurrency } from '@/lib/utils/getActiveCoin';

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
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;
    const { profile } = useProfileContext();
    const { env } = useEnvironmentContext();
    const { syncAll } = useWalletSync({ env, profile });
    const { onError } = useErrorHandlerContext();
    const [error, setError] = useState<string | undefined>();
    const { t } = useTranslation();
    const { convert } = useExchangeRate({
        exchangeTicker: wallet.exchangeCurrency(),
        ticker: wallet.currency(),
    });
    const { waitUntilLedgerIsConnected } = useWaitForConnectedDevice();
    const { fee: customFee } = location.state;
    const [showHigherCustomFeeBanner, setShowHigherCustomFeeBanner] = useState(true);

    const {
        resetForm,
        submitForm,
        loading,
        values: { fee, vote, unvote, hasHigherCustomFee },
    } = useVoteForm(wallet, { customFee, ...state });

    useEffect(() => {
        if (wallet.balance() < fee) {
            setError(t('PAGES.APPROVE.FEEDBACK.INSUFFICIENT_BALANCE'));
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
                return t('PAGES.APPROVE.FEEDBACK.PROCESSING_THE_VOTE');
            case ApproveActionType.UNVOTE:
                return t('PAGES.APPROVE.FEEDBACK.PROCESSING_THE_UNVOTE');
            case ApproveActionType.SWITCH_VOTE:
                return t('PAGES.APPROVE.FEEDBACK.PROCESSING_THE_VOTE_SWITCH');
            default:
                return '';
        }
    };

    const loadingModal = useLoadingModal({
        loadingMessage: getLoadingMessage(actionType),
    });

    const reject = (message: string = t('PAGES.APPROVE.FEEDBACK.SIGN_VOTE_DENIED')) => {
        runtime.sendMessage({
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
            if (!wallet.isLedger()) {
                loadingModal.setLoading();
            }

            await syncAll(wallet);

            if (wallet.isLedger()) {
                await approveWithLedger(profile, wallet);
                await waitUntilLedgerIsConnected();
                loadingModal.setLoading();
            }

            const res = await submitForm(abortReference);

            if (wallet.isLedger()) {
                closeLedgerScreen();
            }

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

            await runtime.sendMessage({
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

            await loadingModal.closeDelayed();

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
            {showHigherCustomFeeBanner && hasHigherCustomFee && (
                <HigherFeeBanner
                    averageFee={hasHigherCustomFee}
                    coin={wallet.currency()}
                    onClose={() => setShowHigherCustomFeeBanner(false)}
                />
            )}
            <ApproveHeader
                actionType={actionType}
                appName={state.session.domain}
                appLogo={state.session.logo}
            />

            <ApproveBody header={t('PAGES.APPROVE.APPROVING_WITH')} wallet={wallet} error={error}>
                <ActionBody
                    isApproved={false}
                    showFiat={wallet.network().isLive()}
                    wallet={wallet}
                    fee={fee}
                    convertedFee={convert(fee)}
                    exchangeCurrency={wallet.exchangeCurrency() ?? 'USD'}
                    network={getNetworkCurrency(wallet.network())}
                    unvote={{
                        delegateName: unvote?.wallet?.username(),
                        publicKey: unvote?.wallet?.publicKey(),
                        delegateAddress: unvote?.wallet?.address(),
                    }}
                    vote={{
                        delegateName: vote?.wallet?.username(),
                        publicKey: vote?.wallet?.publicKey(),
                        delegateAddress: vote?.wallet?.address(),
                    }}
                    maxHeight='165px'
                    hasHigherCustomFee={hasHigherCustomFee}
                    amountTicker={wallet.currency()}
                />
            </ApproveBody>
            <ApproveFooter disabled={!!error} onSubmit={onSubmit} onCancel={onCancel} />
        </HandleLoadingState>
    );
};

export default ApproveVote;
