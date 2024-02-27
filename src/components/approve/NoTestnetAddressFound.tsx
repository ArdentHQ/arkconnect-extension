import { Container, Heading, Paragraph } from '@/shared/components';

const NoTestnetAddressFound = () => {
    return (
        <Container>
            <Heading $typeset='h4' fontWeight='medium' color='base'>
                No Testnet Address Found
            </Heading>
            <Container>
                <Paragraph
                    $typeset='headline'
                    fontWeight='regular'
                    color='gray'
                    mt='6'
                    display='inline'
                >
                    You have requested an action for a Testnet network. Please add a Testnet address
                    from the extension settings and request again to proceed.
                </Paragraph>
            </Container>
        </Container>
    );
};

export default NoTestnetAddressFound;
