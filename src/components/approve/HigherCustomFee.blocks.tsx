import { Icon, Tooltip } from '@/shared/components';
import cropToMaxDigits from '@/lib/utils/cropToMaxDigits';

export const HigherFeeWarning = ({ averageFee, coin }: { averageFee: number; coin: string }) => {
    const formattedAmount = cropToMaxDigits({
        value: averageFee,
        maxDigits: 3,
    });

    return (
        <Tooltip
            content={
                <span>
                    The fee specified appears to be higher <br /> than the typical rate, which is{' '}
                    {formattedAmount} {coin}.
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

export const HigherFeeBanner = ({
    averageFee,
    coin,
    onClose,
}: {
    averageFee: number;
    coin: string;
    onClose: () => void;
}) => {
    const formattedAmount = cropToMaxDigits({
        value: averageFee,
        maxDigits: 3,
    });

    return (
        <div className='absolute flex w-full flex-row items-center justify-between gap-4 border-b border-theme-warning-500 bg-theme-warning-50 px-4 py-2 text-theme-warning-600 dark:border-theme-warning-400 dark:bg-[#4B4133] dark:text-theme-warning-400'>
            <div className='flex items-center gap-2'>
                <Icon icon='information-circle' className='h-5 w-5 flex-shrink-0' />
                <span className='text-sm leading-[17.5px]'>
                    The fee specified appears to be higher than the typical rate, which is{' '}
                    {formattedAmount} {coin}.
                </span>
            </div>
            <button onClick={onClose}>
                <Icon icon='x' className='h-4.5 w-4.5  dark:text-theme-warning-500' />
            </button>
        </div>
    );
};
