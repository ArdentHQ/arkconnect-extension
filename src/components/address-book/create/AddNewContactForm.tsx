import { useTranslation } from 'react-i18next';
import { FormikProps } from 'formik';
import { Input, TextArea } from '@/shared/components';
import { AddContactFormik } from '@/pages/CreateContact';

export const AddNewContactForm = ({formik}: {
  formik: FormikProps<AddContactFormik>
}) => {
  const { t } = useTranslation();

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
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        variant={formik.errors.address ? 'destructive' : 'primary'}
        helperText={formik.errors.address}
      />
    </div>
  );
};