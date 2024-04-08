import packageData from '../package.json';
import { ExtensionSupportedEvents } from '@/lib/events';
import { assertPositiveNonZero, getLogoOrFaviconUrl, isValidObjectByType } from '@/inpage.helpers';

type OnEvent = {
    type: Events;
    callback: (event: MessageEvent) => void;
};

enum WalletNetwork {
    DEVNET = 'Devnet',
    MAINNET = 'Mainnet',
}

enum Events {
    CONNECT_RESOLVE = 'CONNECT_RESOLVE',
    CONNECT_REJECT = 'CONNECT_REJECT',
    IS_CONNECTED_RESOLVE = 'IS_CONNECTED_RESOLVE',
    IS_CONNECTED_REJECT = 'IS_CONNECTED_REJECT',
    DISCONNECT_RESOLVE = 'DISCONNECT_RESOLVE',
    DISCONNECT_REJECT = 'DISCONNECT_REJECT',
    GET_NETWORK_RESOLVE = 'GET_NETWORK_RESOLVE',
    GET_NETWORK_REJECT = 'GET_NETWORK_REJECT',
    GET_ADDRESS_RESOLVE = 'GET_ADDRESS_RESOLVE',
    GET_ADDRESS_REJECT = 'GET_ADDRESS_REJECT',
    GET_BALANCE_RESOLVE = 'GET_BALANCE_RESOLVE',
    GET_BALANCE_REJECT = 'GET_BALANCE_REJECT',
    SIGN_MESSAGE_RESOLVE = 'SIGN_MESSAGE_RESOLVE',
    SIGN_MESSAGE_REJECT = 'SIGN_MESSAGE_REJECT',
    SIGN_TRANSACTION_RESOLVE = 'SIGN_TRANSACTION_RESOLVE',
    SIGN_TRANSACTION_REJECT = 'SIGN_TRANSACTION_REJECT',
    SIGN_VOTE_RESOLVE = 'SIGN_VOTE_RESOLVE',
    SIGN_VOTE_REJECT = 'SIGN_VOTE_REJECT',
}

enum Messages {
    CONNECT = 'CONNECT',
    IS_CONNECTED = 'IS_CONNECTED',
    DISCONNECT = 'DISCONNECT',
    GET_NETWORK = 'GET_NETWORK',
    GET_ADDRESS = 'GET_ADDRESS',
    GET_BALANCE = 'GET_BALANCE',
    SIGN_MESSAGE = 'SIGN_MESSAGE',
    SIGN_TRANSACTION = 'SIGN_TRANSACTION',
    SIGN_VOTE = 'SIGN_VOTE',
}

type NetworkType = {
    network?: WalletNetwork;
};

type ConnectResponse = {
    status: 'success';
    domain: string;
    network?: WalletNetwork;
};

type ErrorResponse = {
    status: 'failed';
    domain: string;
    message: string;
};

type DisconnectResponse = {
    status: 'success';
    domain: string;
    disconnected: boolean;
};

type SignMessageRequest = {
    message: string;
};

type SignMessageResponse = {
    message: string;
    signatory: string;
    signature: string;
};

type SignTransactionRequest = {
    amount: number;
    fee?: number;
    receiverAddress: string;
};

type SignTransactionResponse = {
    id: string;
    sender: string;
    receiver: string;
    exchangeCurrency: string;
    amount: number;
    convertedAmount: number;
    fee: number;
    convertedFee: number;
    total: number;
    convertedTotal: number;
};

type SignVoteRequest = {
    vote?: {
        amount: number;
        delegateAddress: string;
    };
    unvote?: {
        amount: number;
        delegateAddress: string;
    };
    fee?: number;
};

type SignVoteResponse = {
    id: string;
    sender: string;
    voteDelegateAddress?: string;
    voteDelegateName?: string;
    votePublicKey?: string;
    unvoteDelegateAddress?: string;
    unvoteDelegateName?: string;
    unvotePublicKey?: string;
    exchangeCurrency: string;
    fee: number;
    convertedFee: number;
};

const signVoteRequestShape: SignVoteRequest = {
    vote: {
        amount: 1,
        delegateAddress: 'address',
    },
};

const signUnvoteRequestShape: SignVoteRequest = {
    unvote: {
        amount: 1,
        delegateAddress: 'address',
    },
};

const signTransactionRequestShape: SignTransactionRequest = {
    amount: 1,
    receiverAddress: 'address',
};

const signMessageRequestShape: SignMessageRequest = {
    message: 'string',
};

class ArkConnectInPageProvider {
    private _signMessageAbortController: AbortController | null = null;

    readonly loaded = true;

    on(eventName: typeof ExtensionSupportedEvents, callback: (data: any) => void) {
        const eventListener = (event: MessageEvent) => {
            if (event.source !== window || !event.data.type) {
                return;
            }

            if (event.data.type === eventName) {
                callback?.(event.data);
            }
        };

        window.addEventListener('message', eventListener, false);
    }

    connect() {
        return new Promise(
            (resolve: (data: ConnectResponse) => void, reject: (error: ErrorResponse) => void) => {
                const eventListener = this._getEventListener([
                    { type: Events.CONNECT_RESOLVE, callback: (event) => resolve(event.data.data) },
                    { type: Events.CONNECT_REJECT, callback: (event) => reject(event.data.data) },
                ]);

                window.addEventListener('message', eventListener, false);

                this._sendMessage(Messages.CONNECT, { favicon: getLogoOrFaviconUrl() });
            },
        );
    }

    isConnected() {
        return new Promise(
            (resolve: (data: boolean) => void, reject: (error: ErrorResponse) => void) => {
                const eventListener = this._getEventListener([
                    {
                        type: Events.IS_CONNECTED_RESOLVE,
                        callback: (event) => resolve(event.data.data.isConnected),
                    },
                    {
                        type: Events.IS_CONNECTED_REJECT,
                        callback: (event) => reject(event.data.data),
                    },
                ]);

                window.addEventListener('message', eventListener, false);

                this._sendMessage(Messages.IS_CONNECTED);
            },
        );
    }

    disconnect() {
        return new Promise(
            (
                resolve: (data: DisconnectResponse) => void,
                reject: (error: ErrorResponse) => void,
            ) => {
                const eventListener = this._getEventListener([
                    {
                        type: Events.DISCONNECT_RESOLVE,
                        callback: (event) => resolve(event.data.data),
                    },
                    {
                        type: Events.DISCONNECT_REJECT,
                        callback: (event) => reject(event.data.data),
                    },
                ]);

                window.addEventListener('message', eventListener, false);

                this._sendMessage(Messages.DISCONNECT);
            },
        );
    }

    getNetwork() {
        return new Promise(
            (resolve: (data: string) => void, reject: (error: ErrorResponse) => void) => {
                const eventListener = this._getEventListener([
                    {
                        type: Events.GET_NETWORK_RESOLVE,
                        callback: (event) => resolve(event.data.data.network),
                    },
                    {
                        type: Events.GET_NETWORK_REJECT,
                        callback: (event) => reject(event.data.data),
                    },
                ]);

                window.addEventListener('message', eventListener, false);

                this._sendMessage(Messages.GET_NETWORK);
            },
        );
    }

    getAddress() {
        return new Promise(
            (resolve: (data: string) => void, reject: (error: ErrorResponse) => void) => {
                const eventListener = this._getEventListener([
                    {
                        type: Events.GET_ADDRESS_RESOLVE,
                        callback: (event) => resolve(event.data.data.address),
                    },
                    {
                        type: Events.GET_ADDRESS_REJECT,
                        callback: (event) => reject(event.data.data),
                    },
                ]);

                window.addEventListener('message', eventListener, false);

                this._sendMessage(Messages.GET_ADDRESS);
            },
        );
    }

    getBalance() {
        return new Promise(
            (resolve: (data: string) => void, reject: (error: ErrorResponse) => void) => {
                const eventListener = this._getEventListener([
                    {
                        type: Events.GET_BALANCE_RESOLVE,
                        callback: (event) => resolve(event.data.data.balance),
                    },
                    {
                        type: Events.GET_BALANCE_REJECT,
                        callback: (event) => reject(event.data.data),
                    },
                ]);

                window.addEventListener('message', eventListener, false);

                this._sendMessage(Messages.GET_BALANCE);
            },
        );
    }

    signMessage(request: SignMessageRequest) {
        return new Promise(
            (
                resolve: (data: SignMessageResponse) => void,
                reject: (error: ErrorResponse) => void,
            ) => {
                if (!isValidObjectByType<SignMessageRequest>(request, signMessageRequestShape)) {
                    reject({
                        domain: window.location.origin,
                        status: 'failed',
                        message: 'Provided arguments does not match type `SignMessageRequest`',
                    });
                    return;
                }

                if (request.message.length > 255) {
                    reject({
                        domain: window.location.origin,
                        status: 'failed',
                        message: 'Provided message extends the limit of 255 characters',
                    });
                    return;
                }

                if (this._signMessageAbortController) {
                    this._signMessageAbortController.abort();
                }

                this._signMessageAbortController = new AbortController();

                const eventListener = this._getEventListener([
                    {
                        type: Events.SIGN_MESSAGE_RESOLVE,
                        callback: (event) =>
                            resolve({
                                message: event.data.data.message,
                                signatory: event.data.data.signatory,
                                signature: event.data.data.signature,
                            }),
                    },
                    {
                        type: Events.SIGN_MESSAGE_REJECT,
                        callback: (event) => reject(event.data.data),
                    },
                ]);

                window.addEventListener('message', eventListener, {
                    signal: this._signMessageAbortController.signal,
                });

                this._sendMessage(Messages.SIGN_MESSAGE, {
                    ...request,
                    type: 'signature',
                });
            },
        );
    }

    signTransaction(request: SignTransactionRequest) {
        return new Promise(
            (
                resolve: (data: SignTransactionResponse) => void,
                reject: (error: ErrorResponse) => void,
            ) => {
                if (
                    !isValidObjectByType<SignTransactionRequest>(
                        request,
                        signTransactionRequestShape,
                    )
                ) {
                    reject({
                        domain: window.location.origin,
                        status: 'failed',
                        message: 'Provided arguments does not match type `SignTransactionRequest`',
                    });
                    return;
                }

                try {
                    assertPositiveNonZero(request.amount);

                    if (request.fee) {
                        assertPositiveNonZero(request.fee);

                        if (request.fee > 1) {
                            throw new Error(
                                `Fee cannot be greater than 1, received ${request.fee}`,
                            );
                        }
                    }
                } catch (error: unknown) {
                    reject({
                        domain: window.location.origin,
                        status: 'failed',
                        message: error instanceof Error ? error.message : '',
                    });
                    return;
                }

                const eventListener = this._getEventListener([
                    {
                        type: Events.SIGN_TRANSACTION_RESOLVE,
                        callback: (event) => resolve(event.data.data.transaction),
                    },
                    {
                        type: Events.SIGN_TRANSACTION_REJECT,
                        callback: (event) => resolve(event.data.data),
                    },
                ]);

                window.addEventListener('message', eventListener, false);

                this._sendMessage(Messages.SIGN_TRANSACTION, {
                    ...request,
                    type: 'transfer',
                });
            },
        );
    }

    signVote(request: SignVoteRequest) {
        return new Promise(
            (resolve: (data: SignVoteResponse) => void, reject: (error: ErrorResponse) => void) => {
                if (
                    !isValidObjectByType<SignVoteRequest>(request, signVoteRequestShape) &&
                    !isValidObjectByType<SignVoteRequest>(request, signUnvoteRequestShape)
                ) {
                    reject({
                        domain: window.location.origin,
                        status: 'failed',
                        message: 'Provided arguments does not match type `SignVoteRequest`',
                    });
                    return;
                }

                try {
                    if (request.fee) {
                        assertPositiveNonZero(request.fee);

                        if (request.fee > 1) {
                            throw new Error(
                                `Fee cannot be greater than 1, received ${request.fee}`,
                            );
                        }
                    }
                } catch (error: unknown) {
                    reject({
                        domain: window.location.origin,
                        status: 'failed',
                        message: error instanceof Error ? error.message : '',
                    });
                    return;
                }

                const eventListener = this._getEventListener([
                    {
                        type: Events.SIGN_VOTE_RESOLVE,
                        callback: (event) => resolve(event.data.data.vote),
                    },
                    {
                        type: Events.SIGN_VOTE_REJECT,
                        callback: (event) => resolve(event.data.data),
                    },
                ]);

                window.addEventListener('message', eventListener, false);

                this._sendMessage(Messages.SIGN_VOTE, {
                    ...request,
                    type: request.vote ? 'vote' : 'unvote',
                });
            },
        );
    }

    version() {
        return packageData.version;
    }

    private _sendMessage(type: Messages, data: object = {}) {
        window.postMessage(
            {
                type,
                data: {
                    domain: window.location.origin,
                    ...data,
                },
            },
            '*',
        );
    }

    private _getEventListener(allowedEvents: OnEvent[]) {
        const eventListener = (event: MessageEvent) => {
            if (event.source !== window || !event.data.type) {
                return;
            }

            for (const allowedEvent of allowedEvents) {
                if (event.data.type === allowedEvent.type) {
                    allowedEvent.callback(event);
                    window.removeEventListener('message', eventListener);
                }
            }
        };

        return eventListener;
    }
}

interface ArkConnect {
    loaded: boolean;
    connect: (request: NetworkType) => Promise<ConnectResponse | ErrorResponse>;
    on: (eventName: typeof ExtensionSupportedEvents, callback: (data: any) => void) => void;
    isConnected: () => Promise<boolean | ErrorResponse>;
    disconnect: () => Promise<DisconnectResponse | ErrorResponse>;
    getAddress: () => Promise<string | ErrorResponse>;
    getBalance: () => Promise<string | ErrorResponse>;
    getNetwork: () => Promise<string | ErrorResponse>;
    signMessage: (request: SignMessageRequest) => Promise<SignMessageResponse | ErrorResponse>;
    signTransaction: (
        request: SignTransactionRequest,
    ) => Promise<SignTransactionResponse | ErrorResponse>;
    signVote: (request: SignVoteRequest) => Promise<SignVoteResponse | ErrorResponse>;
    version: () => string;
}

export const initializeInPageHandler = (): ArkConnect => {
    const inPageHandler = new ArkConnectInPageProvider();

    // Credits to Metamask
    // @see https://github.com/MetaMask/providers/blob/main/src/initializeInpageProvider.ts#L63
    const proxiedHandler = new Proxy(inPageHandler, {});

    (window as Record<string, any>).arkconnect = proxiedHandler;
    window.dispatchEvent(new Event('arkconnect#initialized'));

    return proxiedHandler;
};
