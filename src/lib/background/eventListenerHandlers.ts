/* eslint-disable @typescript-eslint/no-unused-vars */
import { Runtime, runtime, tabs, windows } from 'webextension-polyfill';
import { Contracts } from '@ardenthq/sdk-profiles';
import {
    assertHasProfile,
    assertHasWallet,
    assertIsConnected,
    assertIsNotConnected,
    assertIsUnlocked,
    getActiveSession,
} from './assertions';
import { WalletNetwork } from '@/lib/store/wallet';
import { Session } from '@/lib/store/session';

export type EventPayload<T> = {
    type: keyof typeof longLivedConnectionHandlers;
    data: T & DefaultPayload;
};

type DefaultPayload = {
    domain: string;
    tabId: number;
    port: Runtime.Port;
    windowId?: number;
    network: WalletNetwork;
};

export type ConnectData = {
    favicon: string;
};

export type SignMessageData = {
    type: 'signature';
    message: string;
    session: Session;
};

export type SignTransactionData = {
    type: 'transfer';
    amount: number;
    receiverAddress: string;
    session: Session;
};

export type SignVoteData = {
    type: 'vote' | 'unvote';
    amount: number;
    receiverAddress: string;
    session: Session;
};

let extensionWindowId: number | null = null;

const createExtensionWindow = async (onWindowReady: (id?: number) => void) => {
    // Check if a window is already open
    if (extensionWindowId !== null) {
        await windows.update(extensionWindowId, { focused: true });
        return;
    }

    const POPUP_WIDTH = 370;

    let left = 0;
    let top = 0;

    try {
        const lastFocused = await windows.getLastFocused();

        // Position window in top right corner of lastFocused window.
        top = lastFocused.top ?? 0;
        left = Math.max((lastFocused.left ?? 0) + ((lastFocused.width ?? 0) - POPUP_WIDTH), 0);
    } catch (_) {
        // The following properties are more than likely 0, due to being
        // opened from the background chrome process for the extension that
        // has no physical dimensions
        const { screenX, screenY, outerWidth } = window;

        top = Math.max(screenY, 0);
        left = Math.max(screenX + (outerWidth - POPUP_WIDTH), 0);
    }

    const newTab = await windows.create({
        url: '/src/main.html',
        type: 'popup',
        width: POPUP_WIDTH,
        height: 642,
        left,
        top,
    });

    if (!newTab || !newTab.id) return;

    // Store the window ID in the global variable
    extensionWindowId = newTab.id;

    const onUpdatedListener = async (id: number) => {
        const tab = await tabs.get(id);
        if (extensionWindowId !== tab.windowId || tab.status === 'loading') return;

        onWindowReady(extensionWindowId);

        tabs.onUpdated.removeListener(onUpdatedListener);
    };

    tabs.onUpdated.addListener(onUpdatedListener);

    windows.onRemoved.addListener((removedWindowId) => {
        if (removedWindowId === extensionWindowId) {
            tabs.onUpdated.removeListener(onUpdatedListener);
            extensionWindowId = null; // Reset the global variable when the window is closed
        }
    });
};

const initWindow = async (payload: EventPayload<ConnectData>) => {
    await createExtensionWindow((id) => {
        const { port, ...rest } = payload.data;

        runtime.sendMessage({
            type: `${payload.type}_UI`,
            data: { ...rest, windowId: id },
        });
    });
};

const handleOnConnect = async (
    payload: EventPayload<ConnectData>,
    profile: Contracts.IProfile | null,
    isLocked: boolean,
) => {
    try {
        if (profile?.wallets().count() === 0) {
            void initWindow(payload);

            throw new Error('No profile found. Please connect your wallet and try again.');
        }

        assertHasWallet(profile);

        if (!isLocked) {
            assertIsConnected({ payload, profile });
        }

        void initWindow(payload);
    } catch (error: any) {
        tabs.sendMessage(payload.data.tabId, {
            type: `${payload.type}_REJECT`,
            data: {
                status: 'failed',
                domain: payload.data.domain,
                message: error.message,
                tabId: payload.data.tabId,
            },
        });
    }
};

const handleIsConnected = async (
    payload: EventPayload<DefaultPayload>,
    profile: Contracts.IProfile | null,
    isLocked: boolean,
) => {
    try {
        assertIsUnlocked(isLocked);
        assertHasWallet(profile);

        tabs.sendMessage(payload.data.tabId, {
            type: `${payload.type}_RESOLVE`,
            data: {
                status: 'success',
                isConnected: !!getActiveSession({
                    payload,
                    profile,
                }),
                domain: payload.data.domain,
                tabId: payload.data.tabId,
            },
        });
    } catch (error: any) {
        tabs.sendMessage(payload.data.tabId, {
            type: `${payload.type}_REJECT`,
            data: {
                status: 'failed',
                domain: payload.data.domain,
                message: error.message,
                tabId: payload.data.tabId,
            },
        });
    }
};

const handleDisconnect = async (
    payload: EventPayload<DefaultPayload>,
    profile: Contracts.IProfile | null,
) => {
    try {
        assertHasWallet(profile);
        assertIsNotConnected({ payload, profile });

        await createExtensionWindow((id) => {
            const { port, ...rest } = payload.data;

            runtime.sendMessage({
                type: `${payload.type}_UI`,
                data: { ...rest, windowId: id },
            });
        });
    } catch (error: any) {
        tabs.sendMessage(payload.data.tabId, {
            type: `${payload.type}_REJECT`,
            data: {
                status: 'failed',
                domain: payload.data.domain,
                message: error.message,
                tabId: payload.data.tabId,
            },
        });
    }
};

const handleGetAddress = async (
    payload: EventPayload<DefaultPayload>,
    profile: Contracts.IProfile | null,
    isLocked: boolean,
) => {
    try {
        assertIsUnlocked(isLocked);
        assertHasWallet(profile);

        const activeSession = assertIsNotConnected({ payload, profile });

        assertHasProfile(profile);

        const wallet = profile?.wallets().findById(activeSession.walletId);

        tabs.sendMessage(payload.data.tabId, {
            type: `${payload.type}_RESOLVE`,
            data: {
                status: 'success',
                address: wallet?.address(),
                domain: payload.data.domain,
                tabId: payload.data.tabId,
            },
        });
    } catch (error: any) {
        tabs.sendMessage(payload.data.tabId, {
            type: `${payload.type}_REJECT`,
            data: {
                status: 'failed',
                domain: payload.data.domain,
                message: error.message,
                tabId: payload.data.tabId,
            },
        });
    }
};

const handleGetNetwork = async (
    payload: EventPayload<DefaultPayload>,
    profile: Contracts.IProfile | null,
    isLocked: boolean,
) => {
    try {
        assertIsUnlocked(isLocked);
        assertHasWallet(profile);

        const activeSession = assertIsNotConnected({ payload, profile });

        assertHasProfile(profile);

        const wallet = profile?.wallets().findById(activeSession.walletId);

        tabs.sendMessage(payload.data.tabId, {
            type: `${payload.type}_RESOLVE`,
            data: {
                status: 'success',
                network: wallet?.network().name(),
                domain: payload.data.domain,
                tabId: payload.data.tabId,
            },
        });
    } catch (error: any) {
        tabs.sendMessage(payload.data.tabId, {
            type: `${payload.type}_REJECT`,
            data: {
                status: 'failed',
                domain: payload.data.domain,
                message: error.message,
                tabId: payload.data.tabId,
            },
        });
    }
};

const handleGetBalance = async (
    payload: EventPayload<DefaultPayload>,
    profile: Contracts.IProfile | null,
    isLocked: boolean,
) => {
    try {
        assertIsUnlocked(isLocked);
        assertHasWallet(profile);

        const activeSession = assertIsNotConnected({ payload, profile });

        const wallet = profile?.wallets().findById(activeSession.walletId);

        tabs.sendMessage(payload.data.tabId, {
            type: `${payload.type}_RESOLVE`,
            data: {
                status: 'success',
                balance: wallet?.balance(),
                domain: payload.data.domain,
                tabId: payload.data.tabId,
            },
        });
    } catch (error: any) {
        tabs.sendMessage(payload.data.tabId, {
            type: `${payload.type}_REJECT`,
            data: {
                status: 'failed',
                domain: payload.data.domain,
                message: error.message,
                tabId: payload.data.tabId,
            },
        });
    }
};

const handleSignMessage = async (
    payload: EventPayload<SignMessageData>,
    profile: Contracts.IProfile | null,
) => {
    try {
        assertHasWallet(profile);

        const activeSession = assertIsNotConnected({ payload, profile });

        assertHasProfile(profile);

        const wallet = profile?.wallets().findById(activeSession.walletId);

        await createExtensionWindow((id) => {
            const { port, ...rest } = payload.data;

            runtime.sendMessage({
                type: `${payload.type}_UI`,
                data: { ...rest, session: { ...activeSession, wallet }, windowId: id },
            });
        });
    } catch (error: any) {
        tabs.sendMessage(payload.data.tabId, {
            type: `${payload.type}_REJECT`,
            data: {
                status: 'failed',
                domain: payload.data.domain,
                message: error.message,
                tabId: payload.data.tabId,
            },
        });
    }
};

const handleSignTransaction = async (
    payload: EventPayload<SignTransactionData>,
    profile: Contracts.IProfile | null,
) => {
    try {
        assertHasWallet(profile);

        const activeSession = assertIsNotConnected({ payload, profile });

        assertHasProfile(profile);

        const wallet = profile?.wallets().findById(activeSession.walletId);

        await createExtensionWindow((id) => {
            const { port, ...rest } = payload.data;

            runtime.sendMessage({
                type: `${payload.type}_UI`,
                data: { ...rest, session: { ...activeSession, wallet }, windowId: id },
            });
        });
    } catch (error: any) {
        tabs.sendMessage(payload.data.tabId, {
            type: `${payload.type}_REJECT`,
            data: {
                status: 'failed',
                domain: payload.data.domain,
                message: error.message,
                tabId: payload.data.tabId,
            },
        });
    }
};

const handleSignVote = async (
    payload: EventPayload<SignVoteData>,
    profile: Contracts.IProfile | null,
) => {
    try {
        assertHasWallet(profile);

        const activeSession = assertIsNotConnected({ payload, profile });

        assertHasProfile(profile);

        const wallet = profile?.wallets().findById(activeSession.walletId);

        await createExtensionWindow((id) => {
            const { port, ...rest } = payload.data;

            runtime.sendMessage({
                type: `${payload.type}_UI`,
                data: { ...rest, session: { ...activeSession, wallet }, windowId: id },
            });
        });
    } catch (error: any) {
        tabs.sendMessage(payload.data.tabId, {
            type: `${payload.type}_REJECT`,
            data: {
                status: 'failed',
                domain: payload.data.domain,
                message: error.message,
                tabId: payload.data.tabId,
            },
        });
    }
};

export const longLivedConnectionHandlers = {
    CONNECT: handleOnConnect,
    IS_CONNECTED: handleIsConnected,
    DISCONNECT: handleDisconnect,
    GET_ADDRESS: handleGetAddress,
    GET_BALANCE: handleGetBalance,
    GET_NETWORK: handleGetNetwork,
    SIGN_MESSAGE: handleSignMessage,
    SIGN_TRANSACTION: handleSignTransaction,
    SIGN_VOTE: handleSignVote,
};
