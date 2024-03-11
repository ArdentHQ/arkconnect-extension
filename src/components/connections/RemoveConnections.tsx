import styled from 'styled-components';
import { Heading } from '@/shared/components';

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
        <div>
            <Heading $typeset='h4' fontWeight='medium' color='base'>
                {hasMultipleSessions ? 'Disconnect All Connections' : 'Disconnect Connection'}
            </Heading>

            <div className='mt-2'>
                <span className='typeset-headline text-theme-secondary-500 dark:text-theme-secondary-300'>
                    Are you certain you want to disconnect
                    {hasMultipleSessions ? ' all ' : ' your connection with '}
                </span>
                <span className='typeset-headline text-theme-secondary-500 dark:text-theme-secondary-300'>
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
            </div>
        </div>
    );
};

export default RemoveConnections;
