import { useTranslation } from 'react-i18next';
import { WalletToken } from '@/lib/profiles/wallet-token';
import { ExternalLink, Icon, Tooltip } from '@/shared/components';
import useClipboard from '@/lib/hooks/useClipboard';
import trimAddress from '@/lib/utils/trimAddress';
import { formatTokenBalance } from '@/app/lib/utils/formatTokenBalance';
import { TokenItem } from './TokenItem';

const TokenSection = ({ children, label }: { children: React.ReactNode; label: string }) => (
    <>
        <p className='text-theme-secondary-500 dark:text-theme-secondary-300 mt-4 mb-1 text-sm font-medium'>
            {label}
        </p>

        <div className='ring-theme-secondary-200 dark:bg-subtle-black dark:ring-theme-secondary-700 overflow-hidden rounded-xl bg-white px-3 ring-1 ring-inset'>
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
                <TokenItem label={t('COMMON.SYMBOL')} className="truncate">
                    <span className="truncate max-w-[225px]">
                        {token.token().symbol()}
                    </span>
                </TokenItem>

                <TokenItem label={t('COMMON.CONTRACT')}>
                    <div className='divide-theme-secondary-200 dark:divide-theme-secondary-700 flex items-center divide-x leading-[1.125rem]'>
                        <div className='flex items-center pr-2'>
                            <span>{trimAddress(contractAddress, 'short')}</span>

                            <Tooltip
                                content={t('COMMON.COPY_with_name', { name: t('COMMON.CONTRACT') })}
                            >
                                <button
                                    type='button'
                                    className='transition-smoothEase text-light-black bg-transparent p-1 dark:text-white'
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
                            className='text-theme-primary-600 flex items-center gap-1 pl-2 hover:no-underline dark:text-white'
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
