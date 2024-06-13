import { useTranslation } from 'react-i18next';
import { Icon, Tooltip } from '@/shared/components';
import cropToMaxDigits from '@/lib/utils/cropToMaxDigits';

export const FeeWarning = ({
    averageFee,
    coin,
    customFeeState,
}: {
    averageFee: number;
    coin: string;
    customFeeState: string | null;
}) => {
    const { t } = useTranslation();
    const formattedAmount = cropToMaxDigits({
        value: averageFee,
        maxDigits: 4,
    });

    return (
        <Tooltip
            content={
                <span>
                    {t('MISC.FEE_WARNING.TOP_LINE', {
                        state: customFeeState,
                    })}{' '}
                    {t('MISC.FEE_WARNING.BOTTOM_LINE', {
                        formattedAmount,
                        coin,
                    })}
                </span>
            }
            placement='top'
        >
            <span>
                <Icon
                    icon='warning-triangle'
                    className='h-[18px] w-[18px] text-theme-warning-500 dark:text-theme-warning-400'
                />
            </span>
        </Tooltip>
    );
};

export const FeeBanner = ({
    averageFee,
    coin,
    onClose,
    customFeeState,
}: {
    averageFee: number;
    coin: string;
    onClose: () => void;
    customFeeState: string | null;
}) => {
    const { t } = useTranslation();
    const formattedAmount = cropToMaxDigits({
        value: averageFee,
        maxDigits: 4,
    });

    return (
        <div className='absolute flex w-full flex-row items-center justify-between gap-4 border-b border-theme-warning-500 bg-theme-warning-50 px-4 py-2 text-theme-warning-600 dark:border-theme-warning-400 dark:bg-[#4B4133] dark:text-theme-warning-400'>
            <div className='flex items-center gap-2'>
                <Icon icon='information-circle' className='h-5 w-5 flex-shrink-0' />
                <span className='text-sm leading-[17.5px]'>
                    {t('MISC.FEE_WARNING.TOP_LINE', {
                        state: customFeeState,
                    })}{' '}
                    {t('MISC.FEE_WARNING.BOTTOM_LINE', {
                        formattedAmount,
                        coin,
                    })}
                </span>
            </div>
            <button onClick={onClose}>
                <Icon icon='x' className='h-4.5 w-4.5 dark:text-theme-warning-500' />
            </button>
        </div>
    );
};
