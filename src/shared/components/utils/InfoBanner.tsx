import { ReactNode } from 'react';

const InfoBanner = ({ title, children }: { title: string; children: ReactNode }) => {
    return (
        <div className='rounded-2.5xl border-theme-info-200 dark:border-theme-info-700 flex flex-col overflow-hidden border'>
            <div className='bg-theme-info-100 text-subtle-black dark:bg-theme-info-700 px-4 pt-4 pb-3 text-sm font-medium dark:text-white'>
                {title}
            </div>
            <div className='bg-theme-info-50 text-theme-info-800 dark:bg-theme-info-900 dark:text-subtle-white px-4 pt-3 pb-4 text-xs leading-4 font-medium'>
                {children}
            </div>
        </div>
    );
};

export default InfoBanner;
