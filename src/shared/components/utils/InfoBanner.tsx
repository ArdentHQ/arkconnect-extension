import { ReactNode } from 'react';

const InfoBanner = ({title, children}: {title: string, children: ReactNode}) => {
  return (
    <div className='flex flex-col border border-theme-primary-200 rounded-2.5xl overflow-hidden dark:border-theme-primary-700'>
        <div className='pt-4 px-4 pb-3 dark:bg-theme-primary-700 dark:text-white text-subtle-black bg-theme-primary-100 text-sm font-medium'>
            {title}
        </div>
        <div className='pt-3 pb-4 px-4 dark:bg-theme-primary-900 dark:text-subtle-white text-theme-primary-800 bg-theme-primary-50 font-medium text-xs leading-4'>
            {children}
        </div>
    </div>
  );
};

export default InfoBanner;