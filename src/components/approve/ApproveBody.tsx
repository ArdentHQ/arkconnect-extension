import { Contracts } from '@ardenthq/sdk-profiles';
import { RowLayout } from '@/shared/components';
import trimAddress from '@/lib/utils/trimAddress';
import { generateWalletHelperText } from '@/lib/utils/generateWalletHelperText';

type Props = {
    wallet: Contracts.IReadWriteWallet;
    error?: string;
    header: string;
    children: React.ReactNode;
};

const ApproveBody = ({ wallet, header, children, error }: Props) => {
    if (!wallet) return <></>;

    return (
        <div className='flex flex-1 flex-col items-center overflow-y-auto px-4'>
            <div className=' mb-2 text-sm font-medium text-theme-secondary-500 dark:text-theme-secondary-300'>
                {header}
            </div>

            <RowLayout
                variant='errorFree'
                className='text-theme-primary-700 dark:text-theme-primary-650'
                iconClassName='text-theme-primary-700 dark:text-theme-primary-650'
                title={wallet.alias() ? wallet.alias() : trimAddress(wallet.address(), 'long')}
                helperText={generateWalletHelperText(wallet, false)}
                testnetIndicator={wallet.network().isTest()}
                ledgerIndicator={wallet.isLedger()}
                currency={wallet.currency()}
                address={wallet.address()}
                tabIndex={-1}
            />

            {!!error && (
                <div className='mt-2 text-sm text-theme-error-600 dark:text-theme-error-500'>
                    {error}
                </div>
            )}

            <div className='custom-scroll mt-6 h-full w-full overflow-auto'>{children}</div>
        </div>
    );
};

export default ApproveBody;
