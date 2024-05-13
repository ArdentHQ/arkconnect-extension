import { useTranslation } from 'react-i18next';
import { object, string } from 'yup';
import { useFormik } from 'formik';
import SubPageLayout from '@/components/settings/SubPageLayout';
import { SendButton, SendForm } from '@/components/send';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';

export type SendFormik = {
    amount?: string;
    memo?: string;
};

const Send = () => {
    const primaryWallet = usePrimaryWallet();
    const { t } = useTranslation();

    const validationSchema = object().shape({
        amount: string()
            .matches(/^[0-9]+(\.[0-9]{1,8})?$/, {
                message: t('ERROR.IS_INVALID', { name: 'Amount' }),
            })
            .test('max-balance', t('ERROR.BALANCE_TOO_LOW'), (value) => {
                if (!value) return true;
                const userBalance = primaryWallet?.balance() || 0;
                return Number(value) <= userBalance;
            }),
        memo: string().max(255, t('ERROR.IS_TOO_LONG', { name: 'Memo' })),
    });

    const formik = useFormik<SendFormik>({
        initialValues: {
            amount: '',
            memo: '',
        },
        validationSchema: validationSchema,
        onSubmit: () => {},
    });

    return (
        <SubPageLayout title={t('COMMON.SEND')} className='relative'>
            <SendForm formik={formik} />
            <div className='absolute -bottom-4 left-0 w-full'>
                <SendButton disabled={!(formik.isValid && formik.dirty)} />
            </div>
        </SubPageLayout>
    );
};

export default Send;
