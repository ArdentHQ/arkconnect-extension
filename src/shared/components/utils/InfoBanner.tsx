import { ReactNode } from 'react';

const InfoBanner = ({ title, children }: { title: string; children: ReactNode }) => {
    return (
        <div className='flex flex-col overflow-hidden rounded-2.5xl border border-theme-info-200 dark:border-theme-info-700'>
            <div className='bg-theme-info-100 px-4 pb-3 pt-4 text-sm font-medium text-subtle-black dark:bg-theme-info-700 dark:text-white'>
                {title}
            </div>
            <div className='bg-theme-info-50 px-4 pb-4 pt-3 text-xs font-medium leading-4 text-theme-info-800 dark:bg-theme-info-900 dark:text-subtle-white'>
                {children}
            </div>
        </div>
    );
};

export default InfoBanner;
