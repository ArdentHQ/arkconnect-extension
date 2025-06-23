import { useTranslation } from 'react-i18next';
import { FeeOption, FeeOptionSkeleton } from './FeeOption';
import { calculateGasFee, TransactionFees } from '@/lib/hooks/useNetworkFees';
import constants from '@/constants';
import { BigNumber } from '@/lib/helpers';

export const formatFee = (fee: string) => {
    return BigNumber.make(fee).decimalPlaces(7).toString();
};

export const FeeOptionsList = ({
    fees,
    gasLimit,
    isLoading = false,
    selectedClass,
    onOptionChange,
}: {
    fees?: TransactionFees;
    gasLimit: string;
    isLoading?: boolean;
    selectedClass: string;
    onOptionChange: (feeClass: string, value: string) => void;
}) => {
    const { t } = useTranslation();

    if (!fees || isLoading) {
        return (
            <div className='grid w-full grid-cols-3 gap-1.5'>
                <FeeOptionSkeleton />
                <FeeOptionSkeleton />
                <FeeOptionSkeleton />
            </div>
        );
    }

    return (
        <div className='grid w-full grid-cols-3 gap-1.5'>
            <FeeOption
                name={t('COMMON.SLOW')}
                value={formatFee(calculateGasFee(fees.min, gasLimit))}
                isSelected={selectedClass === constants.FEE_SLOW}
                onClick={() => {
                    onOptionChange(constants.FEE_SLOW, fees.min);
                }}
                feeClass={constants.FEE_SLOW}
            />
            <FeeOption
                name={t('COMMON.AVERAGE')}
                value={formatFee(calculateGasFee(fees.avg, gasLimit))}
                isSelected={selectedClass === constants.FEE_AVERAGE}
                onClick={() => {
                    onOptionChange(constants.FEE_AVERAGE, fees.avg);
                }}
                feeClass={constants.FEE_AVERAGE}
            />
            <FeeOption
                name={t('COMMON.FAST')}
                value={formatFee(calculateGasFee(fees.max, gasLimit))}
                isSelected={selectedClass === constants.FEE_FAST}
                onClick={() => {
                    onOptionChange(constants.FEE_FAST, fees.max);
                }}
                feeClass={constants.FEE_FAST}
            />
        </div>
    );
};
