import { FlexContainer, Paragraph, EmptyConnectionsIcon, Layout } from '@/shared/components';

const WalletNotFound = () => {
  return (
    <Layout>
      <FlexContainer
        margin='16'
        minHeight='100%'
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
      >
        <FlexContainer
          maxWidth='210px'
          flexDirection='column'
          justifyContent='center'
          alignItems='center'
        >
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
        </FlexContainer>
      </FlexContainer>
    </Layout>
  );
};

export default WalletNotFound;
