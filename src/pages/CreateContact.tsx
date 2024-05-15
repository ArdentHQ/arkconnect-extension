import { AddNewContactForm, SaveContactButton } from '@/components/address-book/create';
import { Network, WalletNetwork } from '@/lib/store/wallet';
import { object, string } from 'yup';
import { useEffect, useState } from 'react';

import { Coins } from '@ardenthq/sdk';
import { Contracts } from '@ardenthq/sdk-profiles';
import SubPageLayout from '@/components/settings/SubPageLayout';
import useAddressBook from '@/lib/hooks/useAddressBook';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useProfileContext } from '@/lib/context/Profile';
import useToast from '@/lib/hooks/useToast';
import { useTranslation } from 'react-i18next';

export type AddContactFormik = {
    name: string;
    address: string;
};

type ValidateAddressResponse = {
    isValid: boolean;
    network: WalletNetwork;
};

const ADDRESS_LENGTH = 34;

const validateAddress = async ({
    address,
    profile,
}: {
    address?: string;
    profile: Contracts.IProfile;
}): Promise<ValidateAddressResponse> => {
    const coinId = 'ARK';

    try {
        if (address) {
            const isValidMainnetAddress = await profile
                .coins()
                .set(coinId, Network.MAINNET)
                .address()
                .validate(address);

            if (isValidMainnetAddress) {
                return {
                    isValid: true,
                    network: WalletNetwork.MAINNET,
                };
            }

            const isValidDevnetAddress = await profile
                .coins()
                .set(coinId, Network.DEVNET)
                .address()
                .validate(address);

            if (isValidDevnetAddress) {
                return {
                    isValid: true,
                    network: WalletNetwork.DEVNET,
                };
            }
        }
        return { isValid: false, network: WalletNetwork.MAINNET };
    } catch (error) {
        console.error(error);
        throw new Error('Failed to validate address');
    }
};

const CreateContact = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { addContact, addressBook } = useAddressBook();
    const { profile } = useProfileContext();
    const [addressValidation, setAddressValidation] = useState<ValidateAddressResponse>({
        isValid: false,
        network: WalletNetwork.MAINNET,
    });

    const validationSchema = object().shape({
        name: string()
            .required(t('ERROR.IS_REQUIRED', { name: 'Name' }))
            .max(20, t('ERROR.MAX_CHARACTERS', { count: 20 }))
            .test('unique-name', t('ERROR.IS_DUPLICATED', { name: 'contact name' }), (name) => {
                return !addressBook?.find((contact) => contact.name === name);
            }),
        address: string()
            .required(t('ERROR.IS_REQUIRED', { name: 'Address' }))
            .min(ADDRESS_LENGTH, t('ERROR.IS_INVALID', { name: 'Address' }))
            .test('valid-address', t('ERROR.IS_INVALID', { name: 'Address' }), () => {
                return addressValidation.isValid;
            }),
    });

    const formik = useFormik<AddContactFormik>({
        initialValues: {
            name: '',
            address: '',
        },
        validationSchema: validationSchema,
        onSubmit: () => {
            addContact({
                name: formik.values.name,
                address: formik.values.address,
                type: addressValidation.network,
            });
            // Reset
            formik.resetForm();
            setAddressValidation({ isValid: false, network: WalletNetwork.MAINNET });

            toast('success', t('PAGES.ADDRESS_BOOK.CONTACT_ADDED'));
            navigate('/address-book');
        },
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

    return (
        <SubPageLayout
            title={t('PAGES.ADDRESS_BOOK.ADD_NEW_CONTACT')}
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

export default CreateContact;
