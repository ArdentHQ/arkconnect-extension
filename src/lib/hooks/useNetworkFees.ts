import { BigNumber } from '@ardenthq/sdk-helpers';
import { useQuery } from 'react-query';
import { IReadWriteWallet } from '@ardenthq/sdk-profiles/distribution/esm/wallet.contract';
import { useExchangeRate } from './useExchangeRate';
import constants from '@/constants';
import { WalletNetwork } from '@/lib/store/wallet';

type FormattedFee = {
    fiat: number;
    crypto: string;
};

export interface NetworkFee {
    isLoading: boolean;
    fees?: {
        min: FormattedFee;
        avg: FormattedFee;
        max: FormattedFee;
    };
}

type Fees = {
    avg: string;
    max: string;
    min: string;
};

interface DynamicFeesApiResponse {
    data: {
        '1': {
            transfer: Fees;
            vote: Fees;
        };
    };
}
interface StaticFeesApiResponse {
    data: {
        '1': {
            transfer: string;
            vote: string;
        };
    };
}

const formatFee = (fee: string, convert: (value?: number | undefined) => number) => {
    const cryptoAmount = BigNumber.make(fee).times(0.000_000_01);

    return {
        fiat: convert(cryptoAmount.toNumber()),
        crypto: Number.parseFloat(cryptoAmount.decimalPlaces(4).toFixed(4)).toString(),
    };
};

export const useNetworkFees = ({
    network,
    primaryWallet,
}: {
    network: WalletNetwork;
    primaryWallet?: IReadWriteWallet;
}): NetworkFee => {
    const dynamicFeeNetworkUrls = {
        [WalletNetwork.DEVNET]: constants.ARK_DYNAMIC_DEVNET_FEES_URL,
        [WalletNetwork.MAINNET]: constants.ARK_DYNAMIC_MAINNET_FEES_URL,
    };

    const staticFeeNetworksUrls = {
        [WalletNetwork.DEVNET]: constants.ARK_STATIC_DEVNET_FEE_URL,
        [WalletNetwork.MAINNET]: constants.ARK_STATIC_MAINNET_FEE_URL,
    };

    const { data: dynamicFeesData } = useQuery({
        queryKey: ['dynamic-network-fees', network],
        staleTime: 0,
        refetchInterval: 3 * 60 * 1000,
        queryFn: async () => {
            const jsonResponse = await fetch(dynamicFeeNetworkUrls[network]);
            return (await jsonResponse.json()) as DynamicFeesApiResponse;
        },
    });

    const { data: staticFeesData } = useQuery({
        queryKey: ['static-network-fees', network],
        staleTime: 0,
        refetchInterval: 3 * 60 * 1000,
        queryFn: async () => {
            const jsonResponse = await fetch(staticFeeNetworksUrls[network]);
            return (await jsonResponse.json()) as StaticFeesApiResponse;
        },
    });

    const { convert } = useExchangeRate({
        exchangeTicker: primaryWallet?.exchangeCurrency(),
        ticker: primaryWallet?.currency(),
    });

    if (dynamicFeesData && staticFeesData) {
        const dynamicFees = dynamicFeesData.data['1'].transfer;
        const staticFee = staticFeesData.data['1'].transfer;

        const avgFee =
            BigNumber.make(dynamicFees.avg).comparedTo(staticFee) > 0 ? staticFee : dynamicFees.avg;

        return {
            isLoading: false,
            fees: {
                min: formatFee(dynamicFees.min, convert),
                avg: formatFee(avgFee, convert),
                max: formatFee(staticFee, convert),
            },
        };
    }

    return {
        isLoading: true,
        fees: undefined,
    };
};
