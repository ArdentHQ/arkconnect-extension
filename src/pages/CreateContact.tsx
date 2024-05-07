import { useTranslation } from 'react-i18next';
import { object, string } from 'yup';
import { Coins } from '@ardenthq/sdk';
import { useFormik } from 'formik';
import { AddNewContactForm, SaveContactButton } from '@/components/address-book/create';
import SubPageLayout from '@/components/settings/SubPageLayout';
import { useProfileContext } from '@/lib/context/Profile';
import useActiveNetwork from '@/lib/hooks/useActiveNetwork';
import useAddressBook from '@/lib/hooks/useAddressBook';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
import useToast from '@/lib/hooks/useToast';

export type AddContactFormik = {
    name: string;
    address: string;
};

const CreateContact = () => {
    const network = useActiveNetwork();
    const primaryWallet = usePrimaryWallet();
    const toast = useToast();
    const { profile } = useProfileContext();
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
            .test('valid-address', t('ERROR.IS_INVALID', { name: 'Address' }), async (address) => {
                const instance: Coins.Coin = profile.coins().set(network.coin(), network.id());
                await instance.__construct();
                const isValidAddress: boolean = await instance.address().validate(address);
                return isValidAddress;
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
