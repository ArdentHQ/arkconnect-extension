import { useCallback, useEffect, useState } from 'react';
import { WalletNetwork } from '@/lib/store/wallet';

export type Contact = {
    name: string;
    address: string;
    type: WalletNetwork;
};

const useAddressBook = () => {
    const [addressBook, setAddressBook] = useState<Contact[]>([]);

    useEffect(() => {
        const storedAddressBooks = JSON.parse(localStorage.getItem('addressBook') || '[]');
        setAddressBook(storedAddressBooks);
    }, []);

    const saveAddressBooksToLocalStorage = (updatedAddressBooks: Contact[]) => {
        localStorage.setItem('addressBook', JSON.stringify(updatedAddressBooks));
    };

    const addContact = useCallback(
        ({ name, address, type }: Contact) => {
            const updatedAddressBooks = [...addressBook, { name, address, type }];
            setAddressBook(updatedAddressBooks);
            saveAddressBooksToLocalStorage(updatedAddressBooks);
        },
        [addressBook],
    );

    const updateContact = useCallback(
        (name: string, updatedContact: Contact) => {
            const updatedAddressBooks = addressBook.map((contact) =>
                contact.name === name ? updatedContact : contact,
            );
            saveAddressBooksToLocalStorage(updatedAddressBooks);
            setAddressBook(updatedAddressBooks);
        },
        [addressBook],
    );

    const removeContact = useCallback(
        (name: string) => {
            const updatedAddressBooks = addressBook.filter((contact) => contact.name !== name);
            saveAddressBooksToLocalStorage(updatedAddressBooks);
            setAddressBook(updatedAddressBooks);
        },
        [addressBook],
    );

    const findContact = useCallback(
        (address: string) => {
            return addressBook.find((contact) => contact.address === address);
        },
        [addressBook],
    );

    return {
        addressBook,
        addContact,
        updateContact,
        removeContact,
        findContact,
    };
};

export default useAddressBook;
