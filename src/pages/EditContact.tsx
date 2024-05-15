import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { object, string } from 'yup';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { ADDRESS_LENGTH, validateAddress } from './CreateContact';
import useAddressBook from '@/lib/hooks/useAddressBook';
import SubPageLayout from '@/components/settings/SubPageLayout';
import { AddNewContactForm, SaveContactButton } from '@/components/address-book';
import { WalletNetwork } from '@/lib/store/wallet';
import useToast from '@/lib/hooks/useToast';
import { ContactFormik, ValidateAddressResponse } from '@/components/address-book/types';
import { useProfileContext } from '@/lib/context/Profile';

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

    const validationSchema = object().shape({
        name: string()
            .required(t('ERROR.IS_REQUIRED', { name: 'Name' }))
            .max(20, t('ERROR.MAX_CHARACTERS', { count: 20 }))
            .test('unique-name', t('ERROR.IS_DUPLICATED', { name: 'contact name' }), (name) => {
                if (contact?.name === name) return true;
                return !addressBook?.find((contact) => contact.name === name);
            }),
        address: string()
            .required(t('ERROR.IS_REQUIRED', { name: 'Address' }))
            .min(34, t('ERROR.IS_INVALID', { name: 'Address' }))
            .max(34, t('ERROR.IS_INVALID', { name: 'Address' }))
            .test('valid-address', t('ERROR.IS_INVALID', { name: 'Address' }), () => {
                return addressValidation.isValid;
            }),
    });

    const formik = useFormik<ContactFormik>({
        initialValues: {
            name: contact?.name || '',
            address: contact?.address || '',
        },
        validationSchema: validationSchema,
        onSubmit: () => {
            if (!name) return;

            updateContact(name, {
                name: formik.values.name,
                address: formik.values.address,
                type: addressValidation.network,
            });

            toast('success', t('PAGES.ADDRESS_BOOK.CONTACT_ADDED'));
        },
        enableReinitialize: true,
    });

    useEffect(() => {
        const handleAddressValidation = async () => {
            const response = await validateAddress({ address: formik.values.address, profile });
            setAddressValidation(response);
        };

        if (formik.values.address && formik.values.address.length === ADDRESS_LENGTH) {
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
        >
            <AddNewContactForm formik={formik} />
            <div className='absolute -bottom-4 left-0 w-full'>
                <SaveContactButton
                    disabled={!(formik.isValid && formik.dirty)}
                    onClick={formik.handleSubmit}
                />
            </div>
        </SubPageLayout>
    );
};

export default EditContact;
