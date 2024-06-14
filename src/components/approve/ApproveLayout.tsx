import cn from 'classnames';
import { Contracts } from '@ardenthq/sdk-profiles';
import { useTranslation } from 'react-i18next';
import { FeeBanner } from './CustomFeeAlerts.blocks';
import RequestedBy from '@/shared/components/actions/RequestedBy';

export const ApproveLayout = ({
    children,
    footer,
    appDomain,
    appLogo,
    className,
    showHigherCustomFeeBanner = false,
    setShowHigherCustomFeeBanner,
    hasHigherCustomFee,
    hasLowerCustomFee,
    wallet,
    containerClassName,
}: {
    children: React.ReactNode;
    footer: React.ReactNode;
    appDomain: string;
    appLogo: string;
    className?: string;
    showHigherCustomFeeBanner?: boolean;
    setShowHigherCustomFeeBanner?: (value: boolean) => void;
    hasHigherCustomFee?: number | null;
    hasLowerCustomFee?: number | null;
    wallet?: Contracts.IReadWriteWallet;
    containerClassName?: string;
}) => {
    const { t } = useTranslation();
    const hasCustomFee = hasHigherCustomFee || hasLowerCustomFee;
    const customFeeState = hasCustomFee
        ? hasHigherCustomFee
            ? t('COMMON.HIGHER')
            : t('COMMON.LOWER')
        : null;

    return (
        <div className={cn('flex h-screen flex-col', containerClassName)}>
            {showHigherCustomFeeBanner &&
                hasCustomFee &&
                wallet &&
                setShowHigherCustomFeeBanner && (
                    <FeeBanner
                        averageFee={hasCustomFee}
                        coin={wallet.currency()}
                        onClose={() => setShowHigherCustomFeeBanner(false)}
                        customFeeState={customFeeState}
                    />
                )}
            <div className='w-full flex-none'>
                <RequestedBy appDomain={appDomain} appLogo={appLogo} />
            </div>
            <div className={cn('custom-scroll w-full flex-1 overflow-y-auto', className)}>
                {children}
            </div>
            <div className='w-full flex-none'>{footer}</div>
        </div>
    );
};
