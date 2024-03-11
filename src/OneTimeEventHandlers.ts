import { Contracts } from '@ardenthq/sdk-profiles';
import { Services } from '@ardenthq/sdk';
import { UUID } from '@ardenthq/sdk-cryptography';
import { Extension } from '@/lib/background/extension';
import { ExtensionEvents } from '@/lib/events';
import { importWallets } from '@/background.helpers';
import { ProfileData } from '@/lib/background/contracts';
import { SendTransferInput } from '@/lib/background/extension.wallet';
import { SessionEntries } from '@/lib/store/session';

export enum OneTimeEvents {
    SEND_VOTE = 'SEND_VOTE',
    SEND_TRANSACTION = 'SEND_TRANSACTION',
    SIGN_MESSAGE = 'SIGN_MESSAGE',
    GET_DATA = 'GET_DATA',
    IMPORT_WALLETS = 'IMPORT_WALLETS',
    PERSIST = 'PERSIST',
    SET_SESSIONS = 'SET_SESSIONS',
    REFRESH_AUTOLOCK_TIMER = 'REFRESH_AUTOLOCK_TIMER',
    CLEAR_AUTOLOCK_TIMER = 'CLEAR_AUTOLOCK_TIMER',
    REGISTER_ACTIVITY = 'REGISTER_ACTIVITY',
    LOCK = 'LOCK',
    CHECK_LOCK = 'CHECK_LOCK',
    CHANGE_PASSWORD = 'CHANGE_PASSWORD',
    RESET = 'RESET',
    REMOVE_WALLETS = 'REMOVE_WALLETS',
    VALIDATE_PASSWORD = 'VALIDATE_PASSWORD',
    UNLOCK = 'UNLOCK',
    DISCONNECT_RESOLVE = 'DISCONNECT_RESOLVE',
    CONNECT_RESOLVE = 'CONNECT_RESOLVE',
    SET_LAST_SCREEN = 'SET_LAST_SCREEN',
    CLEAR_LAST_SCREEN = 'CLEAR_LAST_SCREEN',
}

export function OneTimeEventHandlers(extension: ReturnType<typeof Extension>) {
    return {
        [OneTimeEvents.SEND_VOTE]: async (request: any) => {
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
        },

        [OneTimeEvents.SEND_TRANSACTION]: async (request: any) => {
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
        },

        [OneTimeEvents.SIGN_MESSAGE]: async (request: any) => {
            extension.assertLockedStatus();
            extension.assertPrimaryWallet();

            try {
                return extension.primaryWallet().wallet().signMessage(request.data.message);
            } catch (error) {
                return { error: 'FAILED_TO_SIGN', errorStack: error };
            }
        },

        [OneTimeEvents.GET_DATA]: async (_request: any) => {
            // Prevent from sending actual profile data on locked state.
            if (extension.isLocked()) {
                const emptyProfile = await extension.createEmptyProfile();
                const data = await extension.env().profiles().export(emptyProfile);

                return {
                    data,
                    profileData: undefined,
                };
            }

            try {
                return extension.exportAsReadOnly();
            } catch (error) {
                return {
                    error: 'FAILED_TO_EXPORT_PROFILE',
                    errorStack: error,
                };
            }
        },

        [OneTimeEvents.IMPORT_WALLETS]: async (request: any) => {
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
        },

        [OneTimeEvents.PERSIST]: async (request: any) => {
            return await handleSetData(request, extension);
        },

        [OneTimeEvents.SET_SESSIONS]: async (request: any) => {
            extension.profile().settings().set(ProfileData.Sessions, request.data.sessions);
            await extension.env().persist();
        },

        [OneTimeEvents.REFRESH_AUTOLOCK_TIMER]: async (_request: any) => {
            if (!extension.isLocked()) {
                await extension.lockHandler().setLastActiveTime(true);
            }
        },

        [OneTimeEvents.REGISTER_ACTIVITY]: async (_request: any) => {
            await extension.lockHandler().setLastActiveTime();
        },

        [OneTimeEvents.CLEAR_AUTOLOCK_TIMER]: async (_request: any) => {
            await extension.lockHandler().clearTimer();
        },

        [OneTimeEvents.LOCK]: async (_request: any) => {
            extension.lockHandler().lock();
        },

        [OneTimeEvents.UNLOCK]: async (request: any) => {
            try {
                await extension.unlock(request.data.password);

                return {
                    isLocked: extension.isLocked(),
                };
            } catch (error) {
                return {
                    isLocked: true,
                    errorStack: error,
                };
            }
        },

        [OneTimeEvents.CHECK_LOCK]: async (_request: any) => {
            return Promise.resolve({ isLocked: extension.lockHandler().isLocked() });
        },

        [OneTimeEvents.CHANGE_PASSWORD]: async (request: any) => {
            return await handleChangePassword(request, extension);
        },

        [OneTimeEvents.RESET]: async (_request: any) => {
            await extension.reset(UUID.random());
        },

        [OneTimeEvents.REMOVE_WALLETS]: async (request: any) => {
            return await handleRemoveWallets(request, extension);
        },

        [OneTimeEvents.VALIDATE_PASSWORD]: async (request: any) => {
            return Promise.resolve({
                isValid: extension.profile()?.password().get() === request.data.password,
            });
        },

        [OneTimeEvents.DISCONNECT_RESOLVE]: async (request: any) => {
            void ExtensionEvents({ profile: extension.profile() }).disconnect(request.data.domain);
        },

        [OneTimeEvents.CONNECT_RESOLVE]: async (request: any) => {
            void ExtensionEvents({ profile: extension.profile() }).connect(request.data.domain);
        },

        [OneTimeEvents.SET_LAST_SCREEN]: async (request: any) => {
            extension.profile().settings().set(ProfileData.LastVisitedPage, {
                name: request.name,
                data: request.data,
            });

            await extension.persist();
            return;
        },

        [OneTimeEvents.CLEAR_LAST_SCREEN]: async (_request: any) => {
            extension.profile().settings().forget(ProfileData.LastVisitedPage);
            await extension.persist();
            return;
        },
    };
}

const handleSetData = async (request: any, extension: ReturnType<typeof Extension>) => {
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

    const dump = Object.values(request.data.profileDump)[0] as Record<string, string>;

    const requestedProfile = await extension.env().profiles().import(dump.data);
    await extension.env().profiles().restore(requestedProfile);

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
};

const handleChangePassword = async (request: any, extension: ReturnType<typeof Extension>) => {
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
            const isOldWalletPrimary = wallet.isPrimary();

            // Only non-ledgers have mnemonics
            if (!wallet.isLedger()) {
                const mnemonic = await wallet.confirmKey().get(request.data.oldPassword);

                newWallet = await extension.profile().walletFactory().fromMnemonicWithBIP39({
                    coin: wallet.network().coin(),
                    network: wallet.network().id(),
                    mnemonic,
                });

                newWallet.mutator().alias(wallet.alias() as string);
                await newWallet.confirmKey().set(mnemonic, extension.profile().password().get());
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

            const sessions = extension
                .profile()
                .settings()
                .get<SessionEntries>(ProfileData.Sessions);

            if (sessions) {
                // Adjust sessions' walletId to match new ones
                for (const [sessionId, session] of Object.entries(sessions)) {
                    if (session.walletId === oldWalletId) {
                        session.walletId = newWallet.id();
                        sessions[sessionId] = session;
                    }
                }

                // Store updated sessions
                extension.profile().settings().set(ProfileData.Sessions, sessions);
            }

            extension.profile().wallets().forget(oldWalletId);
            extension.profile().wallets().push(newWallet);
            newWallet.data().set(Contracts.WalletData.IsPrimary, isOldWalletPrimary);
        }

        await extension.persist();

        return Promise.resolve({ error: undefined });
    } catch (error) {
        return Promise.resolve({ error });
    }
};

const handleRemoveWallets = async (request: any, extension: ReturnType<typeof Extension>) => {
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
        return {
            noWallets: true,
        };
    }

    if (!extension.primaryWallet().exists()) {
        extension.primaryWallet().set(extension.profile().wallets().first().id());
    }

    await extension.persist();

    return {
        error: undefined,
    };
};
