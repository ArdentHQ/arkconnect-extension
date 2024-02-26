# ARK Connect Extension

## Problem

Users hesitate to input their passphrase on Apps and Web3 platforms due to concerns about security vulnerabilities such as session hijacking or compromised pages. Additionally, there is a need for a secure and convenient way for users to connect their wallet to external platforms, without exposing their passphrase to potential risks.

## Solution

ARK Connect addresses these challenges by providing a browser extension that offers local authentication and signing functionalities. By integrating with ARK's blockchain infrastructure, ARK Connect enables users to securely log in, approve actions, and interact with ARK Ecosystem. ARK Connect acts as a bridge between the user's primary wallet and external platforms, offering a safer and more convenient way for users to authenticate themselves without exposing their passphrase or private keys.

# Development

## This setup includes:

- [vite](https://vitejs.dev/)
- [vite-plugin-web-extension](https://github.com/samrum/vite-plugin-web-extension)
- [webextension-polyfill](https://www.npmjs.com/package/webextension-polyfill)
- [formik](https://formik.org/docs/overview)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [ArdentHQ Platform SDK](https://github.com/ArdentHQ/platform-sdk)
- [crypto js](https://www.npmjs.com/package/crypto-js)
- [ESLint](https://eslint.org/)
- [Styled components](https://styled-components.com/)
- [Styled system](https://styled-system.com/)

## Environment variables

```
VITE_LOCAL_STORAGE_KEY=
VITE_PUBLIC_LOCAL_STORAGE_KEY=
VITE_SENTRY_DNS=
VITE_ENVIRONMENT=
```

- Refer to .env.example for the content of env

## Installation and running instructions

- npm >= 5.0.0
- node >= 16.0.0

Install node dependencies

```
pnpm install
```

Run app:

```
pnpm dev
```

Runs the app in the development mode.

## Build process

Building for Chrome:

```
pnpm build:chrome
```

Building for Firefox:

```
pnpm build:firefox
```

## Add the extension to Chrome

- When the build completes, open Chrome or Edge and navigate to chrome://extensions. Make sure to turn on the developer mode switch.
- Find - Load unpacked extension
- Select - dist folder in this project (after dev or build)

## Add the extension to Firefox

- When the build completes, open Firefox and navigate to about://debugging.
- Click - This Firefox
- Click - Load temporary add-on
- Select - manifest.json from the dist folder

## Supported operating systems and browsers

ARK Connect supports the current and most recent previous major releases of the following browsers:

- Windows
- Mac
- Linux
- Android
- iOS

ARK Connect supports the current and most recent previous major releases of the following browsers:

- Chrome
- Firefox

## Set up your dev environment

When running the app in development mode, you can set testing passphrases in the `.env` file. This will allow you to test the app without having to input your passphrase every time.

For this, you need to add the following environment variable in the .env file:

````
VITE_DEV_PASSPHRASES=
````

> NOTE: Make sure to add the passphrases separated by commas (including spaces between words), just as shown in the example below:
>
>````
>VITE_DEV_PASSPHRASES="passphrase1,passphrase2,passphrase3"
>````


After this, simply run `pnpm dev` and the app will load with the passphrases you've set in the .env file.