import { useTranslation } from 'react-i18next';
import { TokenItem } from './TokenItem';
import { WalletToken } from '@/lib/profiles/wallet-token';
import { ExternalLink, Icon, Tooltip } from '@/shared/components';
import useClipboard from '@/lib/hooks/useClipboard';
import trimAddress from '@/lib/utils/trimAddress';
import { formatTokenBalance } from '@/app/lib/utils/formatTokenBalance';

const TokenSection = ({ children, label }: { children: React.ReactNode; label: string }) => (
    <>
        <p className='mb-1 mt-4 text-sm font-medium text-theme-secondary-500 dark:text-theme-secondary-300'>
            {label}
        </p>

        <div className='overflow-hidden rounded-xl bg-white px-3 ring-1 ring-inset ring-theme-secondary-200 dark:bg-subtle-black dark:ring-theme-secondary-700'>
            {children}
        </div>
    </>
);

export const TokenBody = ({ token }: { token: WalletToken }) => {
    const { t } = useTranslation();
    const { copy } = useClipboard();

    const contractAddress = token.token().address();
    const explorerLink = token.contractExplorerLink();

    return (
        <div className='flex flex-col pb-4'>
            <TokenSection label={t('COMMON.BALANCE')}>
                <TokenItem label={t('COMMON.AMOUNT')}>
                    {formatTokenBalance(token.balance())}
                </TokenItem>

                <TokenItem label={t('COMMON.FIAT_VALUE')}>
                    <span className='text-theme-secondary-500 dark:text-theme-secondary-300'>
                        {t('COMMON.NOT_AVAILABLE')}
                    </span>
                </TokenItem>
            </TokenSection>

            <TokenSection label={t('COMMON.DETAILS')}>
                <TokenItem label={t('COMMON.SYMBOL')}>{token.token().symbol()}</TokenItem>

                <TokenItem label={t('COMMON.CONTRACT')}>
                    <div className='flex items-center gap-2 divide-x divide-theme-secondary-200 leading-[1.125rem] dark:divide-theme-secondary-700'>
                        <div className='flex items-center'>
                            <span>{trimAddress(contractAddress, 'short')}</span>

                            <Tooltip
                                content={t('COMMON.COPY_with_name', { name: t('COMMON.CONTRACT') })}
                            >
                                <button
                                    type='button'
                                    className='transition-smoothEase bg-transparent p-1 text-light-black dark:text-white'
                                    onClick={() => copy(contractAddress, t('COMMON.CONTRACT'))}
                                >
                                    <Icon
                                        icon='copy'
                                        className='text-theme-light-black h-4 w-4 dark:text-white'
                                    />
                                </button>
                            </Tooltip>
                        </div>

                        <ExternalLink
                            href={explorerLink}
                            className='flex items-center gap-1 pl-2 text-theme-primary-600 hover:no-underline dark:text-white'
                        >
                            {t('COMMON.EXPLORER')}

                            <Icon
                                icon='link-external'
                                className='text-theme-light-black h-4 w-4 dark:text-white'
                            />
                        </ExternalLink>
                    </div>
                </TokenItem>

                <TokenItem label={t('COMMON.DECIMALS')}>{token.token().decimals()}</TokenItem>
            </TokenSection>
        </div>
    );
};
