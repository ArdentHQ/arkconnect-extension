import { useTranslation } from 'react-i18next';
import { FormikProps } from 'formik';
import Amount from '@/components/wallet/Amount';
import { Input } from '@/shared/components';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
import { SendFormik } from '@/pages/Send';

export const SendForm = ({ formik }: { formik: FormikProps<SendFormik> }) => {
    const primaryWallet = usePrimaryWallet();
    const { t } = useTranslation();

    const handleMaxClick = () => {
        formik.setFieldValue('amount', primaryWallet?.balance().toString() || '0');
    };

    const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.target.value = event.target.value.trim();
        formik.handleChange(event);
    };

    return (
        <div className='flex flex-col gap-4'>
            <Input
                name='amount'
                labelText={t('COMMON.AMOUNT')}
                secondaryText={
                    <span>
                        {`${t('COMMON.AVAILABLE')}: `}
                        <Amount
                            value={primaryWallet?.balance() || 0}
                            ticker={primaryWallet?.currency() || 'ARK'}
                            withTicker
                            showSign={false}
                            isNegative={false}
                            maxDigits={20}
                            displayTooltip={false}
                            maxDecimals={2}
                            hideSmallValues
                        />
                    </span>
                }
                placeholder={t('COMMON.ENTER_AMOUNT')}
                trailing={
                    <button
                        onClick={handleMaxClick}
                        className='transition-smoothEase rounded p-1 capitalize text-theme-primary-700 hover:bg-theme-secondary-50 hover:text-theme-primary-600 dark:text-theme-primary-600 dark:shadow-secondary-dark dark:hover:bg-theme-secondary-700 dark:hover:text-theme-primary-650'
                    >
                        {t('COMMON.MAX')}
                    </button>
                }
                value={formik.values.amount}
                onChange={handleAmountChange}
                onBlur={formik.handleBlur}
                variant={formik.errors.amount ? 'destructive' : 'primary'}
                helperText={formik.errors.amount}
            />

            <Input
                name='memo'
                labelText={`${t('COMMON.MEMO')} (${t('COMMON.OPTIONAL')})`}
                secondaryText={`${formik.values.memo !== undefined ? formik.values.memo.length : 0}/255`}
                placeholder={t('COMMON.ADD_NOTE_TO_TRANSACTION')}
                value={formik.values.memo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                variant={formik.errors.memo ? 'destructive' : 'primary'}
                helperText={formik.errors.memo}
            />
        </div>
    );
};
