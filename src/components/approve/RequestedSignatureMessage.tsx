import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

type Props = {
    data: { [key: string]: number | string };
    className?: string;
};

const RequestedSignatureMessage = ({ data, className }: Props) => {
    const { t } = useTranslation();

    return (
        <div className='flex h-full w-full flex-col items-center'>
            <div className='text-theme-secondary-500 dark:text-theme-secondary-300 mb-2 text-sm font-medium'>
                {t('COMMON.MESSAGE')}
            </div>

            <div
                className={twMerge(
                    'custom-scroll border-theme-secondary-200 text-light-black dark:border-theme-secondary-700 dark:bg-subtle-black flex min-h-60 w-full flex-1 overflow-auto rounded-lg border border-solid bg-white p-3 dark:text-white',
                    className,
                )}
            >
                {data.message}
            </div>
        </div>
    );
};

export default RequestedSignatureMessage;
