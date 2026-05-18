import { resolve } from 'node:path';
import { defineConfig } from 'wxt';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import pkg from './package.json';

const srcDir = resolve(__dirname, 'src');

// Wraps the injected inpage script in an IIFE so it doesn't leak into the
// page's global scope. Ported from the old vite.production.config.ts plugin.
let hasProcessedInPage = false;
const makeInpageScriptIife = {
    name: 'make-inpage-script-in-iife',
    generateBundle(_outputOptions: unknown, bundle: Record<string, any>) {
        for (const fileName of Object.keys(bundle)) {
            const file = bundle[fileName];
            if (!hasProcessedInPage && fileName.includes('inpage') && 'code' in file) {
                file.code = `(() => {\n${file.code}})()`;
                hasProcessedInPage = true;
            }
        }
    },
};

// https://wxt.dev/api/config.html
export default defineConfig({
    modules: ['@wxt-dev/module-react'],
    srcDir: '.',
    outDir: 'dist',
    // vite-node runs the vite pipeline (incl. nodePolyfills) when analyzing
    // entrypoints, which breaks WXT's internal fetch. jiti sidesteps that.
    entrypointLoader: 'jiti',
    alias: {
        '@/app': srcDir,
        '@': srcDir,
    },
    manifest: {
        name: pkg.name,
        description: pkg.description,
        version: pkg.version,
        // NOTE: permissions / web_accessible_resources / commands are ported
        // properly in the "port manifests to wxt" subtask.
        permissions: [
            'activeTab',
            'storage',
            'clipboardWrite',
            'tabs',
            'unlimitedStorage',
            'commands',
        ],
    },
    vite: (env) => ({
        define: {
            'process.env.NODE_DEBUG': process.env.NODE_DEBUG ? true : false,
            'process.env.VITE_SEED_ADDRESSES': process.env.VITE_SEED_ADDRESSES ? true : false,
        },
        plugins: [
            nodePolyfills({
                // protocol import handling confuses WXT's vite-node loader
                protocolImports: false,
                include: [
                    'buffer',
                    'os',
                    'process',
                    'path',
                    'http',
                    'https',
                    'module',
                    'util',
                    'events',
                    'string_decoder',
                    'url',
                ],
                globals: {
                    Buffer: true,
                    global: true,
                    // dev kept process:true, prod build used process:false
                    process: env.command === 'serve',
                },
            }),
            makeInpageScriptIife,
        ],
        optimizeDeps: {
            esbuildOptions: {
                target: 'es2020',
            },
        },
        build: {
            target: 'es2020',
        },
    }),
});
