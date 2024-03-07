import { useEffect } from 'react';
import Balance from '@/components/wallet/Balance';
import { ExternalLink, FlexContainer, Icon, Layout, Paragraph } from '@/shared/components';
import constants from '@/constants';
import { clearPersistScreenData } from '@/components/wallet/form-persist/helpers';
import { useProfileContext } from '@/lib/context/Profile';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
import useThemeMode from '@/lib/hooks/useThemeMode';

const Home = () => {
    const { convertedBalance } = useProfileContext();

    const primaryWallet = usePrimaryWallet();

    const { getThemeColor } = useThemeMode();

    useEffect(() => {
        clearPersistScreenData();
    }, []);

    return (
        <Layout data-testid='Home'>
            <div className='shadow-light m-4 rounded-b-2xl rounded-t-[20px] bg-white dark:bg-subtle-black'>
                <div className=' rounded-[20px] bg-theme-primary-700 text-white dark:bg-theme-primary-650'>
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
                            gridGap='8px'
                            alignItems='center'
                            display='flex'
                            href={
                                primaryWallet?.network().isLive()
                                    ? `${constants.ARKSCAN_ADDRESSES}/${primaryWallet?.address()}`
                                    : `${
                                          constants.ARKSCAN_TEST_ADDRESSES
                                      }/${primaryWallet?.address()}`
                            }
                        >
                            <Paragraph $typeset='body' fontWeight='medium'>
                                Explorer
                            </Paragraph>
                            <Icon icon='link-external' className='h-4 w-4' />
                        </ExternalLink>
                        <Icon
                            icon='divider'
                            className='h-4.5 w-0.5 text-theme-primary-650 dark:text-theme-primary-600'
                        />

                        <ExternalLink
                            gridGap='8px'
                            alignItems='center'
                            display='flex'
                            href={
                                primaryWallet?.network().isTest()
                                    ? constants.ARKSCAN_FAUCET
                                    : constants.ARKSCAN_EXCHANGES
                            }
                        >
                            <Paragraph $typeset='body' fontWeight='medium'>
                                {primaryWallet?.network().isTest() ? 'Faucet' : 'Exchanges'}
                            </Paragraph>
                            <Icon icon='link-external' className='h-4 w-4' />
                        </ExternalLink>
                    </div>
                </div>
                <ExternalLink
                    href={constants.ARK_CONNECT_DEMO}
                    color={getThemeColor('primary', 'primary600')}
                    display='block'
                    borderRadius='16'
                >
                    <FlexContainer
                        padding='16'
                        flexDirection='row'
                        justifyContent='space-between'
                        alignItems='center'
                    >
                        <Icon icon='speakerphone' className='h-4.5 w-4.5' />
                        <Paragraph $typeset='body' fontWeight='medium'>
                            Try Our Demo App Now!
                        </Paragraph>
                        <Icon icon='link-external' className='h-4 w-4' />
                    </FlexContainer>
                </ExternalLink>
            </div>
        </Layout>
    );
};

export default Home;
