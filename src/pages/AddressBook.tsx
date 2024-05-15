import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import SubPageLayout from '@/components/settings/SubPageLayout';
import {
    AddContactButton,
    AddressBookList,
    NoContacts,
    RemoveAddress,
} from '@/components/address-book';
import useAddressBook from '@/lib/hooks/useAddressBook';
import Modal from '@/shared/components/modal/Modal';
import useToast from '@/lib/hooks/useToast';

const AddressBook = () => {
    const toast = useToast();
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
        toast('success', t('PAGES.ADDRESS_BOOK.CONTACT_REMOVED'));
    };

    return (
        <SubPageLayout title={t('PAGES.ADDRESS_BOOK.TITLE')} className='relative p-0'>
            <div className='w-full h-[393px] custom-scroll overflow-y-auto'>
                {addressBook.length > 0 ? (
                    <div className='mx-4'>
                        <AddressBookList
                            handleRemoveContact={handleRemoveContact}
                            addressBook={addressBook}
                        />
                    </div>
                ) : (
                    <NoContacts className='mt-24' />
                )}
            </div>
            <div className='w-full'>
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
