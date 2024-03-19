import { useEffect } from 'react';
import { runtime } from 'webextension-polyfill';
import { useTranslation } from 'react-i18next';
import Balance from '@/components/wallet/Balance';
import { ExternalLink, Icon, Layout } from '@/shared/components';
import constants from '@/constants';
import { useProfileContext } from '@/lib/context/Profile';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
const Home = () => {
    const { convertedBalance } = useProfileContext();

    const primaryWallet = usePrimaryWallet();

    useEffect(() => {
        void runtime.sendMessage({ type: 'CLEAR_LAST_SCREEN' });
    }, []);

    const { t } = useTranslation();

    return (
        <Layout data-testid='Home'>
            <div className='m-4 rounded-b-2xl rounded-t-2.5xl bg-white shadow-light dark:bg-subtle-black'>
                <div className=' rounded-2.5xl bg-theme-primary-700 text-white dark:bg-theme-primary-650'>
                    <div className='p-4'>
                        <Balance
                            balance={primaryWallet?.balance() ?? 0}
                            currency={primaryWallet?.currency() ?? 'ARK'}
                            exchangeCurrency={primaryWallet?.exchangeCurrency() ?? 'USD'}
                            convertedBalance={convertedBalance}
                        />
                    </div>

                    <div className='flex justify-between border-t border-solid border-t-theme-primary-650 p-4 dark:border-t-theme-primary-600'>
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
                            <span className='text-sm font-medium'>Explorer</span>

                            <Icon icon='link-external' className='h-4 w-4' />
                        </ExternalLink>

                        <Icon
                            icon='divider'
                            className='h-4.5 w-0.5 text-theme-primary-650 dark:text-theme-primary-600'
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
                                {primaryWallet?.network().isTest() ? 'Faucet' : 'Exchanges'}
                            </span>
                            <Icon icon='link-external' className='h-4 w-4' />
                        </ExternalLink>
                    </div>
                </div>

                <ExternalLink
                    href={constants.ARK_CONNECT_DEMO}
                    className='block rounded-2xl text-theme-primary-700 dark:text-theme-primary-600'
                >
                    <div className='flex flex-row items-center justify-between p-4'>
                        <Icon icon='speakerphone' className='h-4.5 w-4.5' />
                        <span className=' text-sm font-medium'>
                            {t('HOME.TRY_OUR_DEMO_APP_NOW')}
                        </span>
                        <Icon icon='link-external' className='h-4 w-4' />
                    </div>
                </ExternalLink>
            </div>
        </Layout>
    );
};

export default Home;
