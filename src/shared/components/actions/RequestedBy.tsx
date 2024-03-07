import ConnectionLogoImage from '../../../components/connections/ConnectionLogoImage';
import formatDomain from '@/lib/utils/formatDomain';

type Props = {
    appName?: string;
    appLogo?: string;
    appDomain: string;
};

const RequestedBy = ({ appDomain, appLogo }: Props) => {
    return (
        <div className='flex w-full flex-row items-center justify-center bg-white p-4 dark:bg-subtle-black'>
            <ConnectionLogoImage appLogo={appLogo} appName={appDomain} roundCorners />

            <span className='ml-2 whitespace-nowrap text-sm text-theme-secondary-500 dark:text-theme-secondary-300'>
                Requested by
            </span>

            <span className='inline truncate text-sm text-light-black dark:text-white'>
                &nbsp;
                {formatDomain(appDomain, false)}
            </span>
        </div>
    );
};

export default RequestedBy;
