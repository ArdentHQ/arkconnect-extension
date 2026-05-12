import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { Loader } from '../shared/components/loader/Loader';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
import SubPageLayout from '@/components/settings/SubPageLayout';
import { TokenHeader } from '@/components/token/TokenHeader';
import { TokenBody } from '@/components/token/TokenBody';
import { Button } from '@/shared/components';
import { Footer } from '@/shared/components/layout/Footer';
import { IReadWriteWallet } from '@/lib/profiles/wallet.contract';
import { WalletToken } from '@/lib/profiles/wallet-token';

const fetchToken = async (
    primaryWallet?: IReadWriteWallet,
    contractAddress?: string,
): Promise<WalletToken | undefined> => {
    if (!primaryWallet || !contractAddress) return undefined;

    const collection = await primaryWallet.client().tokenAddresses({
        addresses: [primaryWallet.address()],
        whitelist: [contractAddress],
    });

    return collection.items().find((t) => t.token().address() === contractAddress);
};

const TokenDetails = () => {
    const { t } = useTranslation();
    const primaryWallet = usePrimaryWallet();
    const { contractAddress } = useParams<{ contractAddress: string }>();

    const {
        data: token,
        refetch,
        isLoading,
    } = useQuery<WalletToken | undefined>(
        ['token-details', contractAddress],
        () => fetchToken(primaryWallet, contractAddress),
        {
            enabled: !!primaryWallet,
            staleTime: 0,
            refetchInterval: false,
        },
    );

    useEffect(() => {
        if (primaryWallet) {
            refetch();
        }
    }, [primaryWallet, refetch]);

    return (
        <SubPageLayout
            title={t('PAGES.TOKEN_DETAILS.PAGE_TITLE')}
            footer={
                <Footer>
                    <Button variant='primary' disabled>
                        {t('PAGES.TOKEN_DETAILS.SEND_TOKEN')}
                    </Button>
                </Footer>
            }
        >
            {token && !isLoading ? (
                <>
                    <TokenHeader token={token} />

                    <TokenBody token={token} />
                </>
            ) : isLoading ? (
                <div className='flex h-full w-full items-center justify-center'>
                    <Loader variant='big' />
                </div>
            ) : (
                <div className='flex h-full w-full items-center justify-center'>
                    <p className='text-sm text-theme-secondary-500 dark:text-theme-secondary-300'>
                        {t('PAGES.TOKEN_DETAILS.NOT_FOUND')}
                    </p>
                </div>
            )}
        </SubPageLayout>
    );
};

export default TokenDetails;
