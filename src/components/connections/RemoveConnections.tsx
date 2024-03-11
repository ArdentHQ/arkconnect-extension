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
                <Paragraph $typeset='headline' fontWeight='regular' color='gray' display='inline'>
                    Are you certain you want to disconnect
                    {hasMultipleSessions ? ' all ' : ' your connection with '}
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
            </div>
        </div>
    );
};

export default RemoveConnections;
