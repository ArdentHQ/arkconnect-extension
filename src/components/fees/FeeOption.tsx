import cn from 'classnames';
import Skeleton from 'react-loading-skeleton';
import useActiveNetwork from '@/lib/hooks/useActiveNetwork';

export const FeeOptionSkeleton = () => {
    return (
        <div className='flex w-full flex-col items-center justify-center gap-1 rounded-lg border border-theme-secondary-400 bg-white p-3 shadow-secondary-dark hover:bg-theme-secondary-50 dark:border-theme-secondary-500 dark:bg-subtle-black dark:hover:bg-theme-secondary-700'>
            <Skeleton width={60} height={24} />
            <Skeleton width={50} height={20} />
        </div>
    );
};

export const FeeOption = ({
    name,
    value,
    onClick,
    isSelected = false,
    feeClass
}: {
    name: string;
    value: string;
    onClick: (value: string, feeClass: string) => void;
    isSelected: boolean;
    feeClass: string;
}) => {
    const network = useActiveNetwork();
    const handleClick = () => {
        onClick(value, feeClass);
    };

    return (
        <button
            onClick={handleClick}
            className={cn('w-full rounded-lg border p-3 shadow-secondary-dark', {
                'transition-smoothEase border-theme-primary-700 bg-theme-primary-50 dark:border-theme-primary-700 dark:bg-theme-primary-800/25':
                    isSelected,
                'border-theme-secondary-400 bg-white hover:bg-theme-secondary-50 dark:border-theme-secondary-500 dark:bg-subtle-black dark:hover:bg-theme-secondary-700':
                    !isSelected,
            })}
        >
            <span className='flex flex-col items-center justify-center gap-1'>
                <span className='text-base font-normal text-light-black dark:text-white'>
                    {name}
                </span>
                <span className='text-sm font-normal text-theme-secondary-500 dark:text-theme-secondary-300'>
                    {value} {network.coinName()}
                </span>
            </span>
        </button>
    );
};
