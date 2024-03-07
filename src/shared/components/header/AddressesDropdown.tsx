import { Contracts } from '@ardenthq/sdk-profiles';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { runtime } from 'webextension-polyfill';
import classNames from 'classnames';
import { Icon, RadioButton } from '@/shared/components';
import {
    AddressAlias,
    AddressBalance,
    AddressWithCopy,
    LedgerIcon,
    TestnetIcon,
} from '@/components/wallet/address/Address.blocks';
import { getNetworkCurrency } from '@/lib/utils/getActiveCoin';
import { primaryWalletIdChanged } from '@/lib/store/wallet';
import { ExtensionEvents } from '@/lib/events';
import { useAppDispatch } from '@/lib/store';
import useToast from '@/lib/hooks/useToast';
import useOnClickOutside from '@/lib/hooks/useOnClickOutside';
import { useProfileContext } from '@/lib/context/Profile';

export const AddressesDropdown = ({
    addresses,
    primaryAddress,
    triggerRef,
    onClose,
}: {
    addresses: Contracts.IReadWriteWallet[];
    primaryAddress: Contracts.IReadWriteWallet;
    triggerRef: React.RefObject<HTMLDivElement | null>;
    onClose: () => void;
}) => {
    const navigate = useNavigate();
    const { profile } = useProfileContext();

    const dispatch = useAppDispatch();

    const toast = useToast();

    const dropdownRef = useRef<HTMLDivElement | null>(null);

    useOnClickOutside(dropdownRef, onClose, triggerRef as React.RefObject<HTMLDivElement>);

    const primaryAddressId = primaryAddress.id();

    const setPrimaryAddress = async (newPrimaryAddress: Contracts.IReadWriteWallet) => {
        if (newPrimaryAddress.id() === primaryAddressId) return;

        await dispatch(primaryWalletIdChanged(newPrimaryAddress.id()));

        await runtime.sendMessage({
            type: 'SET_PRIMARY_WALLET',
            data: { primaryWalletId: newPrimaryAddress.id() },
        });

        void ExtensionEvents({ profile }).changeAddress({
            wallet: {
                network: newPrimaryAddress.network().name(),
                address: newPrimaryAddress.address(),
                coin: newPrimaryAddress.network().coin(),
            },
        });

        const switchNetworkToast: string = 'Primary address changed';
        toast('success', switchNetworkToast);
    };

    return (
        <div className=' mx-4 w-full rounded-xl shadow-dropdown bg-white dark:bg-subtle-black'>
            <div className='border-b border-b-theme-secondary-200 dark:border-b-theme-secondary-600 border-solid'>
                <div className=' flex justify-between items-center p-3'>
                    <span className='font-medium text-light-black dark:text-white'>Addresses</span>

                    <button
                        type='button'
                        className='p-[7px] items-center flex rounded-full cursor-pointer transition duration-200 ease-in-out text-light-black dark:text-white hover:bg-theme-secondary-50 dark:hover:bg-theme-secondary-700'
                        onClick={() => {
                            onClose();
                            navigate('/create-import-address');
                        }}
                    >
                        <Icon icon='plus' className='h-4.5 w-4.5' />
                    </button>
                </div>
            </div>

            <div className='flex flex-col max-h-[calc(100vh-150px)] pb-2 overflow-y-auto'>
                {addresses.map((address) => (
                    <AddressRow
                        address={address}
                        key={address.address()}
                        isSelected={address.id() === primaryAddressId}
                        onPrimaryAddressChange={setPrimaryAddress}
                        onClose={onClose}
                    />
                ))}
            </div>
        </div>
    );
};

const AddressRow = ({
    address,
    isSelected,
    onClose,
    onPrimaryAddressChange,
}: {
    address: Contracts.IReadWriteWallet;
    isSelected: boolean;
    onClose: () => void;
    onPrimaryAddressChange: (wallet: Contracts.IReadWriteWallet) => Promise<void>;
}) => {
    const navigate = useNavigate();

    return (
        <div
            className={classNames(
                'flex px-3 py-4 justify-between items-center transition duration-200 ease-in-out ',
                {
                    'bg-theme-primary-50 dark:bg-theme-primary-650/15': isSelected,
                    'hover:bg-theme-secondary-50 dark:hover:bg-theme-secondary-700': !isSelected,
                },
            )}
        >
            <div className='flex gap-3 items-center'>
                <div>
                    <RadioButton
                        name='change-primary-address'
                        id={address.id()}
                        checked={isSelected}
                        onChange={() => onPrimaryAddressChange(address)}
                    />
                </div>
                <div className='flex flex-col gap-1'>
                    <div className='flex gap-1.5 items-center'>
                        <AddressAlias alias={address.alias() ?? ''} withTooltip={true} />

                        {address.isLedger() && <LedgerIcon />}

                        {address.network().isTest() && <TestnetIcon />}
                    </div>

                    <div className='flex gap-1.5 items-center'>
                        <AddressWithCopy address={address.address()} />
                        <div>•</div>
                        <AddressBalance
                            balance={address.balance()}
                            currency={getNetworkCurrency(address.network())}
                        />
                    </div>
                </div>
            </div>

            <button
                type='button'
                onClick={() => {
                    onClose();
                    navigate('/address/settings', { state: { address } });
                }}
                className={classNames(
                    'p-[7px] items-center flex rounded-full cursor-pointer transition duration-200 ease-in-out text-light-black dark:text-white hover:bg-theme-secondary-50 dark:hover:bg-theme-secondary-700',
                    {
                        'hover:bg-theme-primary-200/60 dark:hover:bg-theme-primary-800/50':
                            isSelected,
                        'hover:bg-theme-secondary-200 dark:hover:bg-theme-secondary-600':
                            !isSelected,
                    },
                )}
            >
                <Icon icon='transparent-settings' className='h-4.5 w-4.5' />
            </button>
        </div>
    );
};
