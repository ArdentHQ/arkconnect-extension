import { useTranslation } from 'react-i18next';
import { FeeOption, FeeOptionSkeleton } from './FeeOption';
import { NetworkFee } from '@/lib/hooks/useNetworkFees';

export const FeeOptionsList = ({
    fee,
    setFee,
    fees,
    isLoading = false,
}: {
    fee: string;
    setFee: (fee: string) => void;
    fees: NetworkFee['fees'];
    isLoading?: boolean;
}) => {
    const { t } = useTranslation();

    const handleClick = (fee: string) => {
        setFee(fee);
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
                value={fees.min.crypto}
                isSelected={fee == fees.min.crypto}
                onClick={handleClick}
            />
            <FeeOption
                name={t('COMMON.AVERAGE')}
                value={fees.avg.crypto}
                isSelected={fee == fees.avg.crypto}
                onClick={handleClick}
            />
            <FeeOption
                name={t('COMMON.FAST')}
                value={fees.max.crypto}
                isSelected={fee == fees.max.crypto}
                onClick={handleClick}
            />
        </div>
    );
};
