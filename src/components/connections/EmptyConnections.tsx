import { useTranslation } from 'react-i18next';
import { EmptyConnectionsIcon } from '@/shared/components';

const EmptyConnections = () => {
    const { t } = useTranslation();

    return (
        <div className=' mx-4 mb-4 mt-24 flex flex-1 flex-col items-center justify-center'>
            <div className='flex max-w-[210px] flex-col items-center justify-center'>
                <EmptyConnectionsIcon />

                <p className=' mt-6 text-center text-light-black dark:text-white '>
                    {t('PAGES.CONNECTIONS.NO_CONNECTED_APPS_DESCRIPTION')}
                </p>
            </div>
        </div>
    );
};

export default EmptyConnections;
