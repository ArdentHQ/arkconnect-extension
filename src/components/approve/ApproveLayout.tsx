import cn from 'classnames';
import { Contracts } from '@ardenthq/sdk-profiles';
import { HigherFeeBanner } from './HigherCustomFee.blocks';
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
    wallet?: Contracts.IReadWriteWallet;
    containerClassName?: string;
}) => {
  return (
    <div className={cn('flex flex-col h-screen', containerClassName)}>
        {showHigherCustomFeeBanner && hasHigherCustomFee && wallet && setShowHigherCustomFeeBanner && (
            <HigherFeeBanner
                averageFee={hasHigherCustomFee}
                coin={wallet.currency()}
                onClose={() => setShowHigherCustomFeeBanner(false)}
            />
        )}
        <div className='flex-none w-full'>
            <RequestedBy appDomain={appDomain} appLogo={appLogo} />
        </div>
        <div className={cn('flex-1 overflow-y-auto custom-scroll w-full', className)}>
            {children}
        </div>
        <div className='flex-none w-full'>
            {footer}
        </div>
    </div>
  );
};

