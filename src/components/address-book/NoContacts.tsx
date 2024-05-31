import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import ThemedIcon from '@/shared/components/icon/ThemedIcon';

export const NoContacts = ({ className }: { className?: string }) => {
    const { t } = useTranslation();

    return (
        <div className={twMerge('flex flex-col items-center justify-center gap-6', className)}>
            <ThemedIcon icon={'empty-address-book'} className='h-[108px] w-[112.5px]' />
            <p className='text-center text-base font-normal leading-5 text-light-black dark:text-white'>
                {t('PAGES.ADDRESS_BOOK.NO_CONTACTS')}
                <br />
                {t('PAGES.ADDRESS_BOOK.ADD_NEW_CONTACTS_AT_ANYTIME')}
            </p>
        </div>
    );
};
