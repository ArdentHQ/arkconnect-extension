import { ExtensionSupportedEvents } from './lib/events';

(function () {
  let abortController: null | AbortController = null;

  // Inline used methods to avoid clashes with other JS scripts
  const getLogoOrFaviconUrl = () => {
    let iconUrl = undefined;

    // First, try searching for a logo in image tags.
    const imageTags = document.getElementsByTagName('img');
    for (let i = 0; i < imageTags.length; i++) {
      if (imageTags[i].src?.toLowerCase().includes('logo')) {
        iconUrl = imageTags[i].src;
        break; // Stop searching if a logo is found.
      }
    }

    // If no logo is found, try searching for a favicon in 'link' elements.
    if (!iconUrl) {
      const nodeList = document.getElementsByTagName('link');
      for (let i = 0; i < nodeList.length; i++) {
        const rel = nodeList[i].getAttribute('rel');
        const href = nodeList[i].getAttribute('href');
        if (rel === 'icon' || rel === 'shortcut icon' || href?.includes('favicon')) {
          iconUrl = href;
          break; // Stop searching if a favicon is found.
        }
      }
    }

    if (iconUrl) {
      return iconUrl.startsWith('http') ? iconUrl : window.location.origin + iconUrl;
    }

    return null; // Return null if neither a logo nor a favicon is found.
  };

  const isValidObjectByType = <T>(object: any, type: T): object is T => {
    for (const key in type) {
      if (typeof object[key] === 'object') {
        return isValidObjectByType(object[key], type[key]);
      }
      if (!(key in object) || typeof object[key] !== typeof type[key]) {
        return false;
      }
    }
    return true;
  };

  const assertPositiveNonZero = (amount: unknown, maxDecimals: number = 8) => {
    if (typeof amount !== 'number') {
      throw new Error(`Expected 'amount' to be a number, but received ${amount}`);
    }

    if (amount <= 0) {
      throw new Error(`Expected 'amount' to be a positive number greater than 0, but received ${amount}`);
    }

    const amountStr = amount.toString();
    const decimalIndex = amountStr.indexOf('.');

    if (decimalIndex !== -1) {
      const decimals = amountStr.length - decimalIndex - 1;
      if (decimals > maxDecimals) {
        throw new Error(`Expected 'amount' to have no more than ${maxDecimals} decimal places, but received ${amount}`);
      }
    }
  }


  enum WalletNetwork {
    DEVNET = 'Devnet',
    MAINNET = 'Mainnet',
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
  } & NetworkType;

  type SignMessageResponse = {
    message: string;
    signatory: string;
    signature: string;
    network?: WalletNetwork;
  };

  type SignTransactionRequest = {
    amount: number;
    receiverAddress: string;
  } & NetworkType;

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
    network?: WalletNetwork;
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
  } & NetworkType;

  type SignVoteResponse = {
    id: string;
    sender: string;
    delegate: string;
    exchangeCurrency: string;
    fee: number;
    convertedFee: number;
  } & NetworkType;

  const exampleSignVoteRequest: SignVoteRequest = {
    vote: {
      amount: 1,
      delegateAddress: 'xxx',
    },
  };
  const exampleSignUnvoteRequest: SignVoteRequest = {
    unvote: {
      amount: 1,
      delegateAddress: 'xxx',
    },
  };

  const exampleSignTransactionRequest: SignTransactionRequest = {
    amount: 1,
    receiverAddress: 'xxx',
  };

  const exampleSignMessageRequest: SignMessageRequest = {
    message: 'xxx',
  };

  const on = (eventName: typeof ExtensionSupportedEvents, callback: (data: any) => void) => {
    const eventListener = (event: MessageEvent) => {
      if (event.source !== window || !event.data.type) {
        return;
      }

      if (event.data.type !== eventName) {
        return;
      }

      if (callback) {
        callback?.(event.data);
      }
    };

    window.addEventListener('message', eventListener, false);
  };

  const connect = (request: NetworkType) => {
    return new Promise(
      (resolve: (data: ConnectResponse) => void, reject: (error: ErrorResponse) => void) => {
        const eventListener = (event: MessageEvent) => {
          if (event.source !== window || !event.data.type) {
            return;
          }

          if (event.data.type === 'CONNECT_RESOLVE') {
            window.removeEventListener('message', eventListener);

            resolve(event.data.data);
            return;
          }

          if (event.data.type === 'CONNECT_REJECT') {
            window.removeEventListener('message', eventListener);

            reject(event.data.data);
            return;
          }
        };

        window.addEventListener('message', eventListener, false);

        window.postMessage(
          {
            type: 'CONNECT',
            data: {
              domain: window.location.origin,
              favicon: getLogoOrFaviconUrl(),
              network: request?.network ?? WalletNetwork.MAINNET,
            },
          },
          '*',
        );
      },
    );
  };

  const isConnected = () => {
    return new Promise(
      (resolve: (data: boolean) => void, reject: (error: ErrorResponse) => void) => {
        const eventListener = (event: MessageEvent) => {
          if (event.source !== window || !event.data.type) {
            return;
          }

          if (event.data.type === 'IS_CONNECTED_RESOLVE') {
            resolve(event.data.data.isConnected);

            window.removeEventListener('message', eventListener);
            return;
          }

          if (event.data.type === 'IS_CONNECTED_REJECT') {
            reject(event.data.data);

            window.removeEventListener('message', eventListener);
            return;
          }
        };

        window.addEventListener('message', eventListener, false);

        window.postMessage(
          {
            type: 'IS_CONNECTED',
            data: {
              domain: window.location.origin,
            },
          },
          '*',
        );
      },
    );
  };

  const disconnect = () => {
    return new Promise(
      (resolve: (data: DisconnectResponse) => void, reject: (error: ErrorResponse) => void) => {
        const eventListener = (event: MessageEvent) => {
          if (event.source !== window || !event.data.type) {
            return;
          }
          if (event.data.type === 'DISCONNECT_RESOLVE') {
            resolve(event.data.data);

            window.removeEventListener('message', eventListener);
            return;
          }

          if (event.data.type === 'DISCONNECT_REJECT') {
            reject(event.data.data);

            window.removeEventListener('message', eventListener);
            return;
          }
        };

        window.addEventListener('message', eventListener, false);

        window.postMessage(
          {
            type: 'DISCONNECT',
            data: {
              domain: window.location.origin,
            },
          },
          '*',
        );
      },
    );
  };

  const getNetwork = () => {
    return new Promise(
      (resolve: (data: string) => void, reject: (error: ErrorResponse) => void) => {
        const eventListener = (event: MessageEvent) => {
          if (event.source !== window || !event.data.type) {
            return;
          }

          if (event.data.type === 'GET_NETWORK_RESOLVE') {
            resolve(event.data.data.network);

            window.removeEventListener('message', eventListener);
            return;
          }

          if (event.data.type === 'GET_NETWORK_REJECT') {
            reject(event.data.data);

            window.removeEventListener('message', eventListener);
            return;
          }
        };

        window.addEventListener('message', eventListener, false);

        window.postMessage(
          {
            type: 'GET_NETWORK',
            data: {
              domain: window.location.origin,
            },
          },
          '*',
        );
      },
    );
  };

  const getAddress = () => {
    return new Promise(
      (resolve: (data: string) => void, reject: (error: ErrorResponse) => void) => {
        const eventListener = (event: MessageEvent) => {
          if (event.source !== window || !event.data.type) {
            return;
          }

          if (event.data.type === 'GET_ADDRESS_RESOLVE') {
            resolve(event.data.data.address);

            window.removeEventListener('message', eventListener);
            return;
          }

          if (event.data.type === 'GET_ADDRESS_REJECT') {
            reject(event.data.data);

            window.removeEventListener('message', eventListener);
            return;
          }
        };

        window.addEventListener('message', eventListener, false);

        window.postMessage(
          {
            type: 'GET_ADDRESS',
            data: {
              domain: window.location.origin,
            },
          },
          '*',
        );
      },
    );
  };

  const getBalance = () => {
    return new Promise(
      (resolve: (data: string) => void, reject: (error: ErrorResponse) => void) => {
        const eventListener = (event: MessageEvent) => {
          if (event.source !== window || !event.data.type) {
            return;
          }

          if (event.data.type === 'GET_BALANCE_RESOLVE') {
            resolve(event.data.data.balance);

            window.removeEventListener('message', eventListener);
            return;
          }

          if (event.data.type === 'GET_BALANCE_REJECT') {
            reject(event.data.data);

            window.removeEventListener('message', eventListener);
            return;
          }
        };

        window.addEventListener('message', eventListener, false);

        window.postMessage(
          {
            type: 'GET_BALANCE',
            data: {
              domain: window.location.origin,
            },
          },
          '*',
        );
      },
    );
  };

  const signMessage = (request: SignMessageRequest) => {
    return new Promise(
      (resolve: (data: SignMessageResponse) => void, reject: (error: ErrorResponse) => void) => {
        if (!isValidObjectByType<SignMessageRequest>(request, exampleSignMessageRequest)) {
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

        if (abortController) {
          abortController.abort();
        }

        abortController = new AbortController();
        const signal = abortController.signal;

        const eventListener = (event: MessageEvent) => {
          if (event.source !== window || !event.data.type) {
            return;
          }

          if (event.data.type === 'SIGN_MESSAGE_RESOLVE') {
            resolve({
              message: event.data.data.message,
              signatory: event.data.data.signatory,
              signature: event.data.data.signature,
            });

            window.removeEventListener('message', eventListener);
            return;
          }

          if (event.data.type === 'SIGN_MESSAGE_REJECT') {
            reject(event.data.data);

            window.removeEventListener('message', eventListener);
            return;
          }
        };

        window.addEventListener('message', eventListener, {
          signal,
        });

        window.postMessage(
          {
            type: 'SIGN_MESSAGE',
            data: {
              ...request,
              network: request?.network ?? WalletNetwork.MAINNET,
              type: 'signature',
              domain: window.location.origin,
            },
          },
          '*',
        );
      },
    );
  };

  const signTransaction = (request: SignTransactionRequest) => {
    return new Promise(
      (
        resolve: (data: SignTransactionResponse) => void,
        reject: (error: ErrorResponse) => void,
      ) => {
        if (!isValidObjectByType<SignTransactionRequest>(request, exampleSignTransactionRequest)) {
          reject({
            domain: window.location.origin,
            status: 'failed',
            message: 'Provided arguments does not match type `SignTransactionRequest`',
          });
          return;
        }

        try {
          assertPositiveNonZero(request.amount);
        } catch (error: unknown) {
          reject({
            domain: window.location.origin,
            status: 'failed',
            message: error instanceof Error ? error.message : '',
          });
          return;
        }

        const eventListener = (event: MessageEvent) => {
          if (event.source !== window || !event.data.type) {
            return;
          }

          if (event.data.type === 'SIGN_TRANSACTION_RESOLVE') {
            resolve(event.data.data.transaction);

            window.removeEventListener('message', eventListener);
            return;
          }

          if (event.data.type === 'SIGN_TRANSACTION_REJECT') {
            reject(event.data.data);

            window.removeEventListener('message', eventListener);
            return;
          }
        };

        window.addEventListener('message', eventListener, false);

        window.postMessage(
          {
            type: 'SIGN_TRANSACTION',
            data: {
              ...request,
              network: request?.network ?? WalletNetwork.MAINNET,
              type: 'transfer',
              domain: window.location.origin,
            },
          },
          '*',
        );
      },
    );
  };

  const signVote = (request: SignVoteRequest) => {
    return new Promise(
      (resolve: (data: SignVoteResponse) => void, reject: (error: ErrorResponse) => void) => {
        if (
          !isValidObjectByType<SignVoteRequest>(request, exampleSignVoteRequest) &&
          !isValidObjectByType<SignVoteRequest>(request, exampleSignUnvoteRequest)
        ) {
          reject({
            domain: window.location.origin,
            status: 'failed',
            message: 'Provided arguments does not match type `SignVoteRequest`',
          });
          return;
        }

        const eventListener = (event: MessageEvent) => {
          if (event.source !== window || !event.data.type) {
            return;
          }

          if (event.data.type === 'SIGN_VOTE_RESOLVE') {
            resolve(event.data.data.vote);

            window.removeEventListener('message', eventListener);
            return;
          }

          if (event.data.type === 'SIGN_VOTE_REJECT') {
            reject(event.data.data);

            window.removeEventListener('message', eventListener);
            return;
          }
        };

        window.addEventListener('message', eventListener, false);

        window.postMessage(
          {
            type: 'SIGN_VOTE',
            data: {
              ...request,
              network: request?.network ?? WalletNetwork.MAINNET,
              type: request.vote ? 'vote' : 'unvote',
              domain: window.location.origin,
            },
          },
          '*',
        );
      },
    );
  };

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
  }

  const arkconnect: ArkConnect = {
    loaded: true,
    connect,
    isConnected,
    disconnect,
    getNetwork,
    getAddress,
    getBalance,
    signMessage,
    signTransaction,
    signVote,
    on,
  };

  Object.defineProperty(window, 'arkconnect', {
    value: arkconnect,
    enumerable: true,
    configurable: false,
    writable: false,
  });
})();
