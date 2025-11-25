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
                exclude: [
                    ...configDefaults.exclude,
                    'src/lib/helpers/**',
                    'src/lib/intl/**',
                    'src/lib/mainsail/**',
                    'src/lib/markets/**',
                    'src/lib/profiles/**',
                    'src/lib/utils/**',
                ],
                setupFiles: ['./vitest.setup.ts'],
                coverage: {
                    thresholds: {
                        lines: 10.62,
                        functions: 0,
                        branches: 0,
                        statements: 10.62,
                    },
                    include: ['src/lib/utils/**'],
                },
            },
        }),
    );
});
