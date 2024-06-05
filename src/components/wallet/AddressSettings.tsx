import { Contracts } from '@ardenthq/sdk-profiles';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Amount from './Amount';
import SubPageLayout from '@/components/settings/SubPageLayout';
import { Tooltip } from '@/shared/components';
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
    const { t } = useTranslation();

    const { address } = state;

    const { copy } = useClipboard();

    const navigate = useNavigate();

    return (
        <SubPageLayout title={t('PAGES.ADDRESS_SETTINGS.TITLE')}>
            <AddressRow address={address} />
            <SafeOutlineOverflowContainer>
                <div className='my-2 flex flex-col overflow-hidden rounded-2xl bg-white py-2 dark:bg-subtle-black'>
                    <SettingsOption
                        iconLeading='pencil'
                        title={t('PAGES.ADDRESS_SETTINGS.OPTIONS.EDIT_NAME')}
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
                        title={t('PAGES.ADDRESS_SETTINGS.OPTIONS.COPY_ADDRESS')}
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
                            <p>
                                {t('PAGES.ADDRESS_SETTINGS.TOOLTIP.LEDGER_DEVICES_DO_NOT_ALLOW')}
                                <br />
                                {t('PAGES.ADDRESS_SETTINGS.TOOLTIP.ACCESS_TO', {
                                    name: 'passphrase',
                                })}
                            </p>
                        }
                        placement='bottom'
                        disabled={!address.isLedger()}
                    >
                        <SettingsOption
                            disabled={address.isLedger()}
                            iconLeading='show-passphrase'
                            title={t('PAGES.ADDRESS_SETTINGS.OPTIONS.SHOW', { name: 'Passphrase' })}
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
                            <p>
                                {t('PAGES.ADDRESS_SETTINGS.TOOLTIP.LEDGER_DEVICES_DO_NOT_ALLOW')}
                                <br />
                                {t('PAGES.ADDRESS_SETTINGS.TOOLTIP.ACCESS_TO', {
                                    name: 'private key',
                                })}
                            </p>
                        }
                        placement='bottom'
                        disabled={!address.isLedger()}
                    >
                        <SettingsOption
                            disabled={address.isLedger()}
                            iconLeading='key'
                            title={t('PAGES.ADDRESS_SETTINGS.OPTIONS.SHOW', {
                                name: 'Private Key',
                            })}
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
                        title={t('PAGES.ADDRESS_SETTINGS.OPTIONS.VIEW_ON_ARKSCAN')}
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
                        title={t('PAGES.ADDRESS_SETTINGS.OPTIONS.REMOVE_ADDRESS')}
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
                </div>
            </SafeOutlineOverflowContainer>
        </SubPageLayout>
    );
};

const AddressRow = ({ address }: { address: Contracts.IReadWriteWallet }) => {
    return (
        <div className='flex gap-3 rounded-2xl border border-solid border-theme-primary-600 bg-theme-primary-50 p-4 shadow-light dark:border-theme-primary-650 dark:bg-theme-primary-650/15'>
            <div className='flex flex-col gap-2'>
                <div className='flex items-center gap-2'>
                    <AddressAlias alias={address.alias() ?? ''} isBold />

                    {address.isLedger() && <LedgerIcon />}

                    {address.network().isTest() && <TestnetIcon />}
                </div>

                <p className='typeset-body text-light-black dark:text-white'>{address.address()}</p>

                <p className='typeset-body cursor-pointer text-light-black dark:text-white'>
                    <Amount
                        ticker={getNetworkCurrency(address.network())}
                        maxDigits={5}
                        value={address.balance()}
                        withTicker
                        underlineOnHover={true}
                    />
                </p>
            </div>
        </div>
    );
};
