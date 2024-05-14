/// <reference types="vitest" />

import { defineConfig, loadEnv } from 'vite';

import chromeManifest from './src/manifest.chrome.json';
import firefoxManifest from './src/manifest.firefox.json';
import path from 'node:path';
import pkg from './package.json';
import react from '@vitejs/plugin-react';
import webExtension from 'vite-plugin-web-extension';

const manifest = process.env.BROWSER === 'firefox' ? firefoxManifest : chromeManifest;

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }; // Combine passed vars + .env

    return {
        define: {
            'process.env.NODE_DEBUG': process.env.NODE_DEBUG ? true : false,
            'process.env.VITE_SEED_ADDRESSES': process.env.VITE_SEED_ADDRESSES ? true : false,
        },
        plugins: [
            react(),
            webExtension({
                manifest: () => {
                    return {
                        name: pkg.name,
                        description: pkg.description,
                        version: pkg.version,
                        ...manifest,
                    };
                },
                additionalInputs: ['src/inpage.ts'],
                webExtConfig: {
                    startUrl: process.env.VITE_START_URL ?? 'about:blank',
                    firefox: process.env.VITE_FIREFOX_BINARY,
                },
                browser: process.env.BROWSER || 'chrome',
                skipManifestValidation: true,
            }),
        ],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
            },
        },
        // See https://github.com/vitest-dev/vitest/issues/5555#issuecomment-2062855818
        test: {
            server: {
                deps: {
                    inline: [
                        '@ardenthq/sdk',
                        '@ardenthq/sdk-ark',
                        '@ardenthq/sdk-cryptography',
                        '@ardenthq/sdk-helpers',
                        '@ardenthq/sdk-intl',
                        '@ardenthq/sdk-ledger',
                        '@ardenthq/sdk-profiles',
                    ],
                },
            },
        },
    };
});
