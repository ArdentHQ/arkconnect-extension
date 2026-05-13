import cn from 'classnames';
import Skeleton from 'react-loading-skeleton';
import useActiveNetwork from '@/lib/hooks/useActiveNetwork';

export const FeeOptionSkeleton = () => {
    return (
        <div className='border-theme-secondary-400 shadow-secondary-dark hover:bg-theme-secondary-50 dark:border-theme-secondary-500 dark:bg-subtle-black dark:hover:bg-theme-secondary-700 flex w-full flex-col items-center justify-center gap-1 rounded-lg border bg-white p-3'>
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
    feeClass,
}: {
    name: string;
    value: string;
    onClick: (value: string, feeClass: string) => void;
    isSelected: boolean;
    feeClass: string;
}) => {
    const { activeNetwork: network } = useActiveNetwork();
    const handleClick = () => {
        onClick(value, feeClass);
    };

    return (
        <button
            onClick={handleClick}
            className={cn('shadow-secondary-dark w-full rounded-lg border p-3', {
                'transition-smoothEase border-theme-primary-700 bg-theme-primary-50 dark:border-theme-primary-700 dark:bg-theme-primary-800/25':
                    isSelected,
                'border-theme-secondary-400 hover:bg-theme-secondary-50 dark:border-theme-secondary-500 dark:bg-subtle-black dark:hover:bg-theme-secondary-700 bg-white':
                    !isSelected,
            })}
        >
            <span className='flex flex-col items-center justify-center gap-1'>
                <span className='text-light-black text-base font-normal dark:text-white'>
                    {name}
                </span>
                <span className='text-theme-secondary-500 dark:text-theme-secondary-300 text-sm font-normal'>
                    {value} {network.ticker()}
                </span>
            </span>
        </button>
    );
};
