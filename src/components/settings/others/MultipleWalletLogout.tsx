import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SubPageLayout from '@/components/settings/SubPageLayout';
import { Button, Checkbox, HeadingDescription, RowLayout } from '@/shared/components';
import { selectWalletsIds } from '@/lib/store/wallet';
import { useAppSelector } from '@/lib/store';
import trimAddress from '@/lib/utils/trimAddress';
import { generateWalletHelperText } from '@/lib/utils/generateWalletHelperText';
import { useProfileContext } from '@/lib/context/Profile';
import { Footer } from '@/shared/components/layout/Footer';

const MultipleWalletLogout = () => {
    const { t } = useTranslation();
    const { profile } = useProfileContext();
    const walletsIds = useAppSelector(selectWalletsIds);
    const wallets = walletsIds
        .map((walletId) => profile.wallets().findById(walletId))
        .filter(Boolean);
    const [selectedIdsToLogout, setSelectedIdsToLogout] = useState<string[]>([]);
    const navigate = useNavigate();

    const handleSelectWallet = (
        evt:
            | React.MouseEvent<HTMLElement>
            | React.ChangeEvent<HTMLElement>
            | React.KeyboardEvent<HTMLDivElement>,
        walletId: string,
    ) => {
        evt.preventDefault();
        evt.stopPropagation();
        if (selectedIdsToLogout.includes(walletId)) {
            setSelectedIdsToLogout(
                selectedIdsToLogout.filter((selectedId) => selectedId !== walletId),
            );
        } else {
            setSelectedIdsToLogout([...selectedIdsToLogout, walletId]);
        }
    };

    const handleSelectAllWallets = () => {
        const extractedIds = Object.values(wallets).map((wallet) => wallet.id());
        setSelectedIdsToLogout([...extractedIds]);
        navigate('/logout', { state: extractedIds });
    };

    return (
        <SubPageLayout
            title={t('PAGES.LOGOUT.REMOVE_ADDRESSES')}
            footer={
                <Footer className='flex flex-col gap-4'>
                    <Button
                        variant={!selectedIdsToLogout.length ? 'primary' : 'destructivePrimary'}
                        onClick={() => {
                            navigate('/logout', { state: selectedIdsToLogout });
                        }}
                        disabled={!selectedIdsToLogout.length}
                    >
                        {t('ACTION.REMOVE')}{' '}
                        {selectedIdsToLogout.length > 0 && `(${selectedIdsToLogout.length})`}
                    </Button>
                    <Button variant='primaryLinkDestructive' onClick={handleSelectAllWallets}>
                        {t('PAGES.LOGOUT.REMOVE_ALL_ADDRESSES')}
                    </Button>
                </Footer>
            }
        >
            <div className='flex h-full flex-col'>
                <HeadingDescription className='mb-6'>
                    {t('PAGES.LOGOUT.SELECT_ADDRESSES_TO_REMOVE')}
                </HeadingDescription>

                {wallets.map((wallet) => {
                    return (
                        <RowLayout
                            key={wallet.id()}
                            title={
                                wallet.alias()
                                    ? wallet.alias()
                                    : trimAddress(wallet.address(), 'long')
                            }
                            address={wallet.address()}
                            helperText={generateWalletHelperText(wallet, false)}
                            className='mb-2'
                            testnetIndicator={wallet.network().isTest()}
                            ledgerIndicator={wallet.isLedger()}
                            onClick={(evt) => handleSelectWallet(evt, wallet.id())}
                            currency={wallet.currency()}
                        >
                            <span className='block h-5 w-5'>
                                <Checkbox
                                    name='select-wallet'
                                    id={wallet.id()}
                                    checked={selectedIdsToLogout.includes(wallet.id())}
                                    onChange={(evt) => handleSelectWallet(evt, wallet.id())}
                                    tabIndex={-1}
                                />
                            </span>
                        </RowLayout>
                    );
                })}
            </div>
        </SubPageLayout>
    );
};

export default MultipleWalletLogout;
