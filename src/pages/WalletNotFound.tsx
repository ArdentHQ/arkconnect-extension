import { useTranslation } from 'react-i18next';
import filterXSS from 'xss';
import { EmptyConnectionsIcon, Layout } from '@/shared/components';
const WalletNotFound = () => {
    const { t } = useTranslation();

    return (
        <Layout>
            <div className='m-4 flex min-h-full flex-col items-center justify-center'>
                <div className='flex max-w-[210px] flex-col items-center justify-center'>
                    <EmptyConnectionsIcon />
                    <p className='typeset-headline mt-6 text-center text-light-black dark:text-white'>
                        <span
                            dangerouslySetInnerHTML={{
                                __html: filterXSS(
                                    t('PAGES.WALLET_NOT_FOUND.YOU_DONT_HAVE_ANY_WALLET'),
                                    {
                                        whiteList: {
                                            br: [],
                                        },
                                    },
                                ),
                            }}
                        ></span>
                    </p>
                </div>
            </div>
        </Layout>
    );
};

export default WalletNotFound;
