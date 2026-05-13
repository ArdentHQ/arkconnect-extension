import { FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { AddressDropdown } from '@/components/send/AddressDropdown';
import Amount from '@/components/wallet/Amount';
import constants from '@/constants';
import { FeeSection } from '@/components/fees';
import { Input } from '@/shared/components';
import { SendFormik } from '@/pages/Send';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
import { calculateGasFee } from '@/lib/hooks/useNetworkFees';
import { BigNumber } from '@/lib/helpers';

export const SendForm = ({ formik }: { formik: FormikProps<SendFormik> }) => {
    const primaryWallet = usePrimaryWallet();
    const { t } = useTranslation();

    const handleMaxClick = () => {
        const balance = primaryWallet?.balance() ?? BigNumber.ZERO;
        const fee = BigNumber.make(calculateGasFee(formik.values.gasPrice, formik.values.gasLimit));

        if (balance.isLessThanOrEqualTo(fee)) {
            formik.setFieldValue('amount', 0);
            return;
        }

        const maxValue = balance.minus(fee);
        formik.setFieldValue(
            'amount',
            maxValue.isNegative() ? 0 : maxValue.decimalPlaces(18).toString(),
        );
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

    const handleGasPriceChange = (price: string) => {
        formik.setFieldValue('gasPrice', price);
        formik.validateField('amount');
    };

    const handleGasLimitChange = (limit: string) => {
        formik.setFieldValue('gasLimit', limit);
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
                            value={primaryWallet?.balance() ?? BigNumber.ZERO}
                            ticker={primaryWallet?.currency() || 'ARK'}
                            withTicker
                            showSign={false}
                            isNegative={false}
                            maxDigits={20}
                            displayTooltip={(primaryWallet?.balance().toNumber() ?? 0) > 0}
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

            <FeeSection
                onBlur={formik.handleBlur}
                values={formik.values}
                errors={formik.errors}
                handleFeeClassChange={(value: string) => formik.setFieldValue('feeClass', value)}
                onGasLimitChange={handleGasLimitChange}
                onGasPriceChange={handleGasPriceChange}
            />
        </div>
    );
};
