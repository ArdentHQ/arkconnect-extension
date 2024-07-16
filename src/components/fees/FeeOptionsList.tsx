import { useTranslation } from 'react-i18next';
import { FeeOption, FeeOptionSkeleton } from './FeeOption';
import { TransactionFees } from '@/lib/hooks/useNetworkFees';
import constants from '@/constants';

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
                value={fees.min}
                isSelected={fee == fees.min}
                onClick={handleClick}
                feeClass={constants.FEE_SLOW}
            />
            <FeeOption
                name={t('COMMON.AVERAGE')}
                value={fees.avg}
                isSelected={fee == fees.avg}
                onClick={handleClick}
                feeClass={constants.FEE_DEFAULT}
            />
            <FeeOption
                name={t('COMMON.FAST')}
                value={fees.max}
                isSelected={fee == fees.max}
                onClick={handleClick}
                feeClass={constants.FEE_FAST}
            />
        </div>
    );
};
