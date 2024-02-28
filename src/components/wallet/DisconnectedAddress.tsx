import styled from 'styled-components';
import { Container, Heading, Paragraph } from '@/shared/components';

const TitleContainer = styled.div`
    word-break: break-word;
`;

const DisconnectedAddress = () => {
    return (
        <Container>
            <TitleContainer>
                <Heading $typeset='h4' fontWeight='medium' color='base'>
                    Disconnected Address
                </Heading>
            </TitleContainer>

            <Paragraph $typeset='headline' fontWeight='regular' color='gray' marginTop='6'>
                ARK Connect is currently not linked to this website. To establish a connection with
                a Web3 site, locate and click on the connect button.
            </Paragraph>
        </Container>
    );
};

export default DisconnectedAddress;
