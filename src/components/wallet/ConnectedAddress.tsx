import { Contracts } from '@ardenthq/sdk-profiles';
import { Button, Heading } from '@/shared/components';
import formatDomain from '@/lib/utils/formatDomain';
import {
    Address,
    AddressAlias,
    AddressBalance,
    LedgerIcon,
    TestnetIcon,
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

                <p className='typeset-headline mt-1.5 text-theme-secondary-500 dark:text-theme-secondary-300'>
                    The following address is currently connected to{' '}
                    <span className='font-medium text-light-black dark:text-white'>
                        {formatDomain(connectedTo, false)}
                    </span>
                </p>
            </div>

            <div>
                <AddressRow address={wallet} logo={logo} />

                <Button variant='linkDestructive' onClick={onDisconnect} className='mb-1 mt-5 hover:text-theme-error-700 dark:hover:text-theme-error-600 hover:underline underline-offset-2'>
                    Disconnect
                </Button>
            </div>
        </>
    );
};

const AddressRow = ({ address, logo }: { address: Contracts.IReadWriteWallet; logo: string }) => {
    return (
        <div className='flex gap-3 rounded-2xl border border-solid border-theme-primary-600 bg-theme-primary-50 p-4 shadow-light dark:border-theme-primary-650 dark:bg-theme-primary-650/15'>
            <ConnectionLogoImage
                appLogo={logo}
                appName='Connected'
                roundCorners
                withBorder
                className='h-10 w-10 border-theme-primary-200 dark:border-[#296148]'
            />
            <div className='flex flex-col gap-1'>
                <div className='flex items-center gap-1.5'>
                    <AddressAlias alias={address.alias() ?? ''} />

                    {address.isLedger() && <LedgerIcon />}

                    {address.network().isTest() && <TestnetIcon />}
                </div>

                <div className='flex items-center gap-1.5 text-theme-secondary-500 dark:text-theme-secondary-300'>
                    <Address address={address.address()} />
                    <div className="leading-[18px]">•</div>
                    <AddressBalance
                        balance={address.balance()}
                        currency={getNetworkCurrency(address.network())}
                    />
                </div>
            </div>
        </div>
    );
};

export default ConnectedAddress;
