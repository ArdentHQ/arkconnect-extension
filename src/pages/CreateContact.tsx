import { useTranslation } from 'react-i18next';
import { object, string } from 'yup';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { AddNewContactForm, SaveContactButton } from '@/components/address-book/create';
import SubPageLayout from '@/components/settings/SubPageLayout';
import useAddressBook from '@/lib/hooks/useAddressBook';
import useToast from '@/lib/hooks/useToast';
import { WalletNetwork } from '@/lib/store/wallet';
import constants from '@/constants';

export type AddContactFormik = {
    name: string;
    address: string;
};

type ValidateAddressResponse = {
    isValid: boolean;
    network?: WalletNetwork;
};

const fetchValidateAddress = async (address?: string): Promise<ValidateAddressResponse> => {
    try {
        if (address) {
            const mainnetResponse = await fetch(
                `${constants.ARKVAULT_BASE_URL}api/wallets/${address}`,
            );

            if (mainnetResponse.status === 200) {
                return {
                    isValid: true,
                    network: WalletNetwork.MAINNET,
                };
            }

            const devnetResponse = await fetch(
                `${constants.ARKVAULT_DEVNET_BASE_URL}api/wallets/${address}`,
                {
                    headers: {
                        'ark-network': 'devnet',
                    },
                },
            );

            if (devnetResponse.status === 200) {
                return {
                    isValid: true,
                    network: WalletNetwork.DEVNET,
                };
            }
        }
        return { isValid: false };
    } catch (error) {
        throw new Error('Failed to validate address');
    }
};

const CreateContact = () => {
    const toast = useToast();
    const { t } = useTranslation();
    const { addContact, addressBook } = useAddressBook();
    const [address, setAddress] = useState<string | undefined>();

    const { data, isLoading } = useQuery<ValidateAddressResponse>(
        ['address-validation', address],
        () => fetchValidateAddress(address),
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
                return !addressBook?.find((contact) => contact.name === name);
            }),
        address: string()
            .required(t('ERROR.IS_REQUIRED', { name: 'Address' }))
            .min(34, t('ERROR.IS_INVALID', { name: 'Address' }))
            .test('valid-address', t('ERROR.IS_INVALID', { name: 'Address' }), () => {
                if (data) {
                    return data.isValid;
                }
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
            });
            formik.resetForm();

            toast('success', t('PAGES.ADDRESS_BOOK.CONTACT_ADDED'));
        },
    });

    useEffect(() => {
        if (formik.values.address) {
            setAddress(formik.values.address);
        }
    }, [formik.values.address]);

    return (
        <SubPageLayout
            title={t('PAGES.ADDRESS_BOOK.ADD_NEW_CONTACT')}
            hideCloseButton={false}
            className='relative'
        >
            <AddNewContactForm formik={formik} />
            <div className='absolute -bottom-4 left-0 w-full'>
                <SaveContactButton
                    disabled={!(formik.isValid && formik.dirty) || isLoading}
                    onClick={formik.handleSubmit}
                />
            </div>
        </SubPageLayout>
    );
};

export default CreateContact;
