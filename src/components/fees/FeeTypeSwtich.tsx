import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import { ToggleSwitch } from '@/shared/components';

interface FeeTypeSwitchProps {
    advancedFee: boolean;
    setAdvancedFeeView: (value: boolean) => void;
}

export const FeeTypeSwtich = ({
    advancedFee,
    setAdvancedFeeView,
}: FeeTypeSwitchProps) => {
    const { t } = useTranslation();

    return (
        <div className='flex flex-row items-center gap-2'>
            <span className={cn('text-sm font-normal', {
                'text-theme-secondary-500 dark:text-theme-secondary-300': advancedFee,
                'text-light-black dark:text-white': !advancedFee,
            })}>
                {t('COMMON.SIMPLE')}
            </span>
            <ToggleSwitch
                checked={advancedFee}
                onChange={() => setAdvancedFeeView(!advancedFee)}
                id='set-advanced-fee'
                variant='always-active'
            />
            <span className={cn('text-sm font-normal', {
                'text-theme-secondary-500 dark:text-theme-secondary-300': !advancedFee,
                'text-light-black dark:text-white': advancedFee,
            })}>
                {t('COMMON.ADVANCED')}
            </span>
        </div>
    );
};
