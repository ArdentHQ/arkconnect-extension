import { useTranslation } from 'react-i18next';
import { Heading, HeadingDescription } from '@/shared/components';

type Props = {
    sessionDomain?: string;
    numberOfSessions?: number;
};

const RemoveConnections = ({ numberOfSessions, sessionDomain }: Props) => {
    const { t } = useTranslation();
    const hasMultipleSessions = numberOfSessions && numberOfSessions > 1;
    return (
        <div>
            <Heading level={4}>
                {hasMultipleSessions ? 'Disconnect All Connections' : 'Disconnect Connection'}
            </Heading>

            <div className='mt-2'>
                <HeadingDescription>
                    {hasMultipleSessions
                        ? t('PAGES.CONNECTIONS.ARE_YOU_CERTAIN_TO_DISCONNECT_ALL')
                        : t('PAGES.CONNECTIONS.ARE_YOU_CERTAIN_TO_DISCONNECT_YOUR_CONNECTION')}
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
                            {t('PAGES.CONNECTIONS.OF_YOUR_CONNECTIONS')}
                        </>
                    )}
                    ?
                </HeadingDescription>
            </div>
        </div>
    );
};

export default RemoveConnections;
