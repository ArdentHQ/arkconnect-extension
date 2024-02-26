import CreateNewWallet from '@/components/wallet/create';
import { Layout, FlexContainer } from '@/shared/components';

const CreateWallet = () => {
  return (
    <Layout>
      <FlexContainer flexDirection='column' paddingX='16' paddingTop='16' flex='1'>
        <CreateNewWallet />
      </FlexContainer>
    </Layout>
  );
};

export default CreateWallet;
