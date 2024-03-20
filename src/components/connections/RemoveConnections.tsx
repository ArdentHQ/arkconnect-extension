import { Heading, HeadingDescription } from '@/shared/components';

type Props = {
    sessionDomain?: string;
    numberOfSessions?: number;
};

const RemoveConnections = ({ numberOfSessions, sessionDomain }: Props) => {
    const hasMultipleSessions = numberOfSessions && numberOfSessions > 1;
    return (
        <div>
            <Heading level={4}>
                {hasMultipleSessions ? 'Disconnect All Connections' : 'Disconnect Connection'}
            </Heading>

            <div className='mt-2'>
                <HeadingDescription>
                    Are you certain you want to disconnect
                    {hasMultipleSessions ? ' all ' : ' your connection with '}
                </HeadingDescription>
                <HeadingDescription>
                    {sessionDomain && numberOfSessions === 1 ? (
                        <span className='typeset-headline text-light-black dark:text-white'>
                            <span className='break-words'>{sessionDomain}</span>
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
                </HeadingDescription>
            </div>
        </div>
    );
};

export default RemoveConnections;
