import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { validateAddress } from './CreateContact';
import { AddNewContactForm, SaveContactButton } from '@/components/address-book';
import { ContactFormik } from '@/components/address-book/types';

import SubPageLayout from '@/components/settings/SubPageLayout';
import useAddressBook from '@/lib/hooks/useAddressBook';
import useToast from '@/lib/hooks/useToast';
import { generateAddressBookValidationSchema } from '@/lib/validation/addressBook';

const EditContact = () => {
    const toast = useToast();
    const { t } = useTranslation();
    const { name } = useParams<{ name: string }>();
    const { addressBook, updateContact } = useAddressBook();
    const navigate = useNavigate();
    const contact = addressBook.find((contact) => contact.name === name);
    const [isValidAddress, setIsValidAddress] = useState<boolean>(false);

    const formik = useFormik<ContactFormik>({
        initialValues: {
            name: contact?.name || '',
            address: contact?.address || '',
        },
        validationSchema: generateAddressBookValidationSchema({
            isEdit: true,
            contact,
            addressBook,
            isValidAddress,
            t,
        }),
        onSubmit: () => {
            if (!name) return;

            updateContact(name, {
                name: formik.values.name,
                address: formik.values.address,
            });

            toast('success', t('PAGES.ADDRESS_BOOK.CONTACT_EDITED'));
            navigate('/address-book');
        },
        enableReinitialize: true,
    });

    useEffect(() => {
        if (formik.values.address) {
            const response = validateAddress({ address: formik.values.address });
            setIsValidAddress(response);
        }
    }, [formik.values.name, formik.values.address]);

    useEffect(() => {
        if (formik.values.address) {
            formik.validateField('address');
        }
    }, [isValidAddress]);

    if (!contact) {
        navigate('/address-book');
    }

    return (
        <SubPageLayout
            title={t('PAGES.ADDRESS_BOOK.EDIT_CONTACT')}
            hideCloseButton={false}
            className='relative'
            footer={
                <SaveContactButton
                    disabled={!(formik.isValid && formik.dirty)}
                    onClick={formik.handleSubmit}
                />
            }
        >
            <AddNewContactForm formik={formik} />
        </SubPageLayout>
    );
};

export default EditContact;
