import { Contracts } from '@/lib/profiles';
import { Button, Heading, HeadingDescription } from '@/shared/components';
import formatDomain from '@/lib/utils/formatDomain';
import {
    Address,
    AddressAlias,
    AddressBalance,
    LedgerIcon,
} from '@/components/wallet/address/Address.blocks';
import ConnectionLogoImage from '@/components/connections/ConnectionLogoImage';
import { getNetworkCurrency } from '@/lib/utils/getActiveCoin';

type Properties = {
    connectedTo?: string;
    address: string;
    logo: string;
    wallet: Contracts.IReadWriteWallet;
    onDisconnect?: () => void;
};

const ConnectedAddress = ({ connectedTo, wallet, logo, onDisconnect }: Properties) => {
    return (
        <>
            <div>
                <Heading level={4}>Connected Address</Heading>

                <HeadingDescription className='mt-1.5'>
                    The following address is currently connected to{' '}
                    <span className='text-light-black font-medium dark:text-white'>
                        {formatDomain(connectedTo, false)}
                    </span>
                </HeadingDescription>
            </div>

            <div>
                <AddressRow address={wallet} logo={logo} />

                <Button
                    variant='linkDestructive'
                    onClick={onDisconnect}
                    className='hover:text-theme-error-700 dark:hover:text-theme-error-600 mt-5 mb-1 underline-offset-2 hover:underline'
                >
                    Disconnect
                </Button>
            </div>
        </>
    );
};

const AddressRow = ({ address, logo }: { address: Contracts.IReadWriteWallet; logo: string }) => {
    return (
        <div className='border-theme-secondary-200 bg-theme-secondary-50 shadow-light dark:border-theme-secondary-700 dark:bg-subtle-black flex gap-3 rounded-2xl border border-solid p-4'>
            <ConnectionLogoImage
                appLogo={logo}
                appName='Connected'
                roundCorners
                withBorder
                className='border-theme-secondary-200 dark:border-theme-secondary-700 h-10 w-10'
            />
            <div className='flex flex-col gap-1'>
                <div className='flex items-center gap-1.5'>
                    <AddressAlias alias={address.alias() ?? ''} />

                    {address.isLedger() && <LedgerIcon />}
                </div>

                <div className='text-theme-secondary-500 dark:text-theme-secondary-300 flex items-center gap-1.5'>
                    <Address
                        address={address.address()}
                        className='hover:text-light-black dark:hover:text-white'
                    />
                    <div className='leading-[18px]'>•</div>
                    <AddressBalance
                        balance={address.balance()}
                        currency={getNetworkCurrency(address.network())}
                        className='hover:text-light-black dark:hover:text-white'
                    />
                </div>
            </div>
        </div>
    );
};

export default ConnectedAddress;
