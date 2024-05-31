import { useEffect } from 'react';
import { runtime } from 'webextension-polyfill';
import { useTranslation } from 'react-i18next';
import Balance from '@/components/wallet/Balance';
import { ExternalLink, Icon, Layout } from '@/shared/components';
import constants from '@/constants';
import { useProfileContext } from '@/lib/context/Profile';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
import { LatestTransactions } from '@/components/home/LatestTransactions';
import { TransactionButtons } from '@/components/home/TransactionButtons';
const Home = () => {
    const { convertedBalance } = useProfileContext();

    const primaryWallet = usePrimaryWallet();

    useEffect(() => {
        void runtime.sendMessage({ type: 'CLEAR_LAST_SCREEN' });
    }, []);

    const { t } = useTranslation();

    return (
        <Layout data-testid='Home' withPadding={false}>
            <div className='m-4 rounded-2xl bg-white shadow-light dark:bg-subtle-black'>
                <div className='green:bg-theme-primary-700 green:dark:bg-theme-primary-650 rounded-2.5xl bg-theme-primary-600 text-white'>
                    <div className='p-4'>
                        <Balance
                            balance={primaryWallet?.balance() ?? 0}
                            currency={primaryWallet?.currency() ?? 'ARK'}
                            exchangeCurrency={primaryWallet?.exchangeCurrency() ?? 'USD'}
                            convertedBalance={convertedBalance}
                        />
                    </div>

                    <div className='green:border-t-theme-primary-650 green:dark:border-t-theme-primary-600 flex justify-between border-t border-solid border-t-theme-primary-500 p-4'>
                        <ExternalLink
                            className='flex items-center gap-2'
                            href={
                                primaryWallet?.network().isLive()
                                    ? `${constants.ARKSCAN_ADDRESSES}/${primaryWallet?.address()}`
                                    : `${
                                          constants.ARKSCAN_TEST_ADDRESSES
                                      }/${primaryWallet?.address()}`
                            }
                        >
                            <span className='text-sm font-medium'>{t('COMMON.EXPLORER')}</span>

                            <Icon icon='link-external' className='h-4 w-4' />
                        </ExternalLink>

                        <Icon
                            icon='divider'
                            className='green:text-theme-primary-650 green:dark:text-theme-primary-600 h-4.5 w-0.5 text-theme-primary-500'
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
