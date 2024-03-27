import {useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import constants from '@/constants';
import { useEnvironmentContext } from '@/lib/context/Environment';
import { useProfileContext } from '@/lib/context/Profile';
import formatDomain from '@/lib/utils/formatDomain';
import removeWindowInstance from '@/lib/utils/removeWindowInstance';
import { Button, ExternalLink, Heading, Icon } from '@/shared/components';
import RequestedBy from '@/shared/components/actions/RequestedBy';
import { WalletNetwork } from '@/lib/store/wallet';
import { ActionBody } from '@/components/approve/ActionBody';
import trimAddress from '@/lib/utils/trimAddress';
import getActiveCoin from '@/lib/utils/getActiveCoin';

const TransactionApproved = () => {
    const { state } = useLocation();
    const { profile } = useProfileContext();
    const { env } = useEnvironmentContext();
    const { session } = state;
    const { t } = useTranslation();
    const onClose = async () => {
        await removeWindowInstance(state?.windowId);
    };

    const [isReady, setIsReady] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);

    const transactionId = state?.transaction.id;
    const wallet = profile.wallets().findById(state?.walletId);

    useEffect(() => {
        const sync = async () => {
            await profile.sync();
            await env.persist();

            setIsReady(true)
        }

        void sync();
    }, []);

    useEffect(() => {
        if (!isReady) return;
        const checkConfirmed = async () => {
            const id = setInterval(() => {
                try {
                    const confirm = wallet.transaction().transaction(transactionId).isConfirmed();
                    console.log("confirm result", confirm)
                    if (confirm) {
                        clearInterval(id);
                    }
                }catch (e) {
                    console.log("error", e)
                }
            }, 1000)

            console.log(confirm);
        }

        void checkConfirmed();
    }, [wallet.id(), transactionId, isReady])

    const showFiat = state.walletNetwork === WalletNetwork.MAINNET;



    return (
        <div className=' fixed left-0 top-0 z-10 flex w-full flex-col items-center justify-center bg-subtle-white dark:bg-light-black'>
            <RequestedBy appDomain={formatDomain(session.domain) || ''} appLogo={session.logo} />

            <div className=' flex w-full flex-col items-center justify-between gap-6 px-4 pt-6'>
                <div className='flex w-full flex-col items-center gap-6'>
                    <div className='flex flex-col items-center gap-4'>
                        <Icon
                            icon='completed'
                            className='h-16 w-16 text-theme-primary-700 dark:text-theme-primary-650'
                        />

                        <Heading level={3}>
                            {t('PAGES.TRANSACTION_APPROVED.TRANSACTION_APPROVED')}
                        </Heading>
                    </div>

                    <div className='w-full'>
                        <ActionBody
                            isApproved={false}
                            sender={trimAddress(state?.transaction.sender, 'short')}
                            amount={state?.transaction.amount}
                            convertedAmount={state?.transaction.convertedAmount as number}
                            exchangeCurrency={state?.transaction.exchangeCurrency as string}
                            network={getActiveCoin(state?.walletNetwork)}
                            showFiat={showFiat}
                            receiver={trimAddress(state?.transaction.receiver, 'short')}
                            fee={state?.transaction.fee}
                            convertedFee={state?.transaction.convertedFee as number}
                            totalAmount={state?.transaction.total}
                            convertedTotalAmount={state?.transaction.convertedTotal as number}
                            amountTicker={getActiveCoin(state?.walletNetwork)}
                            transactionId={state?.transaction.id}
                            maxHeight='229px'
                        />
                    </div>
                </div>

                <div className='flex w-full flex-col gap-5'>
                    <Button variant='primary' onClick={onClose}>
                        {t('ACTION.CLOSE')}
                    </Button>

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
                </div>
            </div>
        </div>
    );
};

export default TransactionApproved;
