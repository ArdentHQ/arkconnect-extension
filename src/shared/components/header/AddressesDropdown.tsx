import { Contracts } from '@ardenthq/sdk-profiles';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { runtime } from 'webextension-polyfill';
import styled from 'styled-components';
import { Container, FlexContainer, Icon, Paragraph, RadioButton } from '@/shared/components';
import useThemeMode from '@/lib/hooks/useThemeMode';
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
import { DropdownMenuContainerProps } from '@/components/settings/SettingsMenu';
import { isFirefox } from '@/lib/utils/isFirefox';

const StyledFlexContainer = styled(FlexContainer)<DropdownMenuContainerProps>`
    ${(props) => `
  transition: ${isFirefox ? 'background 0.2s ease-in-out' : 'all 0.2s ease-in-out'};
  &:hover {
    background-color: ${props.theme.colors.lightGrayHover};
  }
  background-color: 'transparent';

  ${isFirefox ? props.theme.browserCompatibility.firefox.focus : ''}
`}
`;
const StyledFlexContainerSettings = styled(FlexContainer)<DropdownMenuContainerProps>`
    ${(props) => `
  transition: ${isFirefox ? 'background 0.2s ease-in-out' : 'all 0.2s ease-in-out'};
  &:hover {
    background-color: ${
        props.selected ? props.theme.colors.lightGreenHover : props.theme.colors.lightGrayHover2
    }
  }
  background-color: 'transparent';

  ${isFirefox ? props.theme.browserCompatibility.firefox.focus : ''}
`}
`;

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
                    <Paragraph $typeset='headline' fontWeight='medium' color='base'>
                        Addresses
                    </Paragraph>

                    <button
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
            <FlexContainer
                flexDirection='column'
                paddingBottom='8'
                maxHeight='calc(100vh - 150px)'
                overflowY='auto'
            >
                {addresses.map((address) => (
                    <AddressRow
                        address={address}
                        key={address.address()}
                        isSelected={address.id() === primaryAddressId}
                        onPrimaryAddressChange={setPrimaryAddress}
                        onClose={onClose}
                    />
                ))}
            </FlexContainer>
        </div>
    );
};

const StyledWrapper = styled(FlexContainer)<{ isDark: boolean; selected: boolean }>`
    ${(props) => `
  transition: all 0.2s ease-in-out;
  ${
      !props.selected
          ? `
    &:hover {
      background-color: ${props.isDark ? '#484646' : props.theme.colors.secondary50}
    }
  `
          : ''
  }
`}
`;

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

    const { getThemeColor, isDark } = useThemeMode();

    return (
        <StyledWrapper
            paddingX='12'
            paddingY='16'
            justifyContent='space-between'
            alignItems='center'
            selected={isSelected}
            isDark={isDark()}
            backgroundColor={isSelected ? getThemeColor('primary50', '#02a86326') : undefined}
        >
            <FlexContainer gridGap='12' alignItems='center'>
                <Container>
                    <RadioButton
                        name='change-primary-address'
                        id={address.id()}
                        checked={isSelected}
                        onChange={() => onPrimaryAddressChange(address)}
                    />
                </Container>
                <FlexContainer flexDirection='column' gridGap='4'>
                    <FlexContainer gridGap='6' alignItems='center'>
                        <AddressAlias alias={address.alias() ?? ''} withTooltip={true} />

                        {address.isLedger() && <LedgerIcon />}

                        {address.network().isTest() && <TestnetIcon />}
                    </FlexContainer>

                    <FlexContainer gridGap='6' color='gray' alignItems='center'>
                        <AddressWithCopy address={address.address()} />
                        <div>•</div>
                        <AddressBalance
                            balance={address.balance()}
                            currency={getNetworkCurrency(address.network())}
                        />
                    </FlexContainer>
                </FlexContainer>
            </FlexContainer>
            <StyledFlexContainerSettings
                padding='7'
                alignItems='center'
                borderRadius='50'
                color='base'
                as='button'
                className='c-pointer'
                onClick={() => {
                    onClose();
                    navigate('/address/settings', { state: { address } });
                }}
                selected={isSelected}
            >
                <Icon icon='transparent-settings' className='h-4.5 w-4.5' />
            </StyledFlexContainerSettings>
        </StyledWrapper>
    );
};
