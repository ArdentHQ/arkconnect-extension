import { TFunction } from 'i18next';
import { object, string } from 'yup';
import { Contact } from '@/lib/hooks/useAddressBook';

export const generateAddressBookValidationSchema = ({
    isEdit = false,
    contact,
    addressBook = [],
    isValidAddress,
    t,
}: {
    isEdit: boolean;
    contact?: Contact;
    addressBook: Contact[];
    isValidAddress: boolean;
    t: TFunction<'translation', undefined>;
}) => {
    return object().shape({
        name: string()
            .required(t('ERROR.IS_REQUIRED', { name: 'Name' }))
            .max(20, t('ERROR.MAX_CHARACTERS', { count: 20 }))
            .test('unique-name', t('ERROR.IS_DUPLICATED', { name: 'contact name' }), (name) => {
                if (isEdit && contact?.name === name) return true;
                return !addressBook?.find((contact) => contact.name === name);
            })
            .trim(),
        address: string()
            .required(t('ERROR.IS_REQUIRED', { name: 'Address' }))
            .test('valid-address', t('ERROR.IS_INVALID', { name: 'Address' }), () => {
                return isValidAddress;
            })
            .test(
                'unique-address',
                t('ERROR.IS_DUPLICATED', { name: 'contact address' }),
                (address) => {
                    if (isEdit && contact?.address === address) return true;
                    return !addressBook?.find((contact) => contact.address === address);
                },
            ),
    });
};
