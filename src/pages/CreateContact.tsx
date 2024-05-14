import { useTranslation } from 'react-i18next';
import { object, string } from 'yup';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { Coins } from '@ardenthq/sdk';
import { Contracts } from '@ardenthq/sdk-profiles';
import { useNavigate } from 'react-router-dom';
import SubPageLayout from '@/components/settings/SubPageLayout';
import useAddressBook from '@/lib/hooks/useAddressBook';
import useToast from '@/lib/hooks/useToast';
import { ContactFormik, ValidateAddressResponse } from '@/components/address-book/types';
import { AddNewContactForm, SaveContactButton } from '@/components/address-book';
import { Network, WalletNetwork } from '@/lib/store/wallet';
import { useProfileContext } from '@/lib/context/Profile';

export const fetchValidateAddress = async ({
    address,
    profile,
}: {
    address?: string;
    profile: Contracts.IProfile;
}): Promise<ValidateAddressResponse> => {
    const coinId = 'ARK';

    try {
        if (address) {
            const mainnetCoin: Coins.Coin = profile.coins().set(coinId, Network.MAINNET);
            const mainnetResponse = await mainnetCoin.address().validate(address);

            if (mainnetResponse) {
                return {
                    isValid: true,
                    network: WalletNetwork.MAINNET,
                };
            }

            const devnetCoin: Coins.Coin = profile.coins().set(coinId, Network.DEVNET);
            const devnetResponse = await devnetCoin.address().validate(address);

            if (devnetResponse) {
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
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { addContact, addressBook } = useAddressBook();
    const [address, setAddress] = useState<string | undefined>();
    const { profile } = useProfileContext();

    const { data, isLoading } = useQuery<ValidateAddressResponse>(
        ['address-validation', address],
        () => fetchValidateAddress({ address, profile }),
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
                if (isLoading) return true;
                if (data) {
                    return data.isValid;
                }
            }),
    });

    const formik = useFormik<ContactFormik>({
        initialValues: {
            name: '',
            address: '',
        },
        validationSchema: validationSchema,
        onSubmit: () => {
            addContact({
                name: formik.values.name,
                address: formik.values.address,
                type: data?.network || WalletNetwork.MAINNET,
            });
            formik.resetForm();

            toast('success', t('PAGES.ADDRESS_BOOK.CONTACT_ADDED'));
            navigate('/address-book');
        },
    });

    useEffect(() => {
        if (formik.values.address) {
            setAddress(formik.values.address);
        }
    }, [formik.values.address]);

    useEffect(() => {
        if (data && !isLoading) {
            formik.validateField('address');
        }
    }, [data, isLoading]);

    return (
        <SubPageLayout
            title={t('PAGES.ADDRESS_BOOK.ADD_NEW_CONTACT')}
            hideCloseButton={false}
            className='relative'
        >
            <AddNewContactForm formik={formik} isLoading={isLoading} />
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
