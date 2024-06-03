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
        <div className='-mt-1.5 mb-2'>
            <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className='border-theme-secondary-400 pl-10 placeholder:text-theme-secondary-500 hover:bg-theme-secondary-50 focus:border-black dark:border-theme-secondary-300 dark:bg-subtle-black dark:placeholder:text-theme-secondary-300 dark:hover:bg-theme-secondary-700 dark:focus:border-theme-secondary-300'
                leading={
                    <Icon
                        icon='search'
                        className='h-6 w-6 text-theme-secondary-500 dark:text-theme-secondary-300'
                    />
                }
                trailing={
                    searchQuery !== '' && (
                        <button className='mt-1.5' type='button' onClick={() => setSearchQuery('')}>
                            <Icon icon='clear' className='h-5 w-5 text-black dark:text-white' />
                        </button>
                    )
                }
                placeholder='Find a delegate (add i18n)'
            />
        </div>
    );
};
