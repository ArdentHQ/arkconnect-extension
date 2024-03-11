import { EmptyConnectionsIcon, Layout } from '@/shared/components';

const WalletNotFound = () => {
    return (
        <Layout>
            <div className='m-4 flex min-h-full flex-col items-center justify-center'>
                <div className='flex max-w-[210px] flex-col items-center justify-center'>
                    <EmptyConnectionsIcon />
                    <p className='typeset-headline mt-6 text-center text-light-black dark:text-white'>
                        You don&apos;t have any wallet imported in ARK Connect! <br />
                        Please create or import a wallet first!
                    </p>
                </div>
            </div>
        </Layout>
    );
};

export default WalletNotFound;
