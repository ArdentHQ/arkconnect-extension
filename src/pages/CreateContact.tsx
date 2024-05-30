import { useEffect, useState } from 'react';
import { Contracts } from '@ardenthq/sdk-profiles';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { runtime } from 'webextension-polyfill';
import { AddNewContactForm, SaveContactButton } from '@/components/address-book';
import { ContactFormik, ValidateAddressResponse } from '@/components/address-book/types';
import { WalletNetwork } from '@/lib/store/wallet';

import constants from '@/constants';
import SubPageLayout from '@/components/settings/SubPageLayout';
import useAddressBook from '@/lib/hooks/useAddressBook';
import { useProfileContext } from '@/lib/context/Profile';
import useToast from '@/lib/hooks/useToast';
import { ScreenName } from '@/lib/background/contracts';
import { generateAddressBookValidationSchema } from '@/lib/validation/addressBook';

const COIN_ID = 'ARK';

export const validateAddress = async ({
    address,
    profile,
}: {
    address?: string;
    profile: Contracts.IProfile;
}): Promise<ValidateAddressResponse> => {
    if (!address) {
        return { isValid: false, network: WalletNetwork.MAINNET };
    }

    try {
        for (const network of profile.networks().allByCoin(COIN_ID)) {
            const coin = profile.coins().set(network.coin, network.id);
            await coin.__construct();

            const isValidAddress: boolean = await coin.address().validate(address);

            if (!isValidAddress) {
                continue;
            }

            return {
                isValid: true,
                network: coin.network().isLive() ? WalletNetwork.MAINNET : WalletNetwork.DEVNET,
            };
        }

        return { isValid: false, network: WalletNetwork.MAINNET };
    } catch (error) {
        throw new Error('Failed to validate address');
    }
};

const CreateContact = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { addContact, addressBook } = useAddressBook();
    const { profile } = useProfileContext();
    const lastVisitedPage = profile.settings().get('LAST_VISITED_PAGE') as {
        data: { name: string; address: string };
    };
    const [addressValidation, setAddressValidation] = useState<ValidateAddressResponse>({
        isValid: false,
        network: WalletNetwork.MAINNET,
    });

    const formik = useFormik<ContactFormik>({
        initialValues: {
            name: lastVisitedPage?.data?.name || '',
            address: lastVisitedPage?.data?.address || '',
        },
        validationSchema: generateAddressBookValidationSchema({
            isEdit: false,
            contact: undefined,
            addressBook,
            addressValidation,
            t,
        }),
        onSubmit: async () => {
            addContact({
                name: formik.values.name,
                address: formik.values.address,
                type: addressValidation.network,
            });

            // Reset
            runtime.sendMessage({ type: 'CLEAR_LAST_SCREEN' });
            profile.settings().forget('LAST_VISITED_PAGE');
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

        if (formik.values.address && formik.values.address.length === constants.ADDRESS_LENGTH) {
            handleAddressValidation();
        }
    }, [formik.values.name, formik.values.address]);

    useEffect(() => {
        if (formik.values.address) {
            formik.validateField('address');
        }
    }, [addressValidation]);

    useEffect(() => {
        runtime.sendMessage({
            type: 'SET_LAST_SCREEN',
            path: ScreenName.AddContact,
            data: formik.values,
        });

        return () => {
            runtime.sendMessage({ type: 'CLEAR_LAST_SCREEN' });
            profile.settings().forget('LAST_VISITED_PAGE');
        };
    }, [formik.values]);

    return (
        <SubPageLayout
            title={t('PAGES.ADDRESS_BOOK.ADD_NEW_CONTACT')}
            hideCloseButton={false}
            className='relative'
        >
            <AddNewContactForm formik={formik} />
            <div className='absolute -bottom-4 left-0 w-full'>
                <SaveContactButton
                    disabled={!(formik.isValid && formik.values.name && formik.values.address)}
                    onClick={formik.handleSubmit}
                />
            </div>
        </SubPageLayout>
    );
};

export default CreateContact;
