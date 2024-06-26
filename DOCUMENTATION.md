# ARK Connect Documentation

> This document is a work in progress

ARK Connect is a JavaScript API that enables communication with the ARK Connect platform via the window object. It provides methods to connect, disconnect, check connectivity status, retrieve network information, wallet address, balance, sign messages, sign transactions, and vote.

## API Methods

All API methods are exposed on a global `window.arkconnect` object that is injected into the page when the extension is active. Note that all requests can throw an `ErrorResponse`.

### `connect(): Promise<void>`

> Requests the user to connect a domain to the extension

```javascript
try {
  const response = await window.arkconnect.connect();
} catch (error) {
  // Handle connection error
}
```

### `isConnected(): Promise<boolean>`

> Determines whether the current domain is connected to the extension

```javascript
try {
  const response = await window.arkconnect.isConnected();
} catch (error) {
  // Handle connection error
}
```

### `disconnect(): Promise<void>`

> Request the user to disconnect the current domain from the extension

```javascript
try {
  const response = await window.arkconnect.disconnect();
} catch (error) {
  // Handle connection error
}
```

### `version(): string`

> Returns the version of the ARK Connect extension

```javascript
const version = window.arkconnect.version();
```

---

### `getNetwork(): Promise<string>`

> Returns a string representation of the network the currently connected address is on

```javascript
try {
  // Returns either 'Mainnet' or 'Devnet'
  const response = await window.arkconnect.getNetwork();
} catch (error) {
  // Handle connection error
}
```

### `getAddress(): Promise<string>`

> Returns a string representation of the currently connected address

```javascript
try {
  const response = await window.arkconnect.getAddress();
} catch (error) {
  // Handle connection error
}
```

### `getBalance(): Promise<string>`

> Returns a string representation of the currently connected address' balance in ARK/DARK.

```javascript
try {
  const response = await window.arkconnect.getBalance();
} catch (error) {
  // Handle connection error
}
```

---

### `signMessage(request: SignMessageRequest): Promise<SignMessageResponse>`

> Request the user to sign a given message

```javascript
type SignMessageRequest = {
  message: string;
}

type SignMessageResponse = {
  message: string;
  signatory: string;
  signature: string;
}

const messageRequest = {
    message: 'The message you like to sign',
}

try {
  const response = await window.arkconnect.signMessage(messageRequest);
} catch (error) {
  // Handle connection error
}
```

### `signTransaction(request: SignTransactionRequest): Promise<SignTransactionResponse>`

> Request the user to sign a given transaction

```javascript
type SignTransactionRequest = {
  amount: number;
  receiverAddress: string;
  memo?: string;
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

const transactionRequest = {
  amount: 100,
  receiverAddress: 'D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ax',
};

try {
  const response = await window.arkconnect.signTransaction(transactionRequest);
} catch (error) {
  // Handle connection error
}
```

### `signVote(request: SignVoteRequest): Promise<SignVoteResponse>`

> Request the user to sign a vote transaction (vote, unvote or vote swap)

```javascript
type SignVoteRequest = {
  vote?: {
    amount: number;
    address: string;
  };
  unvote?: {
    amount: number;
    address: string;
  };
};

type SignVoteResponse = {
  id: string;
  sender: string;
  voteAddress?: string;
  voteName?: string;
  votePublicKey?: string;
  unvoteAddress?: string;
  unvoteName?: string;
  unvotePublicKey?: string;
  exchangeCurrency: string;
  exchangeCurrency: string;
  fee: number;
  convertedFee: number;
};

const voteRequest = {
  vote: {
    amount: 100,
    address: 'DJmvhhiQFSrEQCq9FUxvcLcpcBjx7K3yLt',
  },
};

try {
  const response = await window.arkconnect.signVote(voteRequest);
} catch (error) {
  // Handle connection error
}
```

## Events

You can subscribe to events emitted by the extension to handle changes as the occur. The following list of events are currently available.

### `on.connected`

> Emitted when an address connects to the domain

```javascript
window.arkconnect?.on('connected', (data) => {
  // Handle data: { type: 'connected' }
});
```

### `on.disconnected`

> Emitted when an address disconnects from the domain

```javascript
window.arkconnect?.on('disconnected', (data) => {
  // Handle data: { type: 'disconnected' }
});
```

### `on.addressChanged`

> Emitted when the primary address in the extension changes

```javascript
window.arkconnect?.on('addressChanged', (data) => {
  // Handle data: { type: 'addressChanged', data: { wallet: { network: 'Mainnet|Devnet', address: <string>, coin: 'ARK' } } }
});
```

### `on.lockToggled`

> Emitted when the extension locks / unlocks

```javascript
window.arkconnect?.on('lockToggled', (data) => {
  // Handle data: { type: 'lockToggled', data: { isLocked: boolean } }
});
```

## Error Responses

The error response that can be returned by the API calls

```javascript
type ErrorResponse = {
  status: 'failed';
  domain: string;
  message: string;
  tabId: number;
};
```
