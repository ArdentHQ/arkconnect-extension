import { configDefaults, defineConfig } from 'vitest/config';

import { mergeConfig } from 'vite';
import viteConfig from './vite.config';

export default defineConfig((env) => {
    return mergeConfig(
        viteConfig(env),
        defineConfig({
            test: {
                logHeapUsage: true,
                maxConcurrency: 4,
                globals: true,
                environment: 'jsdom',
                exclude: [...configDefaults.exclude],
                setupFiles: ['./vitest.setup.ts'],
                coverage: {
                    thresholds: {
                        lines: 37.97,
                        functions: 40,
                        branches: 79.51,
                        statements: 37.97,
                    },
                    include: ['src/lib/utils/**'],
                },
                deps: {
                    optimizer: {
                        web: {
                            enabled: true,
                            include: ['@ardenthq/sdk-cryptography'],
                        },
                    },
                },
            },
        }),
    );
});
