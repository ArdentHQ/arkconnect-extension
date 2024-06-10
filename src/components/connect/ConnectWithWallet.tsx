import { Contracts } from '@ardenthq/sdk-profiles';
import { useTranslation } from 'react-i18next';
import { WalletCard } from './WalletCard';
import { RowLayout } from '@/shared/components';

type Props = {
    wallet?: Contracts.IReadWriteWallet;
};

const ConnectWithWallet = ({ wallet }: Props) => {
    const { t } = useTranslation();
    return (
        <div className='flex flex-1 flex-col items-center px-4'>
            <div className='mb-2 text-sm font-medium text-theme-secondary-500 dark:text-theme-secondary-300'>
                {t('PAGES.CONNECT.CONNECTING_WITH')}
            </div>

            {wallet ? (
                <WalletCard wallet={wallet} />
            ) : (
                <RowLayout
                    variant='errorFree'
                    className='text-theme-primary-700 dark:text-theme-primary-650'
                    iconClassName='text-theme-primary-700 dark:text-theme-primary-650'
                    title={t('PAGES.CONNECT.NO_WALLETS_FOUND')}
                    helperText={t('PAGES.CONNECT.CREATE_OR_IMPORT_NEW_WALLET')}
                    tabIndex={-1}
                />
            )}
        </div>
    );
};

export default ConnectWithWallet;
