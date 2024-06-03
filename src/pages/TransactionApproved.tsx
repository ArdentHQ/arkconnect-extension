import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import constants from '@/constants';
import { useEnvironmentContext } from '@/lib/context/Environment';
import { useProfileContext } from '@/lib/context/Profile';
import formatDomain from '@/lib/utils/formatDomain';
import removeWindowInstance from '@/lib/utils/removeWindowInstance';
import { Button, ExternalLink, Heading, Icon, Loader } from '@/shared/components';
import { WalletNetwork } from '@/lib/store/wallet';
import { ActionBody } from '@/components/approve/ActionBody';
import getActiveCoin from '@/lib/utils/getActiveCoin';
import { useConfirmedTransaction } from '@/lib/hooks/useConfirmedTransaction';
import { ApproveLayout } from '@/components/approve/ApproveLayout';

const TransactionFooter = ({
    onClose,
    isTransactionConfirmed,
    state,
}: {
    isTransactionConfirmed: boolean;
    state: any;
    onClose: () => void;
}) => {
    const { t } = useTranslation();

    return (
        <div className='flex w-full flex-col gap-5 bg-white p-4 shadow-button-container dark:bg-subtle-black dark:shadow-button-container-dark'>
            <Button variant='primary' onClick={onClose}>
                {t('ACTION.CLOSE')}
            </Button>

            {isTransactionConfirmed && (
                <ExternalLink
                    className='flex w-full items-center justify-center gap-3 text-light-black dark:text-white'
                    href={
                        state?.isTestnet
                            ? `${constants.ARKSCAN_TESTNET_TRANSACTIONS}/${state?.transaction.id}`
                            : `${constants.ARKSCAN_MAINNET_TRANSACTIONS}/${state?.transaction.id}`
                    }
                >
                    <span className='font-medium'>{t('MISC.VIEW_TRANSACTION_ON_ARKSCAN')}</span>

                    <Icon icon='link-external' className='h-5 w-5' />
                </ExternalLink>
            )}

            {!isTransactionConfirmed && (
                <div className='flex items-center justify-center gap-2'>
                    <Loader variant='warning' />
                    <p className='typeset-heading text-theme-warning-600 dark:text-theme-warning-200'>
                        {t('PAGES.PENDING_CONFIRMATION_MESSAGE')}
                    </p>
                </div>
            )}
        </div>
    );
};

const TransactionApproved = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { profile } = useProfileContext();
    const { env } = useEnvironmentContext();
    const { session } = state;
    const { t } = useTranslation();
    const onClose = async () => {
        if (state?.windowId) {
            await removeWindowInstance(state?.windowId);
        }
        navigate('/');
    };

    const transactionId = state?.transaction.id;
    const wallet = profile.wallets().findById(state?.walletId);

    const isTransactionConfirmed = useConfirmedTransaction({ wallet, transactionId });

    const showFiat = state.walletNetwork === WalletNetwork.MAINNET;

    useEffect(() => {
        profile.sync();
        env.persist();
    }, []);

    return (
        <ApproveLayout
            containerClassName='fixed left-0 top-0 z-10 w-full  items-center justify-center bg-subtle-white dark:bg-light-black'
            appDomain={formatDomain(session.domain) || ''}
            appLogo={session.logo}
            footer={
                <TransactionFooter
                    onClose={onClose}
                    isTransactionConfirmed={isTransactionConfirmed}
                    state={state}
                />
            }
        >
            <div className='flex w-full flex-col items-center justify-between gap-6 px-4 py-6'>
                <div className='flex w-full flex-col items-center gap-4'>
                    <div className='flex flex-row items-center justify-center gap-3'>
                        {isTransactionConfirmed ? (
                            <Icon
                                icon='completed'
                                className='h-6 w-6 text-theme-primary-700 dark:text-theme-primary-650'
                            />
                        ) : (
                            <div className='flex h-6 w-6 items-center justify-center rounded-full bg-theme-primary-700 dark:bg-theme-primary-650'>
                                <Icon
                                    icon='pending'
                                    className='h-4 w-4 text-theme-primary-700 dark:text-theme-primary-650'
                                />
                            </div>
                        )}

                        <Heading level={3}>
                            {isTransactionConfirmed
                                ? t('PAGES.TRANSACTION_APPROVED.TRANSACTION_APPROVED')
                                : t('PAGES.PENDING_CONFIRMATION')}
                        </Heading>
                    </div>

                    <div className='w-full'>
                        <ActionBody
                            isApproved={true}
                            sender={state?.transaction.sender}
                            amount={state?.transaction.amount}
                            memo={state?.transaction.memo}
                            convertedAmount={state?.transaction.convertedAmount as number}
                            exchangeCurrency={state?.transaction.exchangeCurrency as string}
                            network={getActiveCoin(state?.walletNetwork)}
                            showFiat={showFiat}
                            receiver={state?.transaction.receiver}
                            fee={state?.transaction.fee}
                            convertedFee={state?.transaction.convertedFee as number}
                            totalAmount={state?.transaction.total}
                            convertedTotalAmount={state?.transaction.convertedTotal as number}
                            amountTicker={getActiveCoin(state?.walletNetwork)}
                            transactionId={
                                isTransactionConfirmed ? state?.transaction.id : undefined
                            }
                        />
                    </div>
                </div>
            </div>
        </ApproveLayout>
    );
};

export default TransactionApproved;
