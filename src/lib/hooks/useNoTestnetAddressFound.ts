import * as WalletStore from '@/lib/store/wallet';
import { useAppSelector } from '../store';
import { useProfileContext } from '../context/Profile';

const useCountTestnetAddresses = () => {
  const { profile } = useProfileContext();

  const walletsIds = useAppSelector(WalletStore.selectWalletsIds);

  return walletsIds.filter((walletId) => profile.wallets().findById(walletId)?.network().isTest())
    .length;
};

export default useCountTestnetAddresses;
