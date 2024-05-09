import { useTranslation } from 'react-i18next';
import { Heading, HeadingDescription } from '@/shared/components';

export const RemoveAddress = ({ name }: { name: string }) => {
    const { t } = useTranslation();

    return (
        <div className='flex flex-col gap-2'>
            <Heading level={4}>{t('PAGES.ADDRESS_BOOK.DELETE_SAVED_CONTACT')}?</Heading>

            <HeadingDescription>
                {t('PAGES.ADDRESS_BOOK.ARE_YOU_SURE_YOU_WANT_TO_DELETE')}{' '}
                <span className='text-light-black dark:text-white'>{name}</span>{' '}
                {t('PAGES.ADDRESS_BOOK.FROM_YOUR_ADDRESS_BOOK')}?
            </HeadingDescription>
        </div>
    );
};
