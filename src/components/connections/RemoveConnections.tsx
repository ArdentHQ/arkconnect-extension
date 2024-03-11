import styled from 'styled-components';
import { Heading, Paragraph } from '@/shared/components';

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
                <Paragraph
                    fontWeight='regular'
                    display='inline'
                    className='typeset-headline text-theme-secondary-500 dark:text-theme-secondary-300'
                >
                    Are you certain you want to disconnect
                    {hasMultipleSessions ? ' all ' : ' your connection with '}
                </Paragraph>
                <Paragraph
                    fontWeight='regular'
                    className='typeset-headline text-theme-secondary-500 dark:text-theme-secondary-300'
                    display='inline'
                    as='span'
                >
                    {sessionDomain && numberOfSessions === 1 ? (
                        <Paragraph
                            className='typeset-headline text-light-black dark:text-white'
                            display='inline'
                        >
                            <StyledDomain>{sessionDomain}</StyledDomain>
                        </Paragraph>
                    ) : (
                        <>
                            <Paragraph
                                fontWeight='medium'
                                className='typeset-headline text-light-black dark:text-white'
                                display='inline'
                            >
                                {numberOfSessions}
                            </Paragraph>{' '}
                            of your connections
                        </>
                    )}
                    ?
                </Paragraph>
            </div>
        </div>
    );
};

export default RemoveConnections;
