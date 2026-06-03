import { useEffect } from 'react';
import { runtime } from 'webextension-polyfill';
import { useTranslation } from 'react-i18next';
import { BigNumber } from '../lib/helpers';
import Balance from '@/components/wallet/Balance';
import { ExternalLink, Icon, Layout } from '@/shared/components';
import constants from '@/constants';
import { useProfileContext } from '@/lib/context/Profile';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
import { LatestTransactions } from '@/components/home/LatestTransactions';
import { TransactionButtons } from '@/components/home/TransactionButtons';
const Home = () => {
    const primaryWallet = usePrimaryWallet();

    useEffect(() => {
        void runtime.sendMessage({ type: 'CLEAR_LAST_SCREEN' });
    }, []);

    const { t } = useTranslation();

    return (
        <Layout data-testid='Home' withPadding={false}>
            <div className='shadow-light dark:bg-subtle-black m-4 rounded-2xl bg-white'>
                <div className='rounded-2.5xl bg-theme-primary-600 green:bg-theme-primary-700 green:dark:bg-theme-primary-650 text-white'>
                    <div className='p-4'>
                        <Balance
                            balance={primaryWallet?.balance() ?? BigNumber.ZERO}
                            currency={primaryWallet?.currency() ?? 'ARK'}
                        />
                    </div>

                    <div className='border-t-theme-primary-500 green:border-t-theme-primary-650 green:dark:border-t-theme-primary-600 flex justify-between border-t border-solid p-4'>
                        <ExternalLink
                            className='flex items-center gap-2'
                            href={primaryWallet?.explorerLink()}
                        >
                            <span className='text-sm font-medium'>{t('COMMON.EXPLORER')}</span>

                            <Icon icon='link-external' className='h-4 w-4' />
                        </ExternalLink>

                        <Icon
                            icon='divider'
                            className='text-theme-primary-500 green:text-theme-primary-650 green:dark:text-theme-primary-600 h-4.5 w-0.5'
                        />

                        <ExternalLink
                            className='flex items-center gap-2'
                            href={
                                primaryWallet?.network().isTest()
                                    ? constants.ARKSCAN_FAUCET
                                    : constants.ARKSCAN_EXCHANGES
                            }
                        >
                            <span className='text-sm font-medium'>
                                {primaryWallet?.network().isTest()
                                    ? t('COMMON.FAUCET')
                                    : t('COMMON.EXCHANGES')}
                            </span>
                            <Icon icon='link-external' className='h-4 w-4' />
                        </ExternalLink>
                    </div>
                </div>
            </div>
            <TransactionButtons />
            <LatestTransactions />
        </Layout>
    );
};

export default Home;
