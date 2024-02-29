import browser from 'webextension-polyfill';
import { Services } from '@ardenthq/sdk';
import { Contracts } from '@ardenthq/sdk-profiles';
import { UUID } from '@ardenthq/sdk-cryptography';
import { BACKGROUND_EVENT_LISTENERS_HANDLERS } from './lib/background/eventListenerHandlers';
import { AutoLockTimer, setLocalValue } from './lib/utils/localStorage';
import initAutoLock from './lib/background/initAutoLock';
import keepServiceWorkerAlive from './lib/background/keepServiceWorkerAlive';
import { ExtensionEvents } from './lib/events';
import { importWallets } from './background.helpers';
import { createTestProfile, isDev } from './dev/utils/dev';
import { ProfileData, ScreenName } from './lib/background/contracts';
import { Services } from '@ardenthq/sdk';
import { SendTransferInput } from './lib/background/extension.wallet';
import { Extension } from './lib/background/extension';
import { SessionEntries } from './lib/store/session';

const initialPassword = UUID.random();

const extension = Extension();
extension.reset(initialPassword);

// @TODO: Cleanup/interface handlers & reduce cognitive complexity.
const initRuntimeEventListener = () => {
    browser.runtime.onMessage.addListener(async function (request) {
        const type = request.type as keyof typeof BACKGROUND_EVENT_LISTENERS_HANDLERS;

        if (request.type === 'SEND_VOTE') {
            try {
                extension.assertLockedStatus();
                extension.assertPrimaryWallet();

                return await extension
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
            extension.assertLockedStatus();
            extension.assertPrimaryWallet();

            try {
                return await extension
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
            extension.assertLockedStatus();
            extension.assertPrimaryWallet();

            try {
                return extension.primaryWallet().wallet().signMessage(request.data.message);
            } catch (error) {
                return { error: 'FAILED_TO_SIGN', errorStack: error };
            }
        }

        if (request.type === 'GET_DATA') {
            try {
                return extension.exportAsReadOnly();
            } catch (error) {
                return {
                    error: 'FAILED_TO_EXPORT_PROFILE',
                    errorStack: error,
                };
            }
        }

        if (request.type === 'IMPORT_WALLETS') {
            try {
                if (request.data.password) {
                    await extension.reset(request.data.password, request.data);
                }

                await importWallets({
                    profile: extension.profile(),
                    wallets: request.data.wallets,
                });
                await extension.persist();

                return { error: undefined };
            } catch (error) {
                return {
                    error: 'FAILED_TO_IMPORT_WALLETS',
                    errorStack: error,
                };
            }
        }

        if (request.type === 'PERSIST') {
            if (!request.data.profileDump) {
                return {
                    error: 'PROFILE_DATA_MISSING',
                };
            }

            if (extension.isLocked()) {
                return {
                    error: 'LOCKED',
                };
            }

            const password = extension.profile().password().get();
            const data = extension.profile().data().all();
            console.log({ data });

            const dump = Object.values(request.data.profileDump)[0] as Record<string, string>;

            const requestedProfile = await extension.env().profiles().import(dump.data);
            await extension.env().profiles().restore(requestedProfile);
            console.log({ requestedData: requestedProfile.data().all() });

            requestedProfile.auth().setPassword(password);

            const encryptedExport = await extension.env().profiles().export(requestedProfile);

            await extension.resetFromDump(
                {
                    [requestedProfile.id()]: {
                        ...extension.env().profiles().dump(requestedProfile),
                        data: encryptedExport,
                        id: requestedProfile.id(),
                    },
                },
                password,
                data,
            );

            return {
                profileDump: extension.env().profiles().dump(extension.profile()),
                error: null,
            };
        }

        if (request.type === 'GET_LAST_SCREEN') {
            return extension.profile().data().get(ProfileData.LastScreen);
        }

        if (request.type === 'SET_LAST_SCREEN') {
            extension.profile().data().set(ProfileData.LastScreen, {
                screenName: request.screenName,
                data: request.data,
            });

            await extension.persist();
            return;
        }

        if (request.type === 'CLEAR_LAST_SCREEN') {
            extension.profile().data().set(ProfileData.LastScreen, undefined);
            await extension.persist();
            return;
        }

        if (request.type === 'SET_PRIMARY_WALLET') {
            extension.primaryWallet().set(request.data.primaryWalletId);
            await extension.env().persist();
        } else if (request.type === 'SET_SESSIONS') {
            extension.profile().data().set(ProfileData.Sessions, request.data.sessions);
            await extension.env().persist();
        } else if (request.type === 'AUTOLOCK_TIMER_CHANGED') {
            await extension.lockHandler().setLastActiveTime(true);
            return;
        } else if (request.type === 'REGISTERED_ACTIVITY') {
            await extension.lockHandler().setLastActiveTime();
            return;
        } else if (request.type === 'LOCK') {
            extension.lockHandler().lock();
            return;
        } else if (request.type === 'CHECK_LOCK') {
            return Promise.resolve({ isLocked: extension.lockHandler().isLocked() });
        } else if (request.type === 'CHANGE_PASSWORD') {
            try {
                if (extension.isLocked()) {
                    return {
                        error: 'LOCKED',
                    };
                }

                if (extension.profile().password().get() !== request.data.oldPassword) {
                    return {
                        error: 'INVALID_PASSWORD',
                    };
                }

                extension
                    .profile()
                    .auth()
                    .changePassword(request.data.oldPassword, request.data.newPassword);

                for (const wallet of extension.profile().wallets().values()) {
                    let newWallet;
                    const oldWalletId = wallet.id();

                    // Only non-ledgers have mnemonics
                    if (!wallet.isLedger()) {
                        const mnemonic = await wallet.confirmKey().get(request.data.oldPassword);

                        newWallet = await extension
                            .profile()
                            .walletFactory()
                            .fromMnemonicWithBIP39({
                                coin: wallet.network().coin(),
                                network: wallet.network().id(),
                                mnemonic,
                            });

                        newWallet.mutator().alias(wallet.alias() as string);
                        await newWallet
                            .confirmKey()
                            .set(mnemonic, extension.profile().password().get());
                    } else {
                        newWallet = await extension
                            .profile()
                            .walletFactory()
                            .fromAddressWithDerivationPath({
                                address: wallet.address(),
                                network: wallet.network().id(),
                                coin: wallet.coinId(),
                                path: wallet.data().get(Contracts.WalletData.DerivationPath)!,
                            });

                        newWallet.mutator().alias(wallet.alias() as string);
                    }

                    // Update primary wallet ID to match the new id of the same wallet
                    if (
                        extension.profile().data().get(ProfileData.PrimaryWalletId) === oldWalletId
                    ) {
                        extension.profile().data().set(ProfileData.PrimaryWalletId, newWallet.id());
                    }

                    const sessions = extension
                        .profile()
                        .data()
                        .get<SessionEntries>(ProfileData.Sessions);

                    if (sessions) {
                        // Adjust sessions' walletId to match new ones
                        for (const [sessionId, session] of Object.entries(sessions)) {
                            if (session.walletId === oldWalletId) {
                                session.walletId = newWallet.id();
                                sessions[sessionId] = session;
                            }
                        }
                    }

                    // Store updated sessions
                    extension.profile().data().set(ProfileData.Sessions, sessions);

                    extension.profile().wallets().forget(oldWalletId);
                    extension.profile().wallets().push(newWallet);
                }

                await extension.persist();

                return Promise.resolve({ error: undefined });
            } catch (error) {
                return Promise.resolve({ error });
            }
        } else if (request.type === 'RESET') {
            setLocalValue('hasOnboarded', false);

            extension.reset(initialPassword);
        } else if (request.type === 'REMOVE_WALLETS') {
            if (extension.profile()?.password().get() !== request.data.password) {
                return {
                    error: 'Invalid password.',
                };
            }

            const walletIds = request.data.walletIds ?? [];
            for (const id of walletIds) {
                const wallet = extension.profile()?.wallets().has(id)
                    ? extension.profile().wallets().findById(id)
                    : undefined;

                if (wallet) {
                    extension.profile().wallets().forget(id);
                }
            }

            await extension.persist();

            if (extension.profile().wallets().count() === 0) {
                setLocalValue('hasOnboarded', false);
                return {
                    error: undefined,
                };
            }

            if (!extension.primaryWallet().exists()) {
                extension.primaryWallet().set(extension.profile().wallets().first().id());
            }

            await extension.persist();

            return {
                error: undefined,
            };
        } else if (request.type === 'VALIDATE_PASSWORD') {
            return Promise.resolve({
                isValid: extension.profile()?.password().get() === request.data.password,
            });
        } else if (request.type === 'UNLOCK') {
            const isLocked = await extension
                .lockHandler()
                .unlock(extension.profile(), request.data.password);

            return Promise.resolve({ isLocked });
        }
        // We don't return early in cases with `_RESOLVE` as they
        // send a browser message in addition
        else if (request.type === 'DISCONNECT_RESOLVE') {
            ExtensionEvents({ profile: extension.profile() }).disconnect(request.data.domain);
        } else if (request.type === 'CONNECT_RESOLVE') {
            ExtensionEvents({ profile: extension.profile() }).connect(request.data.domain);
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
        extension.profile(),
    );
};

const setupProfileWithFixtures = async () => {
    if (isDev()) {
        await createTestProfile({ env: extension.env() });
        extension
            .profile()
            .data()
            .set(ProfileData.PrimaryWalletId, extension.profile().wallets().first().id());

        await extension.persist();
    }
};

browser.runtime.onInstalled.addListener(async () => {
    await setLocalValue('autoLockTimer', AutoLockTimer.TWENTY_FOUR_HOURS);
});

initAutoLock(extension.lockHandler());
initRuntimeEventListener();
keepServiceWorkerAlive();
setupProfileWithFixtures();

browser.runtime.onConnect.addListener((port) => {
    if (port.name === 'ark-content-script') {
        port.onMessage.addListener(setupEventListeners);
    }
});
