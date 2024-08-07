import { FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { AddressDropdown } from '@/components/send/AddressDropdown';
import Amount from '@/components/wallet/Amount';
import constants from '@/constants';
import { FeeSection } from '@/components/fees';
import { Input } from '@/shared/components';
import { SendFormik } from '@/pages/Send';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';

export const SendForm = ({ formik }: { formik: FormikProps<SendFormik> }) => {
    const primaryWallet = usePrimaryWallet();
    const { t } = useTranslation();

    const handleMaxClick = () => {
        const balance = primaryWallet?.balance() ?? 0;
        const fee = Number(formik.values.fee);

        if (balance <= fee) {
            formik.setFieldValue('amount', 0);
            return;
        }

        const maxValue = Math.max(0, balance - fee);
        formik.setFieldValue('amount', Number(maxValue.toFixed(8).replace(/\.?0+$/, '')));
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.target.value = event.target.value.trim();
        formik.handleChange(event);
        formik.validateField('amount');
    };

    const handleAmountInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        if (constants.FEE_REGEX.test(value) || value === '') {
            formik.setFieldValue('amount', value.trim());
            formik.validateField('amount');
        }
    };

    const handleFeeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!constants.FEE_REGEX.test(event.target.value)) {
            return;
        }
        event.target.value = event.target.value.trim();
        formik.handleChange(event);
        formik.validateField('amount');
    };

    const handleValidation = () => {
        formik.validateField('receiverAddress');
    };

    return (
        <div className={'flex w-[338px] flex-col gap-4 pb-2'}>
            <AddressDropdown
                onChange={handleInputChange}
                onBlur={formik.handleBlur}
                variant={
                    formik.values.receiverAddress && formik.errors.receiverAddress
                        ? 'destructive'
                        : 'primary'
                }
                helperText={
                    formik.values.receiverAddress ? formik.errors.receiverAddress : undefined
                }
                value={formik.values.receiverAddress}
                setValue={(value: string) => formik.setFieldValue('receiverAddress', value)}
                handleValidation={handleValidation}
            />
            <Input
                name='amount'
                labelText={t('COMMON.AMOUNT')}
                secondaryText={
                    <span>
                        {`${t('COMMON.AVAILABLE')}: `}
                        <Amount
                            value={primaryWallet?.balance() ?? 0}
                            ticker={primaryWallet?.currency() || 'ARK'}
                            withTicker
                            showSign={false}
                            isNegative={false}
                            maxDigits={20}
                            displayTooltip={primaryWallet && primaryWallet.balance() > 0}
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
                onChange={handleAmountInputChange}
                onBlur={formik.handleBlur}
                variant={
                    formik.errors.amount && formik.values.amount !== '' ? 'destructive' : 'primary'
                }
                autoComplete='off'
                helperText={formik.values.amount !== '' ? formik.errors.amount : undefined}
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
                autoComplete='off'
            />

            <FeeSection
                onChange={handleFeeInputChange}
                onBlur={formik.handleBlur}
                variant={formik.values.fee && formik.errors.fee ? 'destructive' : 'primary'}
                helperText={formik.values.fee ? formik.errors.fee : undefined}
                value={formik.values.fee}
                setValue={(value: string) => formik.setFieldValue('fee', value)}
                feeClass={formik.values.feeClass}
                handleFeeClassChange={(value: string) => formik.setFieldValue('feeClass', value)}
            />
        </div>
    );
};
