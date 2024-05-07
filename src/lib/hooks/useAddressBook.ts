import { useEffect, useState } from 'react';

export type Contact = {
    name: string;
    address: string;
};

export type AddressBooks = Record<string, Contact[]>;

const useAddressBook = () => {
    const [addressBooks, setAddressBooks] = useState<AddressBooks>({});

    useEffect(() => {
        const storedAddressBooks = JSON.parse(localStorage.getItem('addressBooks') || '{}');
        setAddressBooks(storedAddressBooks);
    }, []);

    const saveAddressBooksToLocalStorage = (updatedAddressBooks: AddressBooks) => {
        localStorage.setItem('addressBooks', JSON.stringify(updatedAddressBooks));
    };

    const addContact = (ownerAddress: string, { name, address }: Contact) => {
        const newContact = { name, address };
        const updatedAddressBooks = {
            ...addressBooks,
            [ownerAddress]: [...(addressBooks[ownerAddress] || []), newContact],
        };
        setAddressBooks(updatedAddressBooks);
        saveAddressBooksToLocalStorage(updatedAddressBooks);
    };

    const updateContact = (ownerAddress: string, name: string, updatedContact: Contact) => {
        const updatedContacts = addressBooks[ownerAddress].map((contact) =>
            contact.name === name ? updatedContact : contact,
        );
        const updatedAddressBooks = {
            ...addressBooks,
            [ownerAddress]: updatedContacts,
        };
        setAddressBooks(updatedAddressBooks);
        saveAddressBooksToLocalStorage(updatedAddressBooks);
    };

    const removeContact = (ownerAddress: string, name: string) => {
        const updatedContacts = addressBooks[ownerAddress].filter(
            (contact) => contact.name !== name,
        );
        const updatedAddressBooks = {
            ...addressBooks,
            [ownerAddress]: updatedContacts,
        };
        setAddressBooks(updatedAddressBooks);
        saveAddressBooksToLocalStorage(updatedAddressBooks);
    };

    const removeAddressBook = (ownerAddress: string) => {
        const { [ownerAddress]: _, ...remainingBooks } = addressBooks;
        setAddressBooks(remainingBooks);
        saveAddressBooksToLocalStorage(remainingBooks);
    };

    return {
        addressBooks,
        addContact,
        updateContact,
        removeContact,
        removeAddressBook,
    };
};

export default useAddressBook;
