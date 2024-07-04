import { ReactNode } from 'react';

const InfoBanner = ({ title, children }: { title: string; children: ReactNode }) => {
    return (
        <div className='flex flex-col overflow-hidden rounded-2.5xl border border-theme-navy-200 dark:border-theme-navy-700'>
            <div className='bg-theme-navy-100 px-4 pb-3 pt-4 text-sm font-medium text-subtle-black dark:bg-theme-navy-700 dark:text-white'>
                {title}
            </div>
            <div className='bg-theme-navy-50 px-4 pb-4 pt-3 text-xs font-medium leading-4 text-theme-navy-800 dark:bg-theme-navy-900 dark:text-subtle-white'>
                {children}
            </div>
        </div>
    );
};

export default InfoBanner;
