import { Contracts } from '@ardenthq/sdk-profiles';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';
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
import { useEnvironmentContext } from '@/lib/context/Environment';

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

    const setPrimaryAddress = async (newPrimaryAddress: Contracts.IReadWriteWallet) => {
        if (newPrimaryAddress.id() === primaryAddressId) return;

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
        <div
            className='mx-4 w-full rounded-xl bg-white shadow-dropdown dark:bg-subtle-black dark:shadow-dropdown-dark'
            ref={dropdownRef}
        >
            <div className='border-b border-solid border-b-theme-secondary-200 dark:border-b-theme-secondary-600'>
                <div className=' flex items-center justify-between p-3'>
                    <span className='font-medium text-light-black dark:text-white'>
                        {t('COMMON.ADDRESSES')}
                    </span>

                    <button
                        type='button'
                        className='flex cursor-pointer items-center rounded-full p-1.75 text-light-black transition duration-200 ease-in-out hover:bg-theme-secondary-50 dark:text-white dark:hover:bg-theme-secondary-700'
                        onClick={() => {
                            onClose();
                            navigate('/create-import-address');
                        }}
                    >
                        <Icon icon='plus' className='h-4.5 w-4.5' />
                    </button>
                </div>
            </div>

            <div className='flex max-h-[calc(100vh-150px)] flex-col overflow-y-auto pb-2'>
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
                'flex items-center justify-between px-3 py-4 transition duration-200 ease-in-out ',
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

                        {address.network().isTest() && <TestnetIcon />}
                    </div>

                    <div className='flex items-center gap-1.5 text-theme-secondary-500 dark:text-theme-secondary-400'>
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
                    'flex cursor-pointer items-center rounded-full p-1.75 text-light-black transition duration-200 ease-in-out dark:text-white',
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
