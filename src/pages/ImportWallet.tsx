import ImportNewWallet from '@/components/wallet/import';
import { Layout, FlexContainer } from '@/shared/components';

const ImportWallet = () => {
    return (
        <Layout>
            <FlexContainer
                flexDirection='column'
                paddingX='16'
                paddingTop='16'
                paddingBottom='16'
                height='550px'
            >
                <ImportNewWallet />
            </FlexContainer>
        </Layout>
    );
};

export default ImportWallet;
