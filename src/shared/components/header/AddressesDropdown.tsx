import { useLocation, useNavigate } from 'react-router-dom';
import cn from 'classnames';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Contracts } from '@/lib/profiles';
import {
    AddressAlias,
    AddressBalance,
    AddressWithCopy,
    LedgerIcon,
} from '@/components/wallet/address/Address.blocks';
import { Icon, RadioButton } from '@/shared/components';

import { getNetworkCurrency } from '@/lib/utils/getActiveCoin';
import { primaryWalletIdChanged } from '@/lib/store/wallet';
import { useAppDispatch } from '@/lib/store';
import { useEnvironmentContext } from '@/lib/context/Environment';
import useOnClickOutside from '@/lib/hooks/useOnClickOutside';
import { useProfileContext } from '@/lib/context/Profile';
import useToast from '@/lib/hooks/useToast';

export const AddressesDropdown = ({
    addresses,
    primaryAddress,
    triggerRef,
    onClose,
}: {
    addresses: Contracts.IReadWriteWallet[];
    primaryAddress: Contracts.IReadWriteWallet;
    triggerRef: React.RefObject<HTMLButtonElement | null>;
    onClose: () => void;
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { profile, initProfile } = useProfileContext();
    const { persist } = useEnvironmentContext();

    const dispatch = useAppDispatch();

    const toast = useToast();

    const dropdownRef = useRef<HTMLDivElement | null>(null);

    useOnClickOutside(dropdownRef, onClose, triggerRef as React.RefObject<HTMLButtonElement>);

    const primaryAddressId = primaryAddress.id();

    const { pathname } = useLocation();

    const setPrimaryAddress = async (newPrimaryAddress: Contracts.IReadWriteWallet) => {
        if (newPrimaryAddress.id() === primaryAddressId) return;

        // Redirect to home page if the user is on the transaction details page
        // To avoid errors after switching to another address
        if (pathname.includes('/transaction/')) {
            navigate('/');
        }

        await dispatch(primaryWalletIdChanged(newPrimaryAddress.id()));

        for (const wallet of profile.wallets().values()) {
            if (wallet.id() === newPrimaryAddress.id()) {
                wallet.data().set(Contracts.WalletData.IsPrimary, true);
                continue;
            }
            wallet.data().set(Contracts.WalletData.IsPrimary, false);
        }

        await persist();
        await initProfile();

        const switchNetworkToast: string = 'Primary address changed';
        toast('success', switchNetworkToast);
    };

    return (
        <div
            className='shadow-dropdown dark:bg-subtle-black dark:shadow-dropdown-dark mx-4 w-full rounded-xl bg-white'
            ref={dropdownRef}
        >
            <div className='border-b-theme-secondary-200 dark:border-b-theme-secondary-600 border-b border-solid'>
                <div className='flex items-center justify-between p-3'>
                    <span className='text-light-black font-medium dark:text-white'>
                        {t('COMMON.ADDRESSES')}
                    </span>

                    <button
                        type='button'
                        className='text-light-black hover:bg-theme-secondary-50 dark:hover:bg-theme-secondary-700 flex cursor-pointer items-center rounded-full p-1.75 transition duration-200 ease-in-out dark:text-white'
                        onClick={() => {
                            onClose();
                            navigate('/create-import-address');
                        }}
                    >
                        <Icon icon='plus' className='h-4.5 w-4.5' />
                    </button>
                </div>
            </div>

            <div className='custom-scroll flex max-h-[calc(100vh-150px)] flex-col overflow-y-auto pb-2'>
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
            className={cn(
                'flex items-center justify-between px-3 py-4 transition duration-200 ease-in-out',
                {
                    'bg-theme-primary-50 dark:bg-theme-primary-650/15': isSelected,
                    'hover:bg-theme-secondary-50 dark:hover:bg-theme-secondary-700': !isSelected,
                },
            )}
        >
            <div className='flex items-center gap-3'>
                <div>
                    <RadioButton
                        name='change-primary-address'
                        id={address.id()}
                        checked={isSelected}
                        onChange={() => onPrimaryAddressChange(address)}
                    />
                </div>
                <div className='flex flex-col gap-1'>
                    <div className='flex items-center gap-1.5'>
                        <AddressAlias alias={address.alias() ?? ''} withTooltip={true} />

                        {address.isLedger() && <LedgerIcon />}
                    </div>

                    <div className='text-theme-secondary-500 dark:text-theme-secondary-400 flex items-center gap-1.5'>
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
                className={cn(
                    'text-light-black flex cursor-pointer items-center rounded-full p-1.75 transition duration-200 ease-in-out dark:text-white',
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
