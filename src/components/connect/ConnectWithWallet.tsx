import { Contracts } from '@ardenthq/sdk-profiles';
import { WalletCard } from './WalletCard';
import { RowLayout } from '@/shared/components';

type Props = {
    wallet?: Contracts.IReadWriteWallet;
};

const ConnectWithWallet = ({ wallet }: Props) => {
    return (
        <div className=' flex flex-1 flex-col items-center px-4'>
            <div className=' mb-2 text-sm font-medium text-theme-secondary-500 dark:text-theme-secondary-300'>
                Connecting with
            </div>

            {wallet ? (
                <WalletCard wallet={wallet} />
            ) : (
                <RowLayout
                    variant='errorFree'
                    className='text-theme-primary-700 dark:text-theme-primary-650'
                    iconClassName='text-theme-primary-700 dark:text-theme-primary-650'
                    title='No wallets found in your profile!'
                    helperText={'Create or import new wallet'}
                    tabIndex={-1}
                />
            )}
        </div>
    );
};

export default ConnectWithWallet;
