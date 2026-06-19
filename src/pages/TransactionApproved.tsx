import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { runtime, windows } from 'webextension-polyfill';
import { BigNumber } from '../lib/helpers';
import { useEnvironmentContext } from '@/lib/context/Environment';
import { useProfileContext } from '@/lib/context/Profile';
import formatDomain from '@/lib/utils/formatDomain';
import removeWindowInstance from '@/lib/utils/removeWindowInstance';
import constants from '@/constants';
import { Button, ExternalLink, Heading, Icon, Loader } from '@/shared/components';
import { WalletNetwork } from '@/lib/store/wallet';
import { ActionBody } from '@/components/approve/ActionBody';
import getActiveCoin from '@/lib/utils/getActiveCoin';
import { useConfirmedTransaction } from '@/lib/hooks/useConfirmedTransaction';
import { ApproveLayout } from '@/components/approve/ApproveLayout';
import { Footer } from '@/shared/components/layout/Footer';

const TransactionFooter = ({
    onClose,
    isTransactionConfirmed,
    explorerLink,
}: {
    isTransactionConfirmed: boolean;
    onClose: () => void;
    explorerLink: string;
}) => {
    const { t } = useTranslation();

    return (
        <Footer className='flex flex-col gap-5'>
            <Button variant='primary' onClick={onClose}>
                {t('ACTION.CLOSE')}
            </Button>

            {isTransactionConfirmed && (
                <ExternalLink
                    className='text-light-black flex w-full items-center justify-center gap-3 dark:text-white'
                    href={explorerLink}
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
        </Footer>
    );
};

const TransactionApproved = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { profile } = useProfileContext();
    const { env } = useEnvironmentContext();
    const { session } = state;
    const { t } = useTranslation();
    const closeSidepanel = async () => {
        const win = await windows.getCurrent();
        if (win.id !== undefined) {
            await runtime.sendMessage({ type: 'CLOSE_SIDEPANEL', data: { windowId: win.id } });
        }
    };

    const isUserInitiated = state?.session?.domain === constants.APP_NAME;

    const onClose = async () => {
        if (isUserInitiated || state?.sidepanelWasOpen) {
            navigate('/');
        } else if (state?.windowId) {
            await removeWindowInstance(state?.windowId);
        } else {
            await closeSidepanel();
        }
    };

    const transactionId = state?.transaction.id;
    const wallet = profile.wallets().findById(state?.walletId);
    const explorerLink = wallet.link().transaction(transactionId);

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
                    explorerLink={explorerLink}
                />
            }
        >
            <div className='flex w-full flex-col items-center justify-between gap-6 px-4 py-6'>
                <div className='flex w-full flex-col items-center gap-4'>
                    <div className='flex flex-row items-center justify-center gap-3'>
                        {isTransactionConfirmed ? (
                            <Icon
                                icon='completed'
                                className='text-theme-primary-700 dark:text-theme-primary-650 h-6 w-6'
                            />
                        ) : (
                            <div className='bg-theme-primary-700 dark:bg-theme-primary-650 flex h-6 w-6 items-center justify-center rounded-full'>
                                <Icon
                                    icon='pending'
                                    className='text-theme-primary-700 dark:text-theme-primary-650 h-4 w-4'
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
                            convertedAmount={state?.transaction.convertedAmount as BigNumber}
                            exchangeCurrency={state?.transaction.exchangeCurrency as string}
                            network={getActiveCoin(state?.walletNetwork)}
                            showFiat={showFiat && !state?.transaction.tokenAddress}
                            receiver={state?.transaction.receiver}
                            fee={state?.transaction.fee}
                            convertedFee={state?.transaction.convertedFee as BigNumber}
                            totalAmount={state?.transaction.total}
                            convertedTotalAmount={state?.transaction.convertedTotal as BigNumber}
                            amountTicker={
                                state?.transaction.tokenSymbol ??
                                getActiveCoin(state?.walletNetwork)
                            }
                            feeTicker={
                                state?.transaction.tokenAddress
                                    ? getActiveCoin(state?.walletNetwork)
                                    : undefined
                            }
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
