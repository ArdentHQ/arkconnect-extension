import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { FormikProps } from 'formik';
import { FeeTypeSwtich } from './FeeTypeSwtich';
import { FeeOptionsList } from './FeeOptionsList';
import { useNetworkFees } from '@/lib/hooks/useNetworkFees';
import useActiveNetwork from '@/lib/hooks/useActiveNetwork';
import { WalletNetwork } from '@/lib/store/wallet';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
import { NumericInput } from '@/shared/components/input/NumericInput';

export const FeeSection = ({
    formik
}: {
    formik: FormikProps<{fee: string}>
}) => {
    const { t } = useTranslation();
    const [advancedFeeView, setAdvancedFeeView] = useState<boolean>(false);
    const activeNetwork = useActiveNetwork();
    const primaryWallet = usePrimaryWallet();
    const { fees, isLoading } = useNetworkFees({
        network: activeNetwork.isTest() ? WalletNetwork.DEVNET
        : WalletNetwork.MAINNET,
        primaryWallet
    });

    const handleFeeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.target.value = event.target.value.trim();
        formik.handleChange(event);
    };

    const handleFeeViewClick = () => {
        if(advancedFeeView && fees) {
            onFeeChange(fees.avg.crypto);
        }
        setAdvancedFeeView(!advancedFeeView);
    };
    
    const onFeeChange = (value: string) => {
        formik.setFieldValue('fee', value);
    };

    useEffect(() => {
        if (fees && !formik.values.fee && !advancedFeeView) {
            onFeeChange(fees.avg.crypto);
        }
    }, [fees, advancedFeeView]);

    return (
        <div className='flex flex-col gap-2'>
            <div className='flex flex-row justify-between w-full items-center'>
                <span className='text-theme-secondary-500 font-medium text-sm dark:text-theme-secondary-200'>{t('COMMON.TRANSACTION_FEE')}</span>

                <FeeTypeSwtich advancedFee={advancedFeeView} setAdvancedFeeView={handleFeeViewClick} />
            </div>

            {
                advancedFeeView ? (
                    <NumericInput
                      id="fee"
                      placeholder="0.00"
                      onChange={handleFeeChange}
                      onValueChange={onFeeChange}
                      value={formik.values.fee}
                      variant={formik.errors.fee && formik.values.fee ? 'destructive' : 'primary'}
                      helperText={(formik.errors.fee && formik.values.fee) && formik.errors.fee}
                      onBlur={formik.handleBlur}
                    />
                ) : (
                    <FeeOptionsList fees={fees} isLoading={isLoading} setFee={onFeeChange} fee={formik.values.fee} />
                )
            }
        </div>
    );
};
