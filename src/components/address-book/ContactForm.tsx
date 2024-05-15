import { FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { ContactFormik } from '@/components/address-book/types';
import { Input, TextArea } from '@/shared/components';

export const AddNewContactForm = ({ formik }: { formik: FormikProps<ContactFormik> }) => {
    const { t } = useTranslation();
    const handleAddressChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        event.target.value = event.target.value.trim();
        formik.handleChange(event);
    };

    return (
        <div className='flex flex-col gap-4'>
            <Input
                type='text'
                labelText={t('COMMON.NAME')}
                placeholder={t('COMMON.ENTER_NAME')}
                name='name'
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                variant={formik.errors.name ? 'destructive' : 'primary'}
                helperText={formik.errors.name}
            />
            <TextArea
                labelText={t('COMMON.ADDRESS')}
                placeholder={t('COMMON.ENTER_ADDRESS')}
                rows={2}
                className='h-[72px]'
                name='address'
                value={formik.values.address}
                onChange={handleAddressChange}
                onBlur={formik.handleBlur}
                variant={formik.errors.address ? 'destructive' : 'primary'}
                helperText={formik.errors.address}
            />
        </div>
    );
};
