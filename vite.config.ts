/// <reference types="vitest" />

import webExtension from 'vite-plugin-web-extension';

import chromeManifest from './src/manifest.chrome.json';
import firefoxManifest from './src/manifest.firefox.json';
import pkg from './package.json';

import { defineConfig, loadEnv } from 'vite';
import path from 'node:path';
import react from '@vitejs/plugin-react';

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
        test: {
            environment: 'jsdom',
            setupFiles: ['./vitest.setup.ts'],
        },
    };
});
