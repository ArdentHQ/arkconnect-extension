import { useTranslation } from 'react-i18next';
import { object, string } from 'yup';
import { useFormik } from 'formik';
import { AddNewContactForm, SaveContactButton } from '@/components/address-book/create';
import SubPageLayout from '@/components/settings/SubPageLayout';
import useAddressBook from '@/lib/hooks/useAddressBook';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
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
}

const fetchValidateAddress = async (address: string): Promise<ValidateAddressResponse> => {
    try {
        const mainnetResponse = await fetch(`${constants.ARKVAULT_BASE_URL}api/wallets/${address}`);

        if (mainnetResponse.status === 200) {
            return {
                isValid: true,
                network: WalletNetwork.MAINNET,
            };
        }

        const devnetResponse = await fetch(`${constants.ARKVAULT_DEVNET_BASE_URL}api/wallets/${address}`, {
            headers: {
                'ark-network': 'devnet',
            },
        });

        if (devnetResponse.status === 200) {
            return {
                isValid: true,
                network: WalletNetwork.DEVNET,
            };
        }
        return { isValid: false };
    } catch (error) {
        return { isValid: false };
    }
};

const CreateContact = () => {
    const primaryWallet = usePrimaryWallet();
    const toast = useToast();
    const { t } = useTranslation();
    const { addContact, addressBooks } = useAddressBook();

    const validationSchema = object().shape({
        name: string()
            .required(t('ERROR.IS_REQUIRED', { name: 'Name' }))
            .max(20, t('ERROR.MAX_CHARACTERS', { count: 20 }))
            .test('unique-name', t('ERROR.IS_DUPLICATED', { name: 'contact name' }), (name) => {
                return !addressBooks[primaryWallet?.address() ?? '']?.find(
                    (contact) => contact.name === name,
                );
            }),
        address: string()
            .required(t('ERROR.IS_REQUIRED', { name: 'Address' }))
            .min(34, t('ERROR.IS_INVALID'))
            .test('valid-address', t('ERROR.IS_INVALID', { name: 'Address' }), async (address) => {
                const response = await fetchValidateAddress(address);
                return response.isValid;
            }),
    });

    const formik = useFormik<AddContactFormik>({
        initialValues: {
            name: '',
            address: '',
        },
        validationSchema: validationSchema,
        onSubmit: () => {
            addContact(primaryWallet?.address() ?? '', {
                name: formik.values.name,
                address: formik.values.address,
            });
            formik.resetForm();

            toast('success', t('PAGES.ADDRESS_BOOK.CONTACT_ADDED'));
        },
    });

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
