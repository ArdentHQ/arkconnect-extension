import { useProfileContext } from '@/lib/context/Profile';
import { useAppSelector } from '@/lib/store';
import * as WalletStore from '@/lib/store/wallet';

export const usePrimaryWallet = () => {
  const { profile } = useProfileContext();

  const primaryWalletId = useAppSelector(WalletStore.selectPrimaryWalletId);

  return primaryWalletId && profile.wallets().has(primaryWalletId)
    ? profile.wallets().findById(primaryWalletId)
    : undefined;
};
