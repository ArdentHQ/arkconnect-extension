import styled from 'styled-components';
import { Container, Heading } from '@/shared/components';

type Props = {
    sessionDomain?: string;
    numberOfSessions?: number;
};

const StyledDomain = styled.span`
    word-break: break-word;
`;

const RemoveConnections = ({ numberOfSessions, sessionDomain }: Props) => {
    const hasMultipleSessions = numberOfSessions && numberOfSessions > 1;
    return (
        <Container>
            <Heading $typeset='h4' fontWeight='medium' color='base'>
                {hasMultipleSessions ? 'Disconnect All Connections' : 'Disconnect Connection'}
            </Heading>

            <Container mt='8'>
                <p className='typeset-headline inline text-theme-secondary-500 dark:text-theme-secondary-300'>
                    Are you certain you want to disconnect
                    {hasMultipleSessions ? ' all ' : ' your connection with '}
                </p>

                <span className='typeset-headline inline'>
                    {sessionDomain && numberOfSessions === 1 ? (
                        <span className='typeset-headline text-light-black dark:text-white'>
                            <StyledDomain>{sessionDomain}</StyledDomain>
                        </span>
                    ) : (
                        <>
                            <span className='typeset-headline font-medium text-light-black dark:text-white'>
                                {numberOfSessions}
                            </span>{' '}
                            of your connections
                        </>
                    )}
                    ?
                </span>
            </Container>
        </Container>
    );
};

export default RemoveConnections;
