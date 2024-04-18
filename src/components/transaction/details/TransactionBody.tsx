import { useTranslation } from 'react-i18next';
import { TrasactionItem } from './TrasactionItem';
import { AmountBadge } from './AmountBadge';
import { Button, ExternalLink, Icon } from '@/shared/components';
import useClipboard from '@/lib/hooks/useClipboard';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
import { getExplorerDomain } from '@/lib/utils/networkUtils';

export const TransactionBody = () => {
    const { t } = useTranslation();
    const { copy } = useClipboard();

    const primaryWallet = usePrimaryWallet();

    return (
        <div className='flex flex-col gap-4 pb-4'>
            <div>
                <TrasactionItem title={t('COMMON.SENDER')}>
                    ARK #1{' '}
                    <span className='text-theme-secondary-500 dark:text-theme-secondary-300'>
                        ARoka...uRKma
                    </span>
                </TrasactionItem>

                <TrasactionItem title={t('COMMON.RECIPIENT')}>
                    ARK #1{' '}
                    <span className='text-theme-secondary-500 dark:text-theme-secondary-300'>
                        ARoka...uRKma
                    </span>
                </TrasactionItem>

                <TrasactionItem title={t('COMMON.AMOUNT')}>
                    <AmountBadge amount={'+14.56128396 ARK'} type='positive' />
                    <span className='pl-0.5 text-theme-secondary-500 dark:text-theme-secondary-300'>
                        $0.50
                    </span>
                </TrasactionItem>

                <TrasactionItem title={t('COMMON.TRANSACTION_FEE')}>
                    0.75 ARK{' '}
                    <span className='text-theme-secondary-500 dark:text-theme-secondary-300'>
                        $0.50
                    </span>
                </TrasactionItem>

                <TrasactionItem title={t('COMMON.TIMESTAMP')}>27 Mar 2024, 15:01:04</TrasactionItem>

                <TrasactionItem title={t('COMMON.TRANSACTION_ID')}>
                    <div className='flex w-full flex-row items-center justify-between'>
                        <span>231d80d0c255a...fc4a6019815773f0</span>
                        <button
                            type='button'
                            className='block'
                            onClick={() =>
                                copy('231d80d0c255afc4a6019815773f0', t('COMMON.TRANSACTION_ID'))
                            }
                        >
                            <Icon
                                icon='copy'
                                className='h-5 w-5 text-theme-primary-700 dark:text-theme-primary-650'
                            />
                        </button>
                    </div>
                </TrasactionItem>

                <TrasactionItem title={t('COMMON.MEMO')}>
                    <span className='text-theme-secondary-500 dark:text-theme-secondary-300'>
                        N/A
                    </span>
                </TrasactionItem>

                <TrasactionItem title={t('COMMON.VOTE')}>
                    boldninja{' '}
                    <span className='text-theme-secondary-500 dark:text-theme-secondary-300'>
                        DKrAC...fXYqu
                    </span>
                </TrasactionItem>

                <TrasactionItem title={t('COMMON.UNVOTE')}>
                    genesis_31{' '}
                    <span className='text-theme-secondary-500 dark:text-theme-secondary-300'>
                        DJmvh...K3yLt
                    </span>
                </TrasactionItem>
            </div>
            <div>
                <ExternalLink
                    href={getExplorerDomain(
                        primaryWallet?.network().isLive() ?? false,
                        primaryWallet?.address() ?? '',
                    )}
                    className='hover:no-underline'
                >
                    <Button variant='secondary'>{t('COMMON.VIEW_ON_ARKSCAN')}</Button>
                </ExternalLink>
            </div>
        </div>
    );
};
