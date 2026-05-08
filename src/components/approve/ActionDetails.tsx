import { useTranslation } from 'react-i18next';
import cn from 'classnames';

export const ActionDetailsRow = ({
    label,
    children,
    below,
    className,
}: {
    label: string | React.ReactNode;
    children: string | React.ReactNode;
    below?: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className='border-b-theme-secondary-100 dark:border-b-theme-secondary-700 flex flex-col space-y-1 border-b border-solid p-3 last:border-b-0'>
            <div className={cn('flex justify-between', className)}>
                <div className='text-theme-secondary-500 dark:text-theme-secondary-300 text-sm'>
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
            <div className='text-theme-secondary-500 dark:text-theme-secondary-300 text-sm'>≈</div>

            <div className='text-theme-secondary-500 dark:text-theme-secondary-300 text-sm'>
                {children}
            </div>
        </div>
    );
};

const ActionDetails = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    const { t } = useTranslation();
    return (
        <div className='flex h-full w-full flex-1 flex-col items-center overflow-auto'>
            <div className='text-theme-secondary-500 dark:text-theme-secondary-300 mb-2 text-center text-sm font-medium'>
                {t('COMMON.DETAILS')}
            </div>

            <div
                className={cn(
                    'custom-scroll shadow-action-details dark:bg-subtle-black dark:shadow-action-details-dark w-full overflow-auto rounded-lg bg-white',
                    className,
                )}
            >
                {children}
            </div>
        </div>
    );
};

export default ActionDetails;
