import { FlexContainer, Paragraph, EmptyConnectionsIcon } from '@/shared/components';

const EmptyConnections = () => {
  return (
    <FlexContainer
      margin='16'
      mt='96'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      flex={1}
    >
      <FlexContainer
        maxWidth='210px'
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
      >
        <EmptyConnectionsIcon />
        <Paragraph $typeset='headline' fontWeight='regular' color='base' mt='24' textAlign='center'>
          You are currently not connected to any applications.
        </Paragraph>
      </FlexContainer>
    </FlexContainer>
  );
};

export default EmptyConnections;
