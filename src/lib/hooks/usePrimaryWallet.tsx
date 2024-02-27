import { useProfileContext } from '@/lib/context/Profile';
import { useAppSelector } from '@/lib/store';
import { selectPrimaryWalletId } from '@/lib/store/wallet';

export const usePrimaryWallet = () => {
  const { profile } = useProfileContext();

  const primaryWalletId = useAppSelector(selectPrimaryWalletId);

  return primaryWalletId && profile.wallets().has(primaryWalletId)
    ? profile.wallets().findById(primaryWalletId)
    : undefined;
};
