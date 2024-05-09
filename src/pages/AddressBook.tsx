import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import SubPageLayout from '@/components/settings/SubPageLayout';
import { AddContactButton, AddressBookList, NoContacts } from '@/components/address-book';
import useAddressBook from '@/lib/hooks/useAddressBook';
import Modal from '@/shared/components/modal/Modal';
import { RemoveAddress } from '@/components/address-book/remove';

const AddressBook = () => {
    const { t } = useTranslation();
    const { addressBook, removeContact } = useAddressBook();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [selectedContactName, setSelectedContactName] = useState<string>('');

    const handleRemoveContact = (name: string) => {
        setSelectedContactName(name);
        setIsDeleteModalOpen(true);
    };

    const handleCancel = () => {
        setIsDeleteModalOpen(false);
    };

    const handleResolve = () => {
        removeContact(selectedContactName);
        setIsDeleteModalOpen(false);
    };

    return (
        <SubPageLayout title={t('PAGES.ADDRESS_BOOK.TITLE')} className='relative p-0'>
            {addressBook.length > 0 ? (
                <div className='mx-4 min-h-[calc(100%-68px)]'>
                    <AddressBookList
                        handleRemoveContact={handleRemoveContact}
                        addressBook={addressBook}
                    />
                </div>
            ) : (
                <NoContacts className='min-h-[calc(100%-68px)]' />
            )}
            <div className='sticky bottom-0 left-0 w-full'>
                <AddContactButton />
            </div>

            {isDeleteModalOpen && (
                <Modal
                    variant='danger'
                    onClose={handleCancel}
                    onCancel={handleCancel}
                    onResolve={handleResolve}
                    hideCloseButton
                    focusTrapOptions={{
                        initialFocus: false,
                    }}
                    icon='alert-octagon'
                >
                    <RemoveAddress name={selectedContactName} />
                </Modal>
            )}
        </SubPageLayout>
    );
};

export default AddressBook;
