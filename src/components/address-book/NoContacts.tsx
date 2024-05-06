import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import useThemeMode from '@/lib/hooks/useThemeMode';
import { Icon } from '@/shared/components';

export const NoContacts = ({
    className,
}: {
    className?: string
}) => {
    const { t } = useTranslation();
    const { isDark } = useThemeMode();

    return (
        <div className={twMerge('flex flex-col gap-6 items-center justify-center', className)}>
            <Icon icon={isDark() ? 'empty-address-book-dark' : 'empty-address-book'} className='w-[112.5px] h-[108px]' />
            <p className='text-light-black font-normal text-base leading-5 text-center dark:text-white'>{t('PAGES.ADDRESS_BOOK.NO_CONTACTS')}<br/>{t('PAGES.ADDRESS_BOOK.ADD_NEW_CONTACTS_AT_ANYTIME')}</p>
        </div>
    );
};
