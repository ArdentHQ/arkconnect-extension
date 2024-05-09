import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { object, string } from 'yup';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { AddContactFormik, fetchValidateAddress, ValidateAddressResponse } from './CreateContact';
import useAddressBook from '@/lib/hooks/useAddressBook';
import SubPageLayout from '@/components/settings/SubPageLayout';
import { EditContactForm } from '@/components/address-book/edit';
import { SaveContactButton } from '@/components/address-book/create';
import { WalletNetwork } from '@/lib/store/wallet';
import useToast from '@/lib/hooks/useToast';

const EditContact = () => {
    const toast = useToast();
    const { t } = useTranslation();
    const { name } = useParams<{ name: string }>();
    const { addressBook, updateContact } = useAddressBook();
    const [address, setAddress] = useState<string | undefined>();
    const navigate = useNavigate();
    const contact = addressBook.find((contact) => contact.name === name);

    const { data, isLoading } = useQuery<ValidateAddressResponse>(
        ['address-validation', contact?.address],
        () => fetchValidateAddress(contact?.address),
        {
            enabled: !!address,
            staleTime: Infinity,
        },
    );

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
            .test('valid-address', t('ERROR.IS_INVALID', { name: 'Address' }), (address) => {
                if (isLoading || contact?.address === address) return true;
                if (data) {
                    return data.isValid;
                }
            }),
    });

    const formik = useFormik<AddContactFormik>({
        initialValues: {
            name: contact?.name || '',
            address: contact?.address || '',
        },
        validationSchema: validationSchema,
        onSubmit: () => {
            if (!name) return;

            updateContact(name, {
                name: formik.values.name,
                address: formik.values.name,
                type: data?.network || WalletNetwork.MAINNET,
            });

            toast('success', t('PAGES.ADDRESS_BOOK.CONTACT_ADDED'));
        },
        enableReinitialize: true
    });

    useEffect(() => {
        if (formik.values.address) {
            setAddress(formik.values.address);
        }
    }, [formik.values.address]);

    if(!contact) {
        navigate('/address-book');
    }

    return (
        <SubPageLayout
            title={t('PAGES.ADDRESS_BOOK.EDIT_CONTACT')}
            hideCloseButton={false}
            className='relative'
        >
            <EditContactForm formik={formik} />
            <div className='absolute -bottom-4 left-0 w-full'>
                <SaveContactButton
                    disabled={!(formik.isValid && formik.dirty) || isLoading}
                    onClick={formik.handleSubmit}
                />
            </div>
        </SubPageLayout>
    );
};

export default EditContact;