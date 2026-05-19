/// <reference types="vitest" />

import { defineConfig } from 'vite';

import { nodePolyfills } from 'vite-plugin-node-polyfills';
import path from 'node:path';
import react from '@vitejs/plugin-react';

// The extension build is owned by wxt (see wxt.config.ts). This config only
// backs the vitest run, so it deliberately drops the web-extension plugin and
// manifest wiring — vitest just needs the React/polyfill plugins and aliases.
// https://vitejs.dev/config/
export default defineConfig(() => {
    return {
        define: {
            'process.env.NODE_DEBUG': process.env.NODE_DEBUG ? true : false,
            'process.env.VITE_SEED_ADDRESSES': process.env.VITE_SEED_ADDRESSES ? true : false,
        },
        plugins: [
            react(),
            nodePolyfills({
                // To add only specific polyfills, add them here. If no option is passed, adds all polyfills
                include: [
                    'buffer',
                    'os',
                    'process',
                    // "fs",
                    'path',
                    'http',
                    'https',
                    // "crypto",
                    'module',
                    'util',
                    'events',
                    'string_decoder',
                    'url',
                ],
                // Whether to polyfill specific globals.
                globals: {
                    Buffer: true, // can also be 'build', 'dev', or false
                    global: true,
                    process: true,
                },
            }),
        ],
        resolve: {
            alias: {
                '@/app': path.resolve(__dirname, 'src'),
                '@': path.resolve(__dirname, 'src'),
            },
        },
        // See https://github.com/vitest-dev/vitest/issues/5555#issuecomment-2062855818
        test: {
            server: {
                deps: {
                    inline: ['@ardenthq/sdk-ledger'],
                },
            },
        },
    };
});
