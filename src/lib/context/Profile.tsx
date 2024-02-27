import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { Contracts } from '@ardenthq/sdk-profiles';
import { useEnvironmentContext } from './Environment';
import useLocaleCurrency from '../hooks/useLocalCurrency';
import { useErrorHandlerContext } from './ErrorHandler';
import * as WalletStore from '@/lib/store/wallet';
import { useAppDispatch, useAppSelector } from '../store';
import browser from 'webextension-polyfill';
import * as SessionStore from '@/lib/store/session';
import { useWalletBalance } from '../hooks/useWalletBalance';
import { ProfileData } from '../background/contracts';
import { LoadingFullScreen } from '@/shared/components/handleStates/LoadingFullScreen';
import { setLocalValue } from '../utils/localStorage';
import * as UIStore from '@/lib/store/ui';

interface Context {
  profile: Contracts.IProfile;
  initProfile: () => Promise<void>;
  importProfile: (profileData: string) => Promise<Contracts.IProfile>;
  convertedBalance?: number;
  isProfileReady: boolean;
}

interface Properties {
  children: ReactNode;
}

const ProfileContext = createContext<Context | undefined>(undefined);

export const ProfileProvider = ({ children }: Properties) => {
  const dispatch = useAppDispatch();
  const { onError } = useErrorHandlerContext();
  const { env } = useEnvironmentContext();
  const { defaultCurrency } = useLocaleCurrency();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isProfileReady, setIsProfileReady] = useState<boolean>(false);
  const [profile, setProfile] = useState<Contracts.IProfile | undefined>(undefined);

  const primaryWalletId = useAppSelector(WalletStore.selectPrimaryWalletId);

  useEffect(() => {
    void initProfile();
  }, []);

  const getPrimaryWallet = () => {
    if (isLoading || !primaryWalletId) {
      return undefined;
    }

    let primaryWallet;

    try {
      primaryWallet = profile?.wallets().findById(primaryWalletId);
    } catch (_e) {}

    return primaryWallet;
  };

  const convertedBalance = useWalletBalance(getPrimaryWallet());

  const initProfile = async () => {
    setIsProfileReady(false);

    await restoreProfile();

    setIsProfileReady(true);
    setIsLoading(false);
  };

  const restoreProfile = async () => {
    try {
      const { data, profileData } = await browser.runtime.sendMessage({
        type: 'GET_DATA',
      });

      console.log({ GET_DATA: { data } });
      if (!data) {
        // await createProfile();
        return;
      }

      const profile = await importProfile(data);
      profile.data().fill(profileData);
      console.log({ wallets: profile.wallets().values(), profileData });

      await updateStore({ profile });
    } catch (error) {
      onError(error, false);
    }
  };

  const createProfile = async (): Promise<Contracts.IProfile | undefined> => {
    try {
      env.profiles().flush();

      const profile = await env.profiles().create('arkconnect');
      await env.profiles().restore(profile);

      profile.settings().set(Contracts.ProfileSetting.ExchangeCurrency, defaultCurrency);

      setLocalValue('hasOnboarded', false);
      dispatch(UIStore.testnetEnabledChanged(false));

      setProfile(profile);
      return profile;
    } catch (error) {
      onError(error);
    }
  };

  const updateStore = async ({ profile }: { profile: Contracts.IProfile }) => {
    await updateStoreWallets({ profile });

    const sessions = profile.data().get(ProfileData.Sessions) as
      | SessionStore.SessionEntries
      | undefined;

    if (sessions) {
      await dispatch(SessionStore.sessionsLoaded(sessions));
    }
  };

  const updateStoreWallets = async ({ profile }: { profile: Contracts.IProfile }) => {
    const wallets: WalletStore.WalletEntries = profile
      .wallets()
      .values()
      .map((wallet) => ({ walletId: wallet.id() }));

    await dispatch(WalletStore.walletsLoaded(wallets));

    const primaryWalletId = profile.data().get('PRIMARY_WALLET_ID') as string;
    await dispatch(WalletStore.primaryWalletIdChanged(primaryWalletId));
  };

  const importProfile = async (profileDump: string): Promise<Contracts.IProfile> => {
    env.profiles().flush();

    const newProfile = await env.profiles().import(profileDump);
    env.profiles().push(newProfile);

    await env.profiles().restore(newProfile);
    await newProfile.sync();

    await env.wallets().syncByProfile(newProfile);

    setProfile(newProfile);

    return newProfile;
  };

  if (isLoading || !profile) return <LoadingFullScreen />;

  return (
    <ProfileContext.Provider
      value={{
        profile,
        initProfile,
        importProfile,
        convertedBalance,
        isProfileReady,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

/**
 * If you needs to react to changes in the environment state
 * use the `state` field that will be updated whenever env.persist() is called:
 *
 * const context = useProfileContext();
 */

export const useProfileContext = (): Context => {
  const value = useContext(ProfileContext);
  if (value === undefined) {
    throw new Error('[useProfile] Component not wrapped within a Provider');
  }
  return value;
};
