import ImportNewWallet from '@/components/wallet/import';
import { Layout } from '@/shared/components';

const ImportWallet = () => {
    return (
        <Layout>
            <div className='flex h-[550px] flex-col p-4'>
                <ImportNewWallet />
            </div>
        </Layout>
    );
};

export default ImportWallet;
