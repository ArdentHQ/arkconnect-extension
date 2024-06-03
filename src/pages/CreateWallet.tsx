import CreateNewWallet from '@/components/wallet/create';
import { Layout } from '@/shared/components';

const CreateWallet = () => {
    return (
        <Layout withPadding={false}>
            <div className='flex flex-1 flex-col px-4 py-4'>
                <CreateNewWallet />
            </div>
        </Layout>
    );
};

export default CreateWallet;
