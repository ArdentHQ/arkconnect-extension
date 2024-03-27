import { useTranslation } from 'react-i18next';

export const ActionDetailsRow = ({
    label,
    children,
    below,
}: {
    label: string | React.ReactNode;
    children: string | React.ReactNode;
    below?: React.ReactNode;
}) => {
    return (
        <div className='flex flex-col space-y-1 border-b border-solid border-b-theme-secondary-100 p-3 last:border-b-0 dark:border-b-theme-secondary-700'>
            <div className='flex justify-between'>
                <div className='text-sm text-theme-secondary-500 dark:text-theme-secondary-300'>
                    {label}
                </div>

                {children}
            </div>

            {below}
        </div>
    );
};

export const ActionDetailsFiatValue = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='flex justify-between'>
            <div className='text-sm text-theme-secondary-500 dark:text-theme-secondary-300'>≈</div>

            <div className='text-sm text-theme-secondary-500 dark:text-theme-secondary-300 '>
                {children}
            </div>
        </div>
    );
};

const ActionDetails = ({
    children,
    maxHeight,
}: {
    children: React.ReactNode;
    maxHeight?: string;
}) => {
    const { t } = useTranslation();
    return (
        <div className='flex h-full w-full flex-1 flex-col items-center overflow-auto'>
            <div className=' mb-2 text-center text-sm font-medium text-theme-secondary-500 dark:text-theme-secondary-300'>
                {t('COMMON.DETAILS')}
            </div>

            <div
                className='custom-scroll w-full overflow-auto rounded-lg bg-white shadow-action-details dark:bg-subtle-black dark:shadow-action-details-dark'
                style={{
                    maxHeight: maxHeight,
                }}
            >
                {children}
            </div>
        </div>
    );
};

export default ActionDetails;
