import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { runtime } from 'webextension-polyfill';
import { Contracts } from '@ardenthq/sdk-profiles';
import { BigNumber } from '@ardenthq/sdk-helpers';
import { useTranslation } from 'react-i18next';
import { ApproveLayout } from './ApproveLayout';
import { ActionBody } from '@/components/approve/ActionBody';
import ApproveBody from '@/components/approve/ApproveBody';
import ApproveFooter from '@/components/approve/ApproveFooter';
import ApproveHeader from '@/components/approve/ApproveHeader';
import { useSendTransferForm } from '@/lib/hooks/useSendTransferForm';
import { useErrorHandlerContext } from '@/lib/context/ErrorHandler';
import { useProfileContext } from '@/lib/context/Profile';
import { ApproveActionType } from '@/pages/Approve';
import removeWindowInstance from '@/lib/utils/removeWindowInstance';
import { WalletNetwork } from '@/lib/store/wallet';
import useWalletSync from '@/lib/hooks/useWalletSync';
import { useEnvironmentContext } from '@/lib/context/Environment';
import { useExchangeRate } from '@/lib/hooks/useExchangeRate';
import { useNotifyOnUnload } from '@/lib/hooks/useNotifyOnUnload';
import useLoadingModal from '@/lib/hooks/useLoadingModal';
import { useWaitForConnectedDevice } from '@/lib/Ledger';
import { getNetworkCurrency } from '@/lib/utils/getActiveCoin';
import { OneTimeEvents } from '@/OneTimeEventHandlers';
import { ProfileData, ScreenName } from '@/lib/background/contracts';
import constants from '@/constants';

type Props = {
    abortReference: AbortController;
    approveWithLedger: (
        profile: Contracts.IProfile,
        wallet: Contracts.IReadWriteWallet,
    ) => Promise<void>;
    wallet: Contracts.IReadWriteWallet;
    closeLedgerScreen: () => void;
    loadingModal: ReturnType<typeof useLoadingModal>;
};

const ApproveTransaction = ({
    abortReference,
    approveWithLedger,
    wallet,
    closeLedgerScreen,
    loadingModal,
}: Props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const {
        domain,
        tabId,
        session,
        amount,
        receiverAddress,
        fee: customFee,
        memo,
        feeClass,
    } = location.state;
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
    const exchangeCurrency = wallet.exchangeCurrency() ?? 'USD';
    const coin = getNetworkCurrency(wallet.network());
    const withFiat = wallet.network().isLive();
    const isNative = session.domain === constants.APP_NAME;

    const {
        formValuesLoaded,
        resetForm,
        submitForm,
        values: { fee, total, hasHigherCustomFee, hasLowerCustomFee },
    } = useSendTransferForm(wallet, {
        session,
        amount,
        receiverAddress,
        customFee,
        memo,
    });

    const [showHigherCustomFeeBanner, setShowHigherCustomFeeBanner] = useState(true);

    useEffect(() => {
        if (BigNumber.make(amount).plus(fee).isGreaterThan(wallet.balance())) {
            setError(t('PAGES.APPROVE.FEEDBACK.INSUFFICIENT_BALANCE'));
        } else {
            setError(undefined);
        }
    }, [wallet, fee, amount]);

    const reject = (message: string = t('PAGES.APPROVE.FEEDBACK.SIGN_TRANSACTION_DENIED')) => {
        runtime.sendMessage({
            type: 'SIGN_TRANSACTION_REJECT',
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
                loadingModal.setLoading();
            }

            const response = await submitForm(abortReference);

            const transaction = {
                id: response.id as string,
                exchangeCurrency: wallet.exchangeCurrency() ?? 'USD',
                sender: response.sender as string,
                receiver: response.recipient as string,
                memo: response.data?.vendorField as string,
                amount: response.amount as number,
                convertedAmount: convert(response.amount),
                fee: response.fee as number,
                convertedFee: convert(response.fee),
                total: response.total as number,
                convertedTotal: convert(response.total),
            };

            if (wallet.isLedger()) {
                closeLedgerScreen();
            }

            await runtime.sendMessage({
                type: 'SIGN_TRANSACTION_RESOLVE',
                data: {
                    domain,
                    status: 'success',
                    transaction,
                    tabId,
                    sessionId: session.id,
                },
            });

            setSubmitted();

            await loadingModal.closeDelayed();

            navigate('/transaction/success', {
                state: {
                    transaction,
                    walletId: wallet.id(),
                    windowId: location.state?.windowId,
                    walletNetwork: wallet.network().isTest()
                        ? WalletNetwork.DEVNET
                        : WalletNetwork.MAINNET,
                    isTestnet: wallet.network().isTest(),
                    session,
                },
            });
        } catch (error: any) {
            if (wallet.isLedger()) {
                closeLedgerScreen();
            }

            await runtime.sendMessage({ type: OneTimeEvents.CLEAR_LAST_SCREEN });
            profile.settings().forget(ProfileData.LastVisitedPage);

            reject(error.message);

            onError(error);

            profile.settings().set(ProfileData.LastVisitedPage, {
                path: ScreenName.SendTransfer,
                data: {
                    amount,
                    memo,
                    fee: customFee,
                    receiverAddress,
                },
            });
            loadingModal.close();
        }
    };

    const onCancel = async () => {
        abortReference.abort();
        resetForm();
        setError(undefined);

        reject();

        if (location.state.windowId) {
            await removeWindowInstance(location.state?.windowId, 100);
        }
        loadingModal.close();

        const params = new URLSearchParams({
            receiverAddress,
            memo,
            amount,
            fee: customFee,
            feeClass,
        });
        isNative ? navigate(`/transaction/send?${params.toString()}`) : navigate('/');
    };

    return (
        <ApproveLayout
            appDomain={session.domain}
            appLogo={session.logo}
            footer={
                <ApproveFooter
                    disabled={!!error || !formValuesLoaded}
                    onSubmit={onSubmit}
                    onCancel={onCancel}
                    isNative={isNative}
                />
            }
            className='pt-6'
            showHigherCustomFeeBanner={showHigherCustomFeeBanner}
            setShowHigherCustomFeeBanner={setShowHigherCustomFeeBanner}
            hasHigherCustomFee={hasHigherCustomFee}
            hasLowerCustomFee={hasLowerCustomFee}
            wallet={wallet}
        >
            <ApproveHeader actionType={ApproveActionType.TRANSACTION} />
            <ApproveBody header={t('PAGES.APPROVE.SENDING_WITH')} wallet={wallet} error={error}>
                <ActionBody
                    isApproved={false}
                    showFiat={withFiat}
                    amount={amount}
                    memo={memo}
                    amountTicker={coin}
                    convertedAmount={convert(amount)}
                    exchangeCurrency={exchangeCurrency}
                    network={getNetworkCurrency(wallet.network())}
                    fee={fee}
                    convertedFee={convert(fee)}
                    receiver={receiverAddress}
                    totalAmount={total}
                    convertedTotalAmount={convert(total)}
                    hasHigherCustomFee={hasHigherCustomFee}
                    hasLowerCustomFee={hasLowerCustomFee}
                />
            </ApproveBody>
        </ApproveLayout>
    );
};

export default ApproveTransaction;
