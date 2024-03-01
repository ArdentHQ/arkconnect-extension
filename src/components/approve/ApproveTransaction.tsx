import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { runtime, tabs } from 'webextension-polyfill';
import { Contracts } from '@ardenthq/sdk-profiles';
import { BigNumber } from '@ardenthq/sdk-helpers';
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
import RequestedTransactionBody from '@/components/approve/RequestedTransactionBody';
import { useExchangeRate } from '@/lib/hooks/useExchangeRate';
import { useNotifyOnUnload } from '@/lib/hooks/useNotifyOnUnload';
import useLoadingModal from '@/lib/hooks/useLoadingModal';

type Props = {
    abortReference: AbortController;
    approveWithLedger: (
        profile: Contracts.IProfile,
        wallet: Contracts.IReadWriteWallet,
    ) => Promise<void>;
    wallet: Contracts.IReadWriteWallet;
    closeLedgerScreen: () => void;
};

const ApproveTransaction = ({
    abortReference,
    approveWithLedger,
    wallet,
    closeLedgerScreen,
}: Props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { domain, tabId, session, amount, receiverAddress } = location.state;
    const { profile } = useProfileContext();
    const { env } = useEnvironmentContext();
    const { syncAll } = useWalletSync({ env, profile });
    const { onError } = useErrorHandlerContext();
    const [error, setError] = useState<string | undefined>();
    const loadingModal = useLoadingModal({
        loadingMessage: 'Processing transaction...',
    });
    const { convert } = useExchangeRate({
        exchangeTicker: wallet.exchangeCurrency(),
        ticker: wallet.currency(),
    });

    const {
        formValuesLoaded,
        resetForm,
        submitForm,
        values: { fee, total },
    } = useSendTransferForm(wallet, {
        session,
        amount,
        receiverAddress,
    });

    useEffect(() => {
        if (BigNumber.make(amount).plus(fee).isGreaterThan(wallet.balance())) {
            setError('Insufficient balance. Add funds or switch address.');
        } else {
            setError(undefined);
        }
    }, [wallet, fee, amount]);

    const reject = (message: string = 'Sign transaction denied!') => {
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
            }

            const response = await submitForm(abortReference);

            const transaction = {
                id: response.id as string,
                exchangeCurrency: wallet.exchangeCurrency() ?? 'USD',
                sender: response.sender as string,
                receiver: response.recipient as string,
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
        <>
            <ApproveHeader
                actionType={ApproveActionType.TRANSACTION}
                appName={session.domain}
                appLogo={session.logo}
            />
            <ApproveBody header='Sending with' wallet={wallet} error={error}>
                <RequestedTransactionBody
                    amount={amount}
                    receiverAddress={receiverAddress}
                    fee={fee}
                    total={total}
                    wallet={wallet}
                />
            </ApproveBody>
            <ApproveFooter
                disabled={!!error || !formValuesLoaded}
                onSubmit={onSubmit}
                onCancel={onCancel}
            />
        </>
    );
};

export default ApproveTransaction;
