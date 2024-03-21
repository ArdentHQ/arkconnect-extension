import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import webExtension from '@samrum/vite-plugin-web-extension';
import chromeManifest from './src/manifest.chrome.json';
import firefoxManifest from './src/manifest.firefox.json';
import pkg from './package.json';

const rootDir = resolve(__dirname);
const outDir = resolve(rootDir, 'dist');
const publicDir = resolve(rootDir, 'public');
const srcDir = resolve(__dirname, 'src');
const manifest = process.env.BROWSER === 'firefox' ? firefoxManifest : chromeManifest;

let hasProcessedInPage = false;

export default defineConfig({
    resolve: {
        alias: {
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
    build: {
        outDir,
        minify: true,
        modulePreload: false,
        reportCompressedSize: true,
        emptyOutDir: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    utils: ['semver', 'yup', 'uuid', 'assert', 'p-retry', 'string-hash'],
                    sdk: ['@ardenthq/sdk'],
                    'sdk-ark': ['@ardenthq/sdk-ark'],
                    'sdk-cryptography': ['@ardenthq/sdk-cryptography'],
                    'sdk-helpers': ['@ardenthq/sdk-helpers'],
                    'sdk-intl': ['@ardenthq/sdk-intl'],
                    'sdk-ledger': ['@ardenthq/sdk-ledger'],
                    'sdk-profiles': ['@ardenthq/sdk-profiles'],
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
                },
            },
        },
    },
});
