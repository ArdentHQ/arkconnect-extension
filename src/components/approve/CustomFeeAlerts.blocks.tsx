import { useTranslation } from 'react-i18next';
import { Icon, Tooltip } from '@/shared/components';
import cropToMaxDigits from '@/lib/utils/cropToMaxDigits';

export const FeeWarning = ({
    averageFee,
    coin,
    customFeeState,
}: {
    averageFee: string;
    coin: string;
    customFeeState: string | null;
}) => {
    const { t } = useTranslation();
    // TODO find a way to format fee without casting it to number
    const formattedAmount = cropToMaxDigits({
        value: +averageFee,
        maxDigits: 8,
    });

    return (
        <Tooltip
            content={
                <span>
                    {t('MISC.FEE_WARNING.TOP_LINE', {
                        state: customFeeState?.toLowerCase(),
                    })}
                    <br />
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
                    className='text-theme-warning-500 dark:text-theme-warning-400 h-[18px] w-[18px]'
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
    averageFee: string;
    coin: string;
    onClose: () => void;
    customFeeState: string | null;
}) => {
    const { t } = useTranslation();
    // TODO find a way to format fee without casting it to number
    const formattedAmount = cropToMaxDigits({
        value: +averageFee,
        maxDigits: 8,
    });

    return (
        <div className='border-theme-warning-500 bg-theme-warning-50 text-theme-warning-600 dark:border-theme-warning-400 dark:text-theme-warning-400 absolute flex w-full flex-row items-center justify-between gap-4 border-b px-4 py-2 dark:bg-[#4B4133]'>
            <div className='flex items-center gap-2'>
                <Icon icon='information-circle' className='h-5 w-5 shrink-0' />
                <span className='text-sm leading-[17.5px]'>
                    {t('MISC.FEE_WARNING.TOP_LINE', {
                        state: customFeeState?.toLowerCase(),
                    })}{' '}
                    {t('MISC.FEE_WARNING.BOTTOM_LINE', {
                        formattedAmount,
                        coin,
                    })}
                </span>
            </div>
            <button onClick={onClose}>
                <Icon icon='x' className='dark:text-theme-warning-500 h-4.5 w-4.5' />
            </button>
        </div>
    );
};
