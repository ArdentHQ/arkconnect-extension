import styled from 'styled-components';
import { Container, Heading, Paragraph } from '@/shared/components';

type Props = {
    sessionDomain?: string;
    numberOfSessions?: number;
};

const StyledDomain = styled.span`
    word-break: break-word;
`;

const RemoveConnections = ({ numberOfSessions, sessionDomain }: Props) => {
    return (
        <Container>
            <Heading $typeset='h4' fontWeight='medium' color='base'>
                {numberOfSessions ? 'Disconnect All Connections' : 'Disconnect Connection'}
            </Heading>

            <Container mt='8'>
                <Paragraph $typeset='headline' fontWeight='regular' color='gray' display='inline'>
                    Are you certain you want to disconnect
                    {numberOfSessions && numberOfSessions > 1 ? ' all ' : ' your connection with '}
                </Paragraph>
                <Paragraph
                    $typeset='headline'
                    fontWeight='regular'
                    color='gray'
                    display='inline'
                    as='span'
                >
                    {sessionDomain && numberOfSessions === 1 ? (
                        <Paragraph $typeset='headline' color='base' display='inline'>
                            <StyledDomain>{sessionDomain}</StyledDomain>
                        </Paragraph>
                    ) : (
                        <>
                            <Paragraph
                                $typeset='headline'
                                fontWeight='medium'
                                color='base'
                                display='inline'
                            >
                                {numberOfSessions}
                            </Paragraph>{' '}
                            of your connections
                        </>
                    )}
                    ?
                </Paragraph>
            </Container>
        </Container>
    );
};

export default RemoveConnections;
