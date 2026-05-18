import { useTranslation } from 'react-i18next';
import ConnectionLogoImage from '@/components/connections/ConnectionLogoImage';
import formatDomain from '@/lib/utils/formatDomain';

type Props = {
    appName?: string;
    appLogo?: string;
    appDomain: string;
};

const RequestedBy = ({ appDomain, appLogo }: Props) => {
    const { t } = useTranslation();
    return (
        <div className='shadow-light dark:bg-subtle-black flex w-full flex-row items-center justify-center bg-white p-4'>
            <ConnectionLogoImage appLogo={appLogo} appName={appDomain} roundCorners />

            <span className='text-theme-secondary-500 dark:text-theme-secondary-300 ml-2 text-sm whitespace-nowrap'>
                {t('COMMON.REQUESTED_BY')}
            </span>

            <span className='text-light-black inline truncate text-sm dark:text-white'>
                &nbsp;
                {formatDomain(appDomain, false)}
            </span>
        </div>
    );
};

export default RequestedBy;
