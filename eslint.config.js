import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import importPlugin from 'eslint-plugin-import';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import unicornPlugin from 'eslint-plugin-unicorn';
import sonarjsPlugin from 'eslint-plugin-sonarjs';
import testingLibraryPlugin from 'eslint-plugin-testing-library';
import globals from 'globals';

export default [
    {
        ignores: [
            'dist/**',
            'node_modules/**',
            'coverage/**',
            'src/lib/helpers/**',
            'src/lib/intl/**',
            'src/lib/mainsail/**',
            'src/lib/markets/**',
            'src/lib/profiles/**',
            'src/lib/utils/**',
        ],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    reactPlugin.configs.flat.recommended,
    importPlugin.flatConfigs.errors,
    importPlugin.flatConfigs.warnings,
    importPlugin.flatConfigs.typescript,
    {
        files: ['src/**/*.{js,ts,jsx,tsx}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: { jsx: true },
            },
            globals: {
                ...globals.browser,
                ...globals.es2021,
            },
        },
        plugins: {
            'unused-imports': unusedImportsPlugin,
            unicorn: unicornPlugin,
            sonarjs: sonarjsPlugin,
            'testing-library': testingLibraryPlugin,
        },
        settings: {
            react: { version: 'detect' },
            'import/parsers': {
                '@typescript-eslint/parser': ['.ts', '.tsx'],
            },
            'import/resolver': {
                typescript: {
                    alwaysTryTypes: true,
                    project: './tsconfig.json',
                },
            },
        },
        rules: {
            'comma-dangle': ['error', 'only-multiline'],
            semi: [2, 'always', { omitLastInOneLineBlock: true }],
            quotes: ['warn', 'single'],
            'no-console': ['warn'],
            'no-prototype-builtins': 1,
            camelcase: 1,
            'react/react-in-jsx-scope': 'off',
            'react/jsx-key': 2,
            'react/jsx-uses-vars': 2,
            'react/jsx-no-duplicate-props': 2,
            'react/jsx-no-undef': 2,
            'react/no-deprecated': 2,
            'react/no-direct-mutation-state': 2,
            'react/no-find-dom-node': 2,
            'react/no-is-mounted': 2,
            'react/no-unknown-property': 2,
            'react/require-render-return': 2,
            'no-use-before-define': 0,
            '@typescript-eslint/no-use-before-define': 0,
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/ban-ts-comment': 'warn',
            'unused-imports/no-unused-imports': 'error',
            'unicorn/no-abusive-eslint-disable': 'off',
            'unicorn/consistent-function-scoping': 'off',
            'sonarjs/cognitive-complexity': 'off',
            'testing-library/prefer-explicit-assert': 'off',
            'sonarjs/no-collection-size-mischeck': 'off',
            'sonarjs/no-duplicate-string': 'off',
            'no-unexpected-multiline': 'off',
            'import/order': 'warn',
            'import/default': 'warn',
            'import/extensions': 'off',
            'import/first': 'warn',
            'import/no-absolute-path': 'error',
            'import/no-deprecated': 'error',
            'import/no-duplicates': 'warn',
            'import/no-dynamic-require': 'off',
            'import/no-named-as-default': 'off',
            'import/no-unresolved': 'error',
            'sort-imports': [
                'warn',
                {
                    ignoreCase: true,
                    ignoreDeclarationSort: true,
                },
            ],
        },
    },
];
