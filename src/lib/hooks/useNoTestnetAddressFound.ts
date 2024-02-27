import { useAppSelector } from '../store';
import { useProfileContext } from '../context/Profile';
import { selectWalletsIds } from '@/lib/store/wallet';

const useCountTestnetAddresses = () => {
    const { profile } = useProfileContext();

    const walletsIds = useAppSelector(selectWalletsIds);

    return walletsIds.filter((walletId) => profile.wallets().findById(walletId)?.network().isTest())
        .length;
};

export default useCountTestnetAddresses;
