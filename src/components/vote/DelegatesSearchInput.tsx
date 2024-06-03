import { Dispatch, SetStateAction } from 'react';
import { Icon, Input } from '@/shared/components';

export const DelegatesSearchInput = ({
    searchQuery,
    setSearchQuery,
}: {
    searchQuery: string;
    setSearchQuery: Dispatch<SetStateAction<string>>;
}) => {
    return (
        <div className='relative'>
            <Input
                className='border-theme-secondary-400 pl-10 placeholder:text-theme-secondary-500 hover:bg-theme-secondary-50 dark:border-theme-secondary-300 dark:bg-subtle-black dark:placeholder:text-theme-secondary-300 dark:hover:bg-theme-secondary-700'
                leading={
                    <Icon
                        icon='search'
                        className='h-6 w-6 text-theme-secondary-500 dark:text-theme-secondary-300'
                    />
                }
                placeholder='Find a delegate (add i18n)'
            />
        </div>
    );
};
