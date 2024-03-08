import { EmptyConnectionsIcon, Layout, Paragraph } from '@/shared/components';

const WalletNotFound = () => {
    return (
        <Layout>
            <div className='m-4 flex min-h-full flex-col items-center justify-center'>
                <div className='flex max-w-[210px] flex-col items-center justify-center'>
                    <EmptyConnectionsIcon />
                    <Paragraph
                        $typeset='headline'
                        fontWeight='regular'
                        color='base'
                        mt='24'
                        textAlign='center'
                    >
                        You don&apos;t have any wallet imported in ARK Connect! <br />
                        Please create or import a wallet first!
                    </Paragraph>
                </div>
            </div>
        </Layout>
    );
};

export default WalletNotFound;
