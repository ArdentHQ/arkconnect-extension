import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { runtime } from 'webextension-polyfill';
import { AddNewContactForm, SaveContactButton } from '@/components/address-book';
import { ContactFormik } from '@/components/address-book/types';

import SubPageLayout from '@/components/settings/SubPageLayout';
import useAddressBook from '@/lib/hooks/useAddressBook';
import { useProfileContext } from '@/lib/context/Profile';
import useToast from '@/lib/hooks/useToast';
import { ScreenName } from '@/lib/background/contracts';
import { generateAddressBookValidationSchema } from '@/lib/validation/addressBook';
import { AddressService } from '@/lib/mainsail/address.service';

export const validateAddress = ({ address }: { address?: string }): boolean => {
    if (!address) {
        return false;
    }

    return new AddressService().validate(address);
};

const CreateContact = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { addContact, addressBook } = useAddressBook();
    const { profile } = useProfileContext();
    const lastVisitedPage = profile.settings().get('LAST_VISITED_PAGE') as {
        data: { name: string; address: string; errors: any };
    };
    const [isValidAddress, setIsValidAddress] = useState<boolean>(false);

    const formik = useFormik<ContactFormik>({
        initialValues: {
            name: lastVisitedPage?.data?.name || '',
            address: lastVisitedPage?.data?.address || '',
        },
        validationSchema: generateAddressBookValidationSchema({
            isEdit: false,
            contact: undefined,
            addressBook,
            isValidAddress,
            t,
        }),
        initialErrors: lastVisitedPage?.data?.errors || {},
        onSubmit: async () => {
            addContact({
                name: formik.values.name,
                address: formik.values.address,
            });

            // Reset
            runtime.sendMessage({ type: 'CLEAR_LAST_SCREEN' });
            profile.settings().forget('LAST_VISITED_PAGE');
            formik.resetForm();
            setIsValidAddress(false);
            toast('success', t('PAGES.ADDRESS_BOOK.CONTACT_ADDED'));
            navigate('/address-book');
        },
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

    useEffect(() => {
        runtime.sendMessage({
            type: 'SET_LAST_SCREEN',
            path: ScreenName.AddContact,
            data: {
                ...formik.values,
                errors: formik.errors,
            },
        });

        return () => {
            runtime.sendMessage({ type: 'CLEAR_LAST_SCREEN' });
            profile.settings().forget('LAST_VISITED_PAGE');
        };
    }, [formik.values, formik.errors]);

    return (
        <SubPageLayout
            title={t('PAGES.ADDRESS_BOOK.ADD_NEW_CONTACT')}
            hideCloseButton={false}
            className='relative'
            footer={
                <SaveContactButton
                    disabled={!(formik.isValid && formik.values.name && formik.values.address)}
                    onClick={formik.handleSubmit}
                />
            }
        >
            <AddNewContactForm formik={formik} />
        </SubPageLayout>
    );
};

export default CreateContact;
