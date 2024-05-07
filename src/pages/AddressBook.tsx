import { useTranslation } from 'react-i18next';
import SubPageLayout from '@/components/settings/SubPageLayout';
import { AddContactButton, AddressBookList, NoContacts } from '@/components/address-book';
import useAddressBook from '@/lib/hooks/useAddressBook';

const AddressBook = () => {
    const { t } = useTranslation();
    const { addressBook } = useAddressBook();

    return (
        <SubPageLayout title={t('PAGES.ADDRESS_BOOK.TITLE')} className='relative p-0'>
            {addressBook.length > 0 ? (
                <div className='mx-4 min-h-[calc(100%-68px)]'>
                    <AddressBookList />
                </div>
            ) : (
                <NoContacts className='min-h-[calc(100%-68px)]' />
            )}
            <div className='sticky bottom-0 left-0 w-full'>
                <AddContactButton />
            </div>
        </SubPageLayout>
    );
};

export default AddressBook;
