import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import webExtension from '@samrum/vite-plugin-web-extension';
import chromeManifest from './src/manifest.chrome.json';
import firefoxManifest from './src/manifest.firefox.json';
import pkg from './package.json';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

const rootDir = resolve(__dirname);
const outDir = resolve(rootDir, 'dist');
const publicDir = resolve(rootDir, 'public');
const srcDir = resolve(__dirname, 'src');
const manifest = process.env.BROWSER === 'firefox' ? firefoxManifest : chromeManifest;

let hasProcessedInPage = false;

export default defineConfig({
    resolve: {
        alias: {
            '@/app': srcDir,
            '@': srcDir,
        },
    },
    plugins: [
        react(),
        webExtension({
            manifest: {
                name: pkg.name,
                description: pkg.description,
                version: pkg.version,
                ...manifest,
            },
            additionalInputs: {
                scripts: ['src/inpage.ts'],
            },
        }),
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
                process: false,
            },
        }),
        {
            name: 'make-inpage-script-in-iife',
            generateBundle(outputOptions, bundle) {
                Object.keys(bundle).forEach((fileName) => {
                    const file = bundle[fileName];
                    if (!hasProcessedInPage && fileName.includes('inpage') && 'code' in file) {
                        file.code = `(() => {\n${file.code}})()`;
                        hasProcessedInPage = true;
                    }
                });
            },
        },
    ],
    publicDir,
    optimizeDeps: {
        esbuildOptions: {
            target: 'es2020',
        },
    },
    build: {
        target: 'es2020',
        outDir,
        minify: true,
        modulePreload: false,
        reportCompressedSize: true,
        emptyOutDir: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    utils: ['semver', 'yup', 'uuid', 'assert', 'p-retry', 'string-hash'],
                    'sdk-ledger': ['@ardenthq/sdk-ledger'],
                    sentry: ['@sentry/react'],
                    react: [
                        'react',
                        'react-dom',
                        'react-router-dom',
                        'locale-currency',
                        'react-redux',
                        'redux-persist',
                        '@reduxjs/toolkit',
                        'formik',
                    ],
                    'arkvault-crypto': ['@ardenthq/arkvault-crypto'],
                },
            },
        },
    },
});
