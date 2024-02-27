import { AutoLockTimer, setLocalValue } from './lib/utils/localStorage';
import { createTestProfile, isDev } from './dev/utils/dev';

import { BACKGROUND_EVENT_LISTENERS_HANDLERS } from './lib/background/eventListenerHandlers';
import { Contracts } from '@ardenthq/sdk-profiles';
import { ExtensionEvents } from './lib/events';
import { ExtensionProfile } from './lib/background/extension.profile';
import { LockHandler } from '@/lib/background/handleAutoLock';
import { ProfileData } from './lib/background/contracts';
import { SendTransferInput } from './lib/background/extension.wallet';
import { Services } from '@ardenthq/sdk';
import browser from 'webextension-polyfill';
import { importWallets } from './background.helpers';
import initAutoLock from './lib/background/initAutoLock';
import { initializeEnvironment } from './lib/utils/env.background';
import keepServiceWorkerAlive from './lib/background/keepServiceWorkerAlive';
import useSentryException from './lib/hooks/useSentryException';

let PROFILE: Contracts.IProfile | null = null;

const lockHandler = new LockHandler();

const bootEnvironment = async () => {
  try {
    await ENVIRONMENT.verify();
    await ENVIRONMENT.boot();
  } catch (error: any) {
    useSentryException(new Error('Failed to boot environment'));
  }
};

const updateProfile = async (
  profileDump: Record<string, any>,
  password: string,
): Promise<Contracts.IProfile | null> => {
  ENVIRONMENT.profiles().flush();
  ENVIRONMENT.profiles().fill(profileDump);
  const existingData = PROFILE?.data().all();

  await bootEnvironment();

  try {
    const profile = ENVIRONMENT.profiles().first();
    await ENVIRONMENT.profiles().restore(profile, password);

    if (existingData) {
      profile.data().fill(existingData);
    }

    await ENVIRONMENT.persist();

    PROFILE = profile;

    return PROFILE;
  } catch (error: any) {
    useSentryException(new Error('Failed to update profile'));
  }

  return null;
};

// @TODO: Cleanup/interface handlers & reduce cognitive complexity.
const initRuntimeEventListener = () => {
  browser.runtime.onMessage.addListener(async function (request) {
    const type = request.type as keyof typeof BACKGROUND_EVENT_LISTENERS_HANDLERS;
    const extensionProfile = ExtensionProfile({ profile: PROFILE, env: ENVIRONMENT, lockHandler });

    if (request.type === 'SEND_VOTE') {
      try {
        extensionProfile.assertLockedStatus();
        extensionProfile.assertPrimaryWallet();

        return await extensionProfile
          .primaryWallet()
          .wallet()
          .sendVote(request.data as Services.VoteInput);
      } catch (error) {
        return {
          error: 'FAILED_TO_BROADCAST',
          errorStack: error,
        };
      }
    }

    if (request.type === 'SEND_TRANSACTION') {
      extensionProfile.assertLockedStatus();
      extensionProfile.assertPrimaryWallet();

      try {
        return await extensionProfile
          .primaryWallet()
          .wallet()
          .sendTransfer(request.data as SendTransferInput);
      } catch (error) {
        return {
          error: 'FAILED_TO_BROADCAST',
          errorStack: error,
        };
      }
    }

    if (request.type === 'SIGN_MESSAGE') {
      extensionProfile.assertLockedStatus();
      extensionProfile.assertPrimaryWallet();

      try {
        return extensionProfile.primaryWallet().wallet().signMessage(request.data.message);
      } catch (error) {
        return { error: 'FAILED_TO_SIGN', errorStack: error };
      }
    }

    if (request.type === 'GET_DATA') {
      if (!PROFILE) {
        return { error: 'MISSING_PROFILE' };
      }

      if (extensionProfile.isLocked()) {
        return { error: 'LOCKED' };
      }

      try {
        return extensionProfile.exportAsReadOnly();
      } catch (error) {
        return {
          error: 'FAILED_TO_EXPORT_PROFILE',
          errorStack: error,
        };
      }
    }

    if (request.type === 'IMPORT_WALLETS') {
      // If profile doesn't exist, it means that it's an initial import.
      // In that case, password should be provided to instantiate the new profile.
      try {
        if (!PROFILE) {
          PROFILE = await extensionProfile.reset(request.data.password, request.data);
        }

        await importWallets({ profile: PROFILE, wallets: request.data.wallets });
        await ENVIRONMENT.persist();

        return { error: undefined };
      } catch (error) {
        return {
          error: 'FAILED_TO_IMPORT_WALLETS',
          errorStack: error,
        };
      }
    }

    if (request.type === 'SET_DATA') {
      if (!request.data.profileDump) {
        return {
          error: 'PROFILE_DATA_MISSING',
        };
      }

      if (!PROFILE) {
        return {
          error: 'PROFILE_MISSING',
        };
      }

      if (extensionProfile.isLocked()) {
        return {
          error: 'LOCKED',
        };
      }

      const password = PROFILE.password().get();

      const dump = Object.values(request.data.profileDump)[0] as Record<string, string>;

      const requestedProfile = await ENVIRONMENT.profiles().import(dump.data);
      await ENVIRONMENT.profiles().restore(requestedProfile);

      requestedProfile.auth().setPassword(password);
      requestedProfile.password().set(password);

      const encryptedExport = await ENVIRONMENT.profiles().export(requestedProfile);

      const updatedProfile = await updateProfile(
        {
          [requestedProfile.id()]: {
            ...ENVIRONMENT.profiles().dump(requestedProfile),
            data: encryptedExport,
            id: requestedProfile.id(),
          },
        },
        password,
      );

      if (!updatedProfile) {
        return {
          error: 'PROFILE_MISSING',
        };
      }

      return {
        profileDump: ENVIRONMENT.profiles().dump(PROFILE),
        error: null,
      };
    } else if (request.type === 'SET_PRIMARY_WALLET') {
      extensionProfile.primaryWallet().set(request.data.primaryWalletId);
      await ENVIRONMENT.persist();
    } else if (request.type === 'SET_SESSIONS') {
      if (!PROFILE) {
        return;
      }

      PROFILE.data().set(ProfileData.Sessions, request.data.sessions);
      await ENVIRONMENT.persist();
    } else if (request.type === 'AUTOLOCK_TIMER_CHANGED') {
      await lockHandler.setLastActiveTime(true);
      return;
    } else if (request.type === 'REGISTERED_ACTIVITY') {
      await lockHandler.setLastActiveTime();
      return;
    } else if (request.type === 'LOCK') {
      lockHandler.lock();
      return;
    } else if (request.type === 'CHECK_LOCK') {
      return Promise.resolve({ isLocked: lockHandler.isLocked() });
    } else if (request.type === 'CHANGE_PASSWORD') {
      try {
        if (!PROFILE) {
          return {
            error: 'LOCKED',
          };
        }

        if (PROFILE.password().get() !== request.data.oldPassword) {
          return {
            error: 'INVALID_PASSWORD',
          };
        }

        PROFILE?.auth().changePassword(request.data.oldPassword, request.data.newPassword);

        for (const wallet of PROFILE.wallets().values()) {
          let newWallet;
          const oldWalletId = wallet.id();

          // Only non-ledgers have mnemonics
          if (!wallet.isLedger()) {
            const mnemonic = await wallet.confirmKey().get(request.data.oldPassword);

            newWallet = await PROFILE.walletFactory().fromMnemonicWithBIP39({
              coin: wallet.network().coin(),
              network: wallet.network().id(),
              mnemonic,
            });

            newWallet.mutator().alias(wallet.alias() as string);
            await newWallet.confirmKey().set(mnemonic, PROFILE.password().get());
          } else {
            newWallet = await PROFILE.walletFactory().fromAddressWithDerivationPath({
              address: wallet.address(),
              network: wallet.network().id(),
              coin: wallet.coinId(),
              path: wallet.data().get(Contracts.WalletData.DerivationPath)!,
            });

            newWallet.mutator().alias(wallet.alias() as string);
          }

          // Update primary wallet ID to match the new id of the same wallet
          console.log(PROFILE.data().get(ProfileData.PrimaryWalletId), oldWalletId, newWallet.id());
          if (PROFILE.data().get(ProfileData.PrimaryWalletId) === oldWalletId) {
            PROFILE.data().set(ProfileData.PrimaryWalletId, newWallet.id());
          }

          PROFILE.wallets().forget(oldWalletId);
          PROFILE.wallets().push(newWallet);
        }

        await ENVIRONMENT.persist();

        return Promise.resolve({
          id: PROFILE.data().get(ProfileData.PrimaryWalletId),
          error: undefined,
        });
      } catch (error) {
        return Promise.resolve({ error });
      }
    } else if (request.type === 'RESET') {
      if (!PROFILE) {
        return;
      }

      ENVIRONMENT.profiles().flush();

      PROFILE = null;
      await ENVIRONMENT.persist();

      // reset lock handler
      lockHandler.reset();
      return;
    } else if (request.type === 'REMOVE_WALLETS') {
      if (PROFILE?.password().get() !== request.data.password) {
        return {
          error: 'Invalid password.',
        };
      }

      const walletIds = request.data.walletIds ?? [];
      for (const id of walletIds) {
        const wallet = PROFILE?.wallets().has(id) ? PROFILE?.wallets().findById(id) : undefined;

        if (wallet) {
          PROFILE?.wallets().forget(id);
        }
      }

      if (PROFILE?.wallets().count() === 0) {
        ENVIRONMENT.profiles().flush();
        PROFILE = null;
        await ENVIRONMENT.persist();

        return {
          error: undefined,
        };
      }

      if (
        PROFILE?.data().has(ProfileData.PrimaryWalletId) &&
        !PROFILE?.wallets().has(PROFILE?.data().get(ProfileData.PrimaryWalletId) as string)
      ) {
        PROFILE?.data().set(ProfileData.PrimaryWalletId, PROFILE?.wallets().first().id());
      }

      await ENVIRONMENT.persist();

      return {
        error: undefined,
      };
    } else if (request.type === 'VALIDATE_PASSWORD') {
      return Promise.resolve({
        isValid: PROFILE?.password().get() === request.data.password,
      });
    } else if (request.type === 'UNLOCK') {
      const isLocked = await lockHandler.unlock(PROFILE, request.data.password);
      return Promise.resolve({ isLocked });
    }
    // We don't return early in cases with `_RESOLVE` as they
    // send a browser message in addition
    else if (request.type === 'DISCONNECT_RESOLVE') {
      ExtensionEvents({ profile: PROFILE }).disconnect(request.data.domain);
    } else if (request.type === 'CONNECT_RESOLVE') {
      ExtensionEvents({ profile: PROFILE }).connect(request.data.domain);
    }

    if (!BACKGROUND_EVENT_LISTENERS_HANDLERS[type]) {
      return;
    }

    if (request.data.tabId && (type.endsWith('_RESOLVE') || type.endsWith('_REJECT'))) {
      browser.tabs.sendMessage(request.data.tabId, request);
      return;
    }
  });
};

const setupEventListeners = async (message: any, port: browser.Runtime.Port) => {
  const type = message.type as keyof typeof BACKGROUND_EVENT_LISTENERS_HANDLERS;

  if (!BACKGROUND_EVENT_LISTENERS_HANDLERS[type]) {
    return;
  }

  BACKGROUND_EVENT_LISTENERS_HANDLERS[type].callback(
    {
      ...message,
      data: {
        ...message.data,
        tabId: port.sender?.tab?.id,
        port: port,
      },
    },
    PROFILE,
  );
};

const setupProfileWithFixtures = async () => {
  if (isDev()) {
    PROFILE = await createTestProfile({ env: ENVIRONMENT });
    PROFILE.data().set(ProfileData.PrimaryWalletId, PROFILE.wallets().first().id());

    await ENVIRONMENT.persist();
  }
};

/**
 * Ensure that the Environment object will not be recreated when the state changes,
 * as the data is stored in memory by the `DataRepository`.
 */
export const ENVIRONMENT = initializeEnvironment();

browser.runtime.onInstalled.addListener(async () => {
  await setLocalValue('autoLockTimer', AutoLockTimer.TWENTY_FOUR_HOURS);
});

initAutoLock(lockHandler);
initRuntimeEventListener();
keepServiceWorkerAlive();
setupProfileWithFixtures();

browser.runtime.onConnect.addListener((port) => {
  if (port.name === 'ark-content-script') {
    port.onMessage.addListener(setupEventListeners);
  }
});
