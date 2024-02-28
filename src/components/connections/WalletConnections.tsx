import { ArrowButton, FlexContainer, Heading } from '@/shared/components';

const WalletConnections = () => {
    return (
        <FlexContainer alignItems='center' gridGap='12px'>
            <ArrowButton action='goHome' />
            <Heading $typeset='h4' fontWeight='medium' color='base'>
                Connected Apps
            </Heading>
        </FlexContainer>
    );
};

export default WalletConnections;
