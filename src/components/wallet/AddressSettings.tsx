import { Contracts } from '@ardenthq/sdk-profiles';
import { useLocation, useNavigate } from 'react-router-dom';
import Amount from './Amount';
import SubPageLayout from '@/components/settings/SubPageLayout';
import useThemeMode from '@/lib/hooks/useThemeMode';
import { FlexContainer, Paragraph, Tooltip } from '@/shared/components';
import { AddressAlias, LedgerIcon, TestnetIcon } from '@/components/wallet/address/Address.blocks';
import { getNetworkCurrency } from '@/lib/utils/getActiveCoin';
import useClipboard from '@/lib/hooks/useClipboard';
import { ToastPosition } from '@/components/toast/ToastContainer';
import trimAddress from '@/lib/utils/trimAddress';
import { getExplorerDomain } from '@/lib/utils/networkUtils';
import { SettingsOption } from '@/components/settings/SettingsOption';
import SafeOutlineOverflowContainer from '@/shared/components/layout/SafeOutlineOverflowContainer';
import { handleSubmitKeyAction } from '@/lib/utils/handleKeyAction';

export const AddressSettings = () => {
    const { state } = useLocation();

    const { address } = state;

    const { copy } = useClipboard();

    const navigate = useNavigate();

    return (
        <SubPageLayout title='Address Settings'>
            <AddressRow address={address} />
            <SafeOutlineOverflowContainer>
                <FlexContainer
                    marginY='8'
                    borderRadius='16'
                    paddingY='8'
                    backgroundColor='secondaryBackground'
                    display='flex'
                    flexDirection='column'
                    overflow='hidden'
                >
                    <SettingsOption
                        iconLeading='pencil'
                        title='Edit Name'
                        onClick={() => navigate(`/edit-address-name/${address.id()}`)}
                        iconTrailing='arrow-right'
                        onKeyDown={(e) =>
                            handleSubmitKeyAction(e, () =>
                                navigate(`/edit-address-name/${address.id()}`),
                            )
                        }
                    />

                    <SettingsOption
                        iconLeading='copy'
                        title='Copy Address'
                        onClick={() => {
                            copy(
                                address.address(),
                                trimAddress(address.address(), 10),
                                ToastPosition.LOWER,
                            );
                        }}
                        onKeyDown={(e) =>
                            handleSubmitKeyAction(e, () =>
                                copy(
                                    address.address(),
                                    trimAddress(address.address(), 10),
                                    ToastPosition.LOWER,
                                ),
                            )
                        }
                    />

                    <Tooltip
                        content={
                            <Paragraph>
                                Ledger devices do not allow <br /> access to the passphrase.
                            </Paragraph>
                        }
                        placement='bottom'
                        disabled={!address.isLedger()}
                    >
                        <SettingsOption
                            disabled={address.isLedger()}
                            iconLeading='show-passphrase'
                            title='Show Passphrase'
                            onClick={() => {
                                navigate(`/view-sensitive-info/${address.id()}/passphrase`);
                            }}
                            iconTrailing='arrow-right'
                            onKeyDown={(e) =>
                                handleSubmitKeyAction(e, () =>
                                    navigate(`/view-sensitive-info/${address.id()}/passphrase`),
                                )
                            }
                        />
                    </Tooltip>

                    <Tooltip
                        content={
                            <Paragraph>
                                Ledger devices do not allow <br /> access to the private key.
                            </Paragraph>
                        }
                        placement='bottom'
                        disabled={!address.isLedger()}
                    >
                        <SettingsOption
                            disabled={address.isLedger()}
                            iconLeading='key'
                            title='Show Private Key'
                            onClick={() => {
                                navigate(`/view-sensitive-info/${address.id()}/privateKey`);
                            }}
                            iconTrailing='arrow-right'
                            onKeyDown={(e) =>
                                handleSubmitKeyAction(e, () =>
                                    navigate(`/view-sensitive-info/${address.id()}/privateKey`),
                                )
                            }
                        />
                    </Tooltip>

                    <SettingsOption
                        iconLeading='link-external'
                        title='View on ARKScan'
                        onClick={() => {
                            window.open(
                                getExplorerDomain(address.network().isLive(), address.address()),
                            );
                        }}
                        onKeyDown={(e) =>
                            handleSubmitKeyAction(e, () =>
                                window.open(
                                    getExplorerDomain(
                                        address.network().isLive(),
                                        address.address(),
                                    ),
                                ),
                            )
                        }
                    />

                    <SettingsOption
                        iconLeading='trash'
                        title='Remove Address'
                        onClick={() => {
                            navigate('/logout', { state: [address.id()] });
                        }}
                        variant='error'
                        iconTrailing='arrow-right'
                        onKeyDown={(e) =>
                            handleSubmitKeyAction(e, () =>
                                navigate('/logout', { state: [address.id()] }),
                            )
                        }
                    />
                </FlexContainer>
            </SafeOutlineOverflowContainer>
        </SubPageLayout>
    );
};

const AddressRow = ({ address }: { address: Contracts.IReadWriteWallet }) => {
    const { getThemeColor } = useThemeMode();

    return (
        <FlexContainer
            gridGap='12'
            border='1px solid'
            borderRadius='16'
            borderColor={getThemeColor('primary600', 'primary650')}
            backgroundColor={getThemeColor('lightGreen', '#02a86326')}
            boxShadow='0 1px 4px 0 rgba(0, 0, 0, 0.05)'
            padding='16'
        >
            <FlexContainer flexDirection='column' gridGap='8'>
                <FlexContainer gridGap='8' alignItems='center'>
                    <AddressAlias alias={address.alias() ?? ''} isBold />

                    {address.isLedger() && <LedgerIcon />}

                    {address.network().isTest() && <TestnetIcon />}
                </FlexContainer>

                <Paragraph $typeset='body' color='base'>
                    {address.address()}
                </Paragraph>

                <Paragraph $typeset='body' color='base'>
                    <Amount
                        ticker={getNetworkCurrency(address.network())}
                        maxDigits={5}
                        value={address.balance()}
                        withTicker
                    />
                </Paragraph>
            </FlexContainer>
        </FlexContainer>
    );
};
