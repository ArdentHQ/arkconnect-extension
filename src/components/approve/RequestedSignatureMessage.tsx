import { useTranslation } from 'react-i18next';

type Props = {
    data: { [key: string]: number | string };
};

const RequestedSignatureMessage = ({ data }: Props) => {
    const { t } = useTranslation();

    return (
        <div className='flex h-full w-full flex-col items-center'>
            <div className='mb-2 text-sm font-medium text-theme-secondary-500 dark:text-theme-secondary-300'>
                {t('COMMON.MESSAGE')}
            </div>

            <div className='custom-scroll flex min-h-60 w-full flex-1 overflow-auto rounded-lg border border-solid border-theme-secondary-200 bg-white p-3 text-light-black dark:border-theme-secondary-700 dark:bg-subtle-black dark:text-white'>
                {data.message}
            </div>
        </div>
    );
};

export default RequestedSignatureMessage;
