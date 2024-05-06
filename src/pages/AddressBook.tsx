import { useTranslation } from 'react-i18next';
import SubPageLayout from '@/components/settings/SubPageLayout';
import { AddContactButton, NoContacts } from '@/components/address-book';


const AddressBook = () => {
    const { t } = useTranslation();

    return (
        <SubPageLayout title={t('PAGES.ADDRESS_BOOK.TITLE')} className='relative'>
            <NoContacts className='mt-[114px]' />
            <div className='absolute -bottom-4 left-0 w-full'>
                <AddContactButton />
            </div>
        </SubPageLayout>
    );
};

export default AddressBook;
