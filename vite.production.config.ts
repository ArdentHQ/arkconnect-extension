import chromeManifest from './src/manifest.chrome.json';
import { defineConfig } from 'vite';
import firefoxManifest from './src/manifest.firefox.json';
import pkg from './package.json';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import webExtension from '@samrum/vite-plugin-web-extension';

const rootDir = resolve(__dirname);
const outDir = resolve(rootDir, 'dist');
const publicDir = resolve(rootDir, 'public');
const srcDir = resolve(__dirname, 'src');
const manifest = process.env.BROWSER === 'firefox' ? firefoxManifest : chromeManifest;

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
          utils: ['semver', 'yup', 'uuid', 'assert', 'p-retry', 'string-hash', 'socks-proxy-agent'],
          crypto: ['crypto-js'],
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
            'react-refresh',
            'locale-currency',
            'react-redux',
            'redux-persist',
            '@reduxjs/toolkit',
            'formik',
          ],
          'styled-system': [
            'styled-components',
            'styled-system',
            '@styled-system/should-forward-prop',
          ],
        },
      },
    },
  },
});
