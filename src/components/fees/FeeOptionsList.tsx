import { useTranslation } from 'react-i18next';
import { FeeOption, FeeOptionSkeleton } from './FeeOption';
import { calculateGasFee, TransactionFees } from '@/lib/hooks/useNetworkFees';
import constants from '@/constants';
import { BigNumber } from '@/lib/helpers';

export const formatFee = (fee: string) => {
    return BigNumber.make(fee).decimalPlaces(7).toString();
};

export const FeeOptionsList = ({
    fee,
    setFee,
    fees,
    isLoading = false,
    setFeeClass,
}: {
    fee: string;
    setFee: (fee: string) => void;
    fees?: TransactionFees;
    isLoading?: boolean;
    setFeeClass?: (feeClass: string) => void;
}) => {
    const { t } = useTranslation();

    const handleClick = (fee: string, feeClass: string) => {
        setFee(fee);
        setFeeClass?.(feeClass);
    };

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
                value={formatFee(calculateGasFee(fees.min, '21000'))}
                isSelected={fee == fees.min}
                onClick={handleClick}
                feeClass={constants.FEE_SLOW}
            />
            <FeeOption
                name={t('COMMON.AVERAGE')}
                value={formatFee(calculateGasFee(fees.avg, '21000'))}
                isSelected={fee == fees.avg}
                onClick={handleClick}
                feeClass={constants.FEE_DEFAULT}
            />
            <FeeOption
                name={t('COMMON.FAST')}
                value={formatFee(calculateGasFee(fees.max, '21000'))}
                isSelected={fee == fees.max}
                onClick={handleClick}
                feeClass={constants.FEE_FAST}
            />
        </div>
    );
};
