import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Contracts } from '@ardenthq/sdk-profiles';
import { runtime } from 'webextension-polyfill';
import { useNavigate } from 'react-router-dom';
import { useEnvironmentContext } from './Environment';
import { useErrorHandlerContext } from './ErrorHandler';
import { useWalletBalance } from '@/lib/hooks/useWalletBalance';
import { ProfileData } from '@/lib/background/contracts';
import { useAppDispatch } from '@/lib/store';
import * as WalletStore from '@/lib/store/wallet';
import * as SessionStore from '@/lib/store/session';
import { LoadingFullScreen } from '@/shared/components/handleStates/LoadingFullScreen';

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
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { onError } = useErrorHandlerContext();
    const { env } = useEnvironmentContext();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isProfileReady, setIsProfileReady] = useState<boolean>(false);
    const [profile, setProfile] = useState<Contracts.IProfile | undefined>(undefined);

    useEffect(() => {
        void initProfile();
    }, []);

    const getPrimaryWallet = (profile?: Contracts.IProfile) => {
        return profile
            ?.wallets()
            .values()
            .find((wallet) => wallet.isPrimary());
    };

    const convertedBalance = useWalletBalance(getPrimaryWallet(profile));

    const initProfile = async () => {
        setIsProfileReady(false);

        await restoreProfile();

        setIsProfileReady(true);
        setIsLoading(false);
    };

    const restoreProfile = async () => {
        try {
            const { data, envData } = await runtime.sendMessage({
                type: 'GET_DATA',
            });

            if (!data) {
                onError('Failed to initialize profile', false);
                return;
            }

            if (envData) {
                env.data().fill(envData);
            }

            const profile = await importProfile(data);

            await updateStore({ profile });
        } catch (error) {
            onError(error, false);
        }
    };

    const updateStore = async ({ profile }: { profile: Contracts.IProfile }) => {
        await updateStoreWallets({ profile });

        const sessions = profile.settings().get(ProfileData.Sessions) as
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

        // Background primary wallet is not set. Reset to first & persist.
        if (!getPrimaryWallet(profile) && profile.wallets().count() > 0) {
            profile.wallets().first().data().set(Contracts.WalletData.IsPrimary, true);
            await env.persist();
        }

        const primaryWallet = getPrimaryWallet(profile);

        if (primaryWallet) {
            await dispatch(WalletStore.primaryWalletIdChanged(primaryWallet.id()));
            return;
        }
    };

    const importProfile = async (profileDump: string): Promise<Contracts.IProfile> => {
        navigate('/');
        env.profiles().flush();

        const newProfile = await env.profiles().import(profileDump);
        env.profiles().push(newProfile);

        await env.profiles().restore(newProfile);
        await newProfile.sync();

        await env.wallets().syncByProfile(newProfile);
        await env.exchangeRates().syncAll(newProfile, 'ARK');

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
