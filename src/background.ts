import browser from 'webextension-polyfill';
import { Contracts } from '@ardenthq/sdk-profiles';
import { BACKGROUND_EVENT_LISTENERS_HANDLERS } from './lib/background/eventListenerHandlers';
import { initializeEnvironment } from './lib/utils/env.background';
import { AutoLockTimer, setLocalValue } from './lib/utils/localStorage';
import initAutoLock from './lib/background/initAutoLock';
import useSentryException from './lib/hooks/useSentryException';
import keepServiceWorkerAlive from './lib/background/keepServiceWorkerAlive';
import { LockHandler } from '@/lib/background/handleAutoLock';
import { ExtensionEvents } from './lib/events';
import { importWallets } from './background.helpers';
import { createTestProfile, isDev } from './dev/utils/dev';
import { ProfileData } from './lib/background/contracts';
import { Services } from '@ardenthq/sdk';
import { SendTransferInput } from './lib/background/extension.wallet';
import { ExtensionProfile } from './lib/background/extension.profile';

/**
 * Ensure that the Environment object will not be recreated when the state changes,
 * as the data is stored in memory by the `DataRepository`.
 */
export const ENVIRONMENT = initializeEnvironment();

const lockHandler = new LockHandler();

const activeProfile = ExtensionProfile({ env: ENVIRONMENT, lockHandler });

const initialPassword = '123456';
// Setup initial profile. @TODO: create random passsword.
activeProfile.reset(initialPassword);

// @TODO: Cleanup/interface handlers & reduce cognitive complexity.
const initRuntimeEventListener = () => {
  browser.runtime.onMessage.addListener(async function (request) {
    const type = request.type as keyof typeof BACKGROUND_EVENT_LISTENERS_HANDLERS;

    if (request.type === 'SEND_VOTE') {
      try {
        activeProfile.assertLockedStatus();
        activeProfile.assertPrimaryWallet();

        return await activeProfile
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
      activeProfile.assertLockedStatus();
      activeProfile.assertPrimaryWallet();

      try {
        return await activeProfile
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
      activeProfile.assertLockedStatus();
      activeProfile.assertPrimaryWallet();

      try {
        return activeProfile.primaryWallet().wallet().signMessage(request.data.message);
      } catch (error) {
        return { error: 'FAILED_TO_SIGN', errorStack: error };
      }
    }

    if (request.type === 'GET_DATA') {
      if (activeProfile.isLocked()) {
        return { error: 'LOCKED' };
      }

      try {
        return activeProfile.exportAsReadOnly();
      } catch (error) {
        return {
          error: 'FAILED_TO_EXPORT_PROFILE',
          errorStack: error,
        };
      }
    }

    if (request.type === 'IMPORT_WALLETS') {
      try {
        if (!!request.data.password) {
          await activeProfile.reset(request.data.password, request.data);
        }

        await importWallets({ profile: activeProfile.profile(), wallets: request.data.wallets });
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

      if (activeProfile.isLocked()) {
        return {
          error: 'LOCKED',
        };
      }

      const password = activeProfile.profile().password().get();
      const data = activeProfile.profile().data().all();

      const dump = Object.values(request.data.profileDump)[0] as Record<string, string>;

      const requestedProfile = await ENVIRONMENT.profiles().import(dump.data);
      await ENVIRONMENT.profiles().restore(requestedProfile);

      requestedProfile.auth().setPassword(password);

      const encryptedExport = await ENVIRONMENT.profiles().export(requestedProfile);

      await activeProfile.resetFromDump(
        {
          [requestedProfile.id()]: {
            ...ENVIRONMENT.profiles().dump(requestedProfile),
            data: encryptedExport,
            id: requestedProfile.id(),
          },
        },
        password,
        data,
      );

      return {
        profileDump: ENVIRONMENT.profiles().dump(activeProfile.profile()),
        error: null,
      };
    } else if (request.type === 'SET_PRIMARY_WALLET') {
      activeProfile.primaryWallet().set(request.data.primaryWalletId);
      await ENVIRONMENT.persist();
    } else if (request.type === 'SET_SESSIONS') {
      activeProfile.profile().data().set(ProfileData.Sessions, request.data.sessions);
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
        if (activeProfile.isLocked()) {
          return {
            error: 'LOCKED',
          };
        }

        if (activeProfile.profile().password().get() !== request.data.oldPassword) {
          return {
            error: 'INVALID_PASSWORD',
          };
        }

        activeProfile
          .profile()
          .auth()
          .changePassword(request.data.oldPassword, request.data.newPassword);

        for (const wallet of activeProfile.profile().wallets().values()) {
          const mnemonic = await wallet.confirmKey().get(request.data.oldPassword);

          const newWallet = await activeProfile.profile().walletFactory().fromMnemonicWithBIP39({
            coin: wallet.network().coin(),
            network: wallet.network().id(),
            mnemonic,
          });

          newWallet.mutator().alias(wallet.alias() as string);
          await newWallet.confirmKey().set(mnemonic, activeProfile.profile().password().get());

          const id = wallet.id();

          if (activeProfile.profile().data().get(ProfileData.PrimaryWalletId) === id) {
            activeProfile.profile().data().set(ProfileData.PrimaryWalletId, newWallet.id());
          }

          activeProfile.profile().wallets().forget(id);
          activeProfile.profile().wallets().push(newWallet);
        }

        await ENVIRONMENT.persist();

        return Promise.resolve({ error: undefined });
      } catch (error) {
        return Promise.resolve({ error });
      }
    } else if (request.type === 'RESET') {
      activeProfile.reset(initialPassword);
    } else if (request.type === 'REMOVE_WALLETS') {
      if (activeProfile.profile()?.password().get() !== request.data.password) {
        return {
          error: 'Invalid password.',
        };
      }

      const walletIds = request.data.walletIds ?? [];
      for (const id of walletIds) {
        const wallet = activeProfile.profile()?.wallets().has(id)
          ? activeProfile.profile().wallets().findById(id)
          : undefined;

        if (wallet) {
          activeProfile.profile().wallets().forget(id);
        }
      }

      if (activeProfile.profile().wallets().count() === 0) {
        ENVIRONMENT.profiles().flush();
        await ENVIRONMENT.persist();

        return {
          error: undefined,
        };
      }

      if (
        activeProfile.profile()?.data().has(ProfileData.PrimaryWalletId) &&
        !activeProfile
          .profile()
          ?.wallets()
          .has(activeProfile.profile()?.data().get(ProfileData.PrimaryWalletId) as string)
      ) {
        activeProfile
          .profile()
          ?.data()
          .set(ProfileData.PrimaryWalletId, activeProfile.profile()?.wallets().first().id());
      }

      await ENVIRONMENT.persist();

      return {
        error: undefined,
      };
    } else if (request.type === 'VALIDATE_PASSWORD') {
      return Promise.resolve({
        isValid: activeProfile.profile()?.password().get() === request.data.password,
      });
    } else if (request.type === 'UNLOCK') {
      const isLocked = await lockHandler.unlock(activeProfile.profile(), request.data.password);
      return Promise.resolve({ isLocked });
    }
    // We don't return early in cases with `_RESOLVE` as they
    // send a browser message in addition
    else if (request.type === 'DISCONNECT_RESOLVE') {
      ExtensionEvents({ profile: activeProfile.profile() }).disconnect(request.data.domain);
    } else if (request.type === 'CONNECT_RESOLVE') {
      ExtensionEvents({ profile: activeProfile.profile() }).connect(request.data.domain);
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
    activeProfile.profile(),
  );
};

const setupProfileWithFixtures = async () => {
  if (isDev()) {
    await createTestProfile({ env: ENVIRONMENT });
    activeProfile
      .profile()
      .data()
      .set(ProfileData.PrimaryWalletId, activeProfile.profile().wallets().first().id());

    await ENVIRONMENT.persist();
  }
};

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
