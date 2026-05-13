import { Trans } from 'react-i18next';
import { EmptyConnectionsIcon, Layout } from '@/shared/components';
const WalletNotFound = () => {
    return (
        <Layout>
            <div className='m-4 flex min-h-full flex-col items-center justify-center'>
                <div className='flex max-w-[210px] flex-col items-center justify-center'>
                    <EmptyConnectionsIcon />
                    <p className='typeset-headline text-light-black mt-6 text-center dark:text-white'>
                        <Trans i18nKey='PAGES.WALLET_NOT_FOUND.YOU_DONT_HAVE_ANY_WALLET' />
                    </p>
                </div>
            </div>
        </Layout>
    );
};

export default WalletNotFound;
