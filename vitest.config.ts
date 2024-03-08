import { mergeConfig } from 'vite';
import { configDefaults, defineConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default defineConfig((env) => {
    return mergeConfig(
        viteConfig(env),
        defineConfig({
            test: {
                logHeapUsage: true,
                maxConcurrency: 8,
                globals: true,
                environment: 'jsdom',
                // @TODO: Just use utils for now, until performance issue is fixed and more tests are added.
                exclude: [...configDefaults.exclude],
                setupFiles: ['./vitest.setup.ts'],
            },
        }),
    );
});

// export default mergeConfig(
//     viteConfig(),
//     defineConfig({
//         test: {
//             logHeapUsage: true,
//             maxConcurrency: 3,
//             globals: true,
//             environment: 'jsdom',
//             // @TODO: Just use utils for now, until performance issue is fixed and more tests are added.
//             include: ['src/lib'],
//             exclude: [
//                 ...configDefaults.exclude,
//                 'src/css',
//                 'src/assets',
//                 'src/tests',
//                 'manifest.chrome.json',
//                 'manifest.firefox.json',
//                 'vite-env.d.ts',
//                 'main.css',
//             ],
//             setupFiles: ['./vitest.setup.ts'],
//         },
//         resolve: {
//             alias: {
//                 '@': path.resolve(__dirname, './resources/js'),
//             },
//         },
//     }),
// );
