import { useTranslation } from 'react-i18next';
import { object, string } from 'yup';
import { useFormik } from 'formik';
import SubPageLayout from '@/components/settings/SubPageLayout';
import { SendButton, SendForm } from '@/components/send';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
import constants from '@/constants';

export type SendFormik = {
    amount?: string;
    memo?: string;
    fee: string;
};

const Send = () => {
    const primaryWallet = usePrimaryWallet();
    const { t } = useTranslation();

    const validationSchema = object().shape({
        amount: string()
            .required(t('ERROR.IS_REQUIRED', { name: 'Amount' }))
            .matches(constants.AMOUNT_REGEX, {
                message: t('ERROR.IS_INVALID', { name: 'Amount' }),
            })
            .test('max-balance', t('ERROR.BALANCE_TOO_LOW'), (value) => {
                if (!value) return true;
                const userBalance = primaryWallet?.balance() || 0;
                return Number(value) <= userBalance;
            })
            .test(
                'total-check',
                t('ERROR.IS_EXCEEDING_BALANCE', { name: 'fee + amount' }),
                (value) => {
                    if (!value || !formik.values.fee) return true;
                    const userBalance = primaryWallet?.balance() || 0;
                    const sum: number = Number(value) + Number(formik.values.fee);
                    return sum <= userBalance;
                },
            )
            .trim(),
        memo: string().max(255, t('ERROR.IS_TOO_LONG', { name: 'Memo' })),
        fee: string()
            .required(t('ERROR.IS_REQUIRED', { name: 'Fee' }))
            .matches(constants.AMOUNT_REGEX, {
                message: t('ERROR.IS_INVALID', { name: 'Fee' }),
            })
            .test('min-value', t('ERROR.IS_REQUIRED', { name: 'Fee' }), (value) => {
                return Number(value) > 0;
            })
            .test('max-value', t('ERROR.IS_TOO_HIGH', { name: 'Fee' }), (value) => {
                return Number(value) < 1;
            })
            .trim(),
    });

    const formik = useFormik<SendFormik>({
        initialValues: {
            amount: '',
            memo: '',
            fee: '',
        },
        validationSchema: validationSchema,
        onSubmit: () => {},
    });

    return (
        <SubPageLayout title={t('COMMON.SEND')} className='relative p-0'>
            <div className='custom-scroll h-[393px] w-full overflow-y-auto px-4'>
                <SendForm formik={formik} />
            </div>
            <div className='w-full'>
                <SendButton disabled={!(formik.isValid && formik.dirty)} />
            </div>
        </SubPageLayout>
    );
};

export default Send;
