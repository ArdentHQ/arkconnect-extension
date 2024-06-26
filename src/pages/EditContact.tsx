import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { validateAddress } from './CreateContact';
import { AddNewContactForm, SaveContactButton } from '@/components/address-book';
import { ContactFormik, ValidateAddressResponse } from '@/components/address-book/types';

import constants from '@/constants';
import SubPageLayout from '@/components/settings/SubPageLayout';
import useAddressBook from '@/lib/hooks/useAddressBook';
import { useProfileContext } from '@/lib/context/Profile';
import useToast from '@/lib/hooks/useToast';
import { WalletNetwork } from '@/lib/store/wallet';
import { generateAddressBookValidationSchema } from '@/lib/validation/addressBook';

const EditContact = () => {
    const toast = useToast();
    const { t } = useTranslation();
    const { profile } = useProfileContext();
    const { name } = useParams<{ name: string }>();
    const { addressBook, updateContact } = useAddressBook();
    const navigate = useNavigate();
    const contact = addressBook.find((contact) => contact.name === name);
    const [addressValidation, setAddressValidation] = useState<ValidateAddressResponse>({
        isValid: false,
        network: WalletNetwork.MAINNET,
    });

    const formik = useFormik<ContactFormik>({
        initialValues: {
            name: contact?.name || '',
            address: contact?.address || '',
        },
        validationSchema: generateAddressBookValidationSchema({
            isEdit: true,
            contact,
            addressBook,
            addressValidation,
            t,
        }),
        onSubmit: () => {
            if (!name) return;

            updateContact(name, {
                name: formik.values.name,
                address: formik.values.address,
                type: addressValidation.network,
            });

            toast('success', t('PAGES.ADDRESS_BOOK.CONTACT_EDITED'));
            navigate('/address-book');
        },
        enableReinitialize: true,
    });

    useEffect(() => {
        const handleAddressValidation = async () => {
            const response = await validateAddress({ address: formik.values.address, profile });
            setAddressValidation(response);
        };

        if (formik.values.address && formik.values.address.length === constants.ADDRESS_LENGTH) {
            handleAddressValidation();
        }
    }, [formik.values.name, formik.values.address]);

    useEffect(() => {
        if (formik.values.address) {
            formik.validateField('address');
        }
    }, [addressValidation]);

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
