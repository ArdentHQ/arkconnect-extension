import cn from 'classnames';
import Skeleton from 'react-loading-skeleton';
import useActiveNetwork from '@/lib/hooks/useActiveNetwork';

export const FeeOptionSkeleton = () => {
    return (
        <div className='w-full p-3 rounded-lg border shadow-secondary-dark bg-white hover:bg-theme-secondary-50 dark:bg-subtle-black dark:hover:bg-theme-secondary-700 border-theme-secondary-400 dark:border-theme-secondary-500 flex flex-col gap-1 items-center justify-center'>
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
}: {
    name: string;
    value: string;
    onClick: (value: string) => void;
    isSelected: boolean;
}) => {
    const network = useActiveNetwork();
    const handleClick = () => {
        onClick(value);
    };

    return (
        <button onClick={handleClick} className={cn('p-3 rounded-lg w-full border shadow-secondary-dark', {
            'bg-theme-primary-50 dark:border-theme-primary-700 border-theme-primary-700 dark:bg-theme-primary-800/25 transition-smoothEase': isSelected,
            'bg-white hover:bg-theme-secondary-50 dark:bg-subtle-black dark:hover:bg-theme-secondary-700 border-theme-secondary-400 dark:border-theme-secondary-500': !isSelected,
        })}>
            <span className='flex flex-col gap-1 items-center justify-center'>
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