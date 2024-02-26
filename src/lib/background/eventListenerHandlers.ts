import browser from 'webextension-polyfill';
import { Contracts } from '@ardenthq/sdk-profiles';
import {
  assertIsConnected,
  assertIsNotConnected,
  assertHasWallet,
  getActiveSession,
  assertHasProfile,
} from './assertions';
import { Session } from '../store/session';
import { WalletNetwork } from '../store/wallet';

export type EventPayload<T> = {
  type: keyof typeof BACKGROUND_EVENT_LISTENERS_HANDLERS;
  data: T & DefaultPayload;
};

type DefaultPayload = {
  domain: string;
  tabId: number;
  port: browser.Runtime.Port;
  windowId?: number;
  network: WalletNetwork;
};

export type ConnectData = {
  favicon: string;
};

export type EventListenerData = {
  eventName: string;
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

const forwardEvent = { callback: () => {} };

let extensionWindowId: number | null = null;

const createExtensionWindow = async (onWindowReady: (id?: number) => void) => {
  // Check if a window is already open
  if (extensionWindowId !== null) {
    await browser.windows.update(extensionWindowId, { focused: true });
    return;
  }

  const POPUP_WIDTH = 375;

  let left = 0;
  let top = 0;

  try {
    const lastFocused = await browser.windows.getLastFocused();

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

  const newTab = await browser.windows.create({
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
    const tab = await browser.tabs.get(id);
    if (extensionWindowId !== tab.windowId || tab.status === 'loading') return;

    onWindowReady(extensionWindowId);

    browser.tabs.onUpdated.removeListener(onUpdatedListener);
  };

  browser.tabs.onUpdated.addListener(onUpdatedListener);

  browser.windows.onRemoved.addListener((removedWindowId) => {
    if (removedWindowId === extensionWindowId) {
      browser.tabs.onUpdated.removeListener(onUpdatedListener);
      extensionWindowId = null; // Reset the global variable when the window is closed
    }
  });
};

const initWindow = async (payload: EventPayload<ConnectData>) => {
  await createExtensionWindow((id) => {
    const { port, ...rest } = payload.data;

    browser.runtime.sendMessage({
      type: `${payload.type}_UI`,
      data: { ...rest, windowId: id },
    });
  });
};

const handleOnConnect = async (
  payload: EventPayload<ConnectData>,
  profile: Contracts.IProfile | null,
) => {
  try {
    if (!profile) {
      throw new Error('No profile found. Please connect your wallet and try again.');
    } else {
      assertHasWallet(profile);
      assertIsConnected({ payload, profile });

      initWindow(payload);
    }
  } catch (error: any) {
    browser.tabs.sendMessage(payload.data.tabId, {
      type: `${payload.type}_REJECT`,
      data: {
        status: 'failed',
        domain: payload.data.domain,
        message: 'Wallet is locked.',
        tabId: payload.data.tabId,
      },
    });
  }
};

const handleIsConnected = async (
  payload: EventPayload<DefaultPayload>,
  profile: Contracts.IProfile | null,
) => {
  try {
    assertHasWallet(profile);

    browser.tabs.sendMessage(payload.data.tabId, {
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
    browser.tabs.sendMessage(payload.data.tabId, {
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

      browser.runtime.sendMessage({
        type: `${payload.type}_UI`,
        data: { ...rest, windowId: id },
      });
    });
  } catch (error: any) {
    browser.tabs.sendMessage(payload.data.tabId, {
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
) => {
  try {
    assertHasWallet(profile);

    const activeSession = assertIsNotConnected({ payload, profile });

    assertHasProfile(profile);

    const wallet = profile?.wallets().findById(activeSession.walletId);

    browser.tabs.sendMessage(payload.data.tabId, {
      type: `${payload.type}_RESOLVE`,
      data: {
        status: 'success',
        address: wallet?.address(),
        domain: payload.data.domain,
        tabId: payload.data.tabId,
      },
    });
  } catch (error: any) {
    browser.tabs.sendMessage(payload.data.tabId, {
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
) => {
  try {
    assertHasWallet(profile);

    const activeSession = assertIsNotConnected({ payload, profile });

    assertHasProfile(profile);

    const wallet = profile?.wallets().findById(activeSession.walletId);

    browser.tabs.sendMessage(payload.data.tabId, {
      type: `${payload.type}_RESOLVE`,
      data: {
        status: 'success',
        network: wallet?.network().name(),
        domain: payload.data.domain,
        tabId: payload.data.tabId,
      },
    });
  } catch (error: any) {
    browser.tabs.sendMessage(payload.data.tabId, {
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
) => {
  try {
    assertHasWallet(profile);

    const activeSession = assertIsNotConnected({ payload, profile });

    const wallet = profile?.wallets().findById(activeSession.walletId);

    browser.tabs.sendMessage(payload.data.tabId, {
      type: `${payload.type}_RESOLVE`,
      data: {
        status: 'success',
        balance: wallet?.balance(),
        domain: payload.data.domain,
        tabId: payload.data.tabId,
      },
    });
  } catch (error: any) {
    browser.tabs.sendMessage(payload.data.tabId, {
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

      browser.runtime.sendMessage({
        type: `${payload.type}_UI`,
        data: { ...rest, session: { ...activeSession, wallet }, windowId: id },
      });
    });
  } catch (error: any) {
    browser.tabs.sendMessage(payload.data.tabId, {
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

      browser.runtime.sendMessage({
        type: `${payload.type}_UI`,
        data: { ...rest, session: { ...activeSession, wallet }, windowId: id },
      });
    });
  } catch (error: any) {
    browser.tabs.sendMessage(payload.data.tabId, {
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

      browser.runtime.sendMessage({
        type: `${payload.type}_UI`,
        data: { ...rest, session: { ...activeSession, wallet }, windowId: id },
      });
    });
  } catch (error: any) {
    browser.tabs.sendMessage(payload.data.tabId, {
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

export const BACKGROUND_EVENT_LISTENERS_HANDLERS = {
  CONNECT: {
    callback: handleOnConnect,
  },
  CONNECT_RESOLVE: forwardEvent,
  CONNECT_REJECT: forwardEvent,
  IS_CONNECTED: {
    callback: handleIsConnected,
  },
  IS_CONNECTED_RESOLVE: forwardEvent,
  IS_CONNECTED_REJECT: forwardEvent,
  DISCONNECT: {
    callback: handleDisconnect,
  },
  DISCONNECT_RESOLVE: forwardEvent,
  DISCONNECT_REJECT: forwardEvent,
  GET_ADDRESS: {
    callback: handleGetAddress,
  },
  GET_ADDRESS_RESOLVE: forwardEvent,
  GET_ADDRESS_REJECT: forwardEvent,
  GET_BALANCE: {
    callback: handleGetBalance,
  },
  GET_BALANCE_RESOLVE: forwardEvent,
  GET_BALANCE_REJECT: forwardEvent,
  GET_NETWORK: {
    callback: handleGetNetwork,
  },
  GET_NETWORK_RESOLVE: forwardEvent,
  GET_NETWORK_REJECT: forwardEvent,
  SIGN_MESSAGE: {
    callback: handleSignMessage,
  },
  SIGN_MESSAGE_RESOLVE: forwardEvent,
  SIGN_MESSAGE_REJECT: forwardEvent,
  SIGN_TRANSACTION: {
    callback: handleSignTransaction,
  },
  SIGN_TRANSACTION_RESOLVE: forwardEvent,
  SIGN_TRANSACTION_REJECT: forwardEvent,
  SIGN_VOTE: {
    callback: handleSignVote,
  },
  SIGN_VOTE_RESOLVE: forwardEvent,
  SIGN_VOTE_REJECT: forwardEvent,
};
