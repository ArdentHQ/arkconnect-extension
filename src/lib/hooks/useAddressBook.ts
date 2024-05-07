import { useEffect, useState } from 'react';

export type Contact = {
    name: string;
    address: string;
};

const useAddressBook = () => {
    const [addressBook, setAddressBook] = useState<Contact[]>([]);

    useEffect(() => {
        const storedAddressBooks = JSON.parse(localStorage.getItem('addressBook') || '[]');
        setAddressBook(storedAddressBooks);
    }, []);

    const saveAddressBooksToLocalStorage = (updatedAddressBooks: Contact[]) => {
        localStorage.setItem('addressBooks', JSON.stringify(updatedAddressBooks));
    };

    const addContact = ({ name, address }: Contact) => {
        const updatedAddressBooks = [...addressBook, { name, address }];
        setAddressBook(updatedAddressBooks);
        saveAddressBooksToLocalStorage(updatedAddressBooks);
    };

    const updateContact = (name: string, updatedContact: Contact) => {
        const updatedAddressBooks = addressBook.map((contact) =>
            contact.name === name ? updatedContact : contact,
        );
        setAddressBook(updatedAddressBooks);
        saveAddressBooksToLocalStorage(updatedAddressBooks);
    };

    const removeContact = (name: string) => {
        const updatedAddressBooks = addressBook.filter((contact) => contact.name !== name);
        setAddressBook(updatedAddressBooks);
        saveAddressBooksToLocalStorage(updatedAddressBooks);
    };

    return {
        addressBook,
        addContact,
        updateContact,
        removeContact,
    };
};

export default useAddressBook;
