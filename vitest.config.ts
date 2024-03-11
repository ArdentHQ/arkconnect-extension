import { mergeConfig } from 'vite';
import { configDefaults, defineConfig } from 'vitest/config';
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
                        lines: 29.99,
                        functions: 14.75,
                        branches: 44.58,
                        statements: 29.99,
                    },
                },
            },
        }),
    );
});
