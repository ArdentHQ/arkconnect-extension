const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{js,ts,jsx,tsx,css}'],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-dm-sans)', ...defaultTheme.fontFamily.sans],
            },
            spacing: {
                3.5: '0.875rem',
                4.5: '1.125rem',
                13: '3.25rem',
                23: '5.75rem',
                30: '7.5rem',
                50: '12.5rem',
            },
            boxShadow: {
                light: '0 1px 4px 0 rgba(0, 0, 0, 0.05)',
                dark: '0 1px 4px 0 rgba(165, 165, 165, 0.08)',
                dropdown:
                    '0 4px 6px -2px rgba(16, 24, 40, 0.03), 0 12px 16px -4px rgba(16, 24, 40, 0.08)',
                'action-details': 'inset 0 0 0 1px  var(--theme-color-secondary-200)',
                'action-details-dark': 'inset 0 0 0 1px  var(--theme-color-secondary-700)',
            },
            maxWidth: {
                'extension-screen': '370px',
            },
            width: {
                'extension-screen': '370px',
            },
            keyframes: {
                fadeInAndTransform: {
                  '0%': { opacity: '0', transform: 'translateY(10px)' },
                  '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                scale: {
                    '0%': { transform: 'scale(1)' },
                    '100%': { transform: 'scale(0.9)' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(0)' },
                    '100%': { transform: 'translateY(-100%)' },
                },
                decreaseHeight: {
                    '0%': { height: '200px' },
                    '50%': { height: '100px' },
                    '75%': { height: '80px' },
                    '100%': { height: '60px' },
                },
                translateUp: {
                    '0%': { transform: 'translateY(100%)' },
                    '100%': { transform: 'translateY(0%)' },
                },
            },
            animation: {
                slideUp: 'slideUp 1.2s ease-in-out 1.8s forwards',
                fadeInTransformAndScale: 'fadeInAndTransform 0.8s ease-in-out forwards, scale 0.4s ease-in-out 1s forwards',
                translateUp: 'translateUp 0.5s ease-in-out 2s forwards',
                decreaseHeight: 'decreaseHeight 0.5s ease-in-out 2s forwards',
            }
        },
        colors: {
            transparent: 'transparent',
            black: 'rgb(var(--theme-color-black) / <alpha-value>)',
            'subtle-black': 'rgb(var(--theme-color-subtle-black) / <alpha-value>)',
            'light-black': 'rgb(var(--theme-color-light-black) / <alpha-value>)',

            white: 'rgb(var(--theme-color-white) / <alpha-value>)',
            'subtle-white': 'rgb(var(--theme-color-subtle-white) / <alpha-value>)',

            // primary
            'theme-primary-50': 'rgb(var(--theme-color-primary-50) / <alpha-value>)',
            'theme-primary-100': 'rgb(var(--theme-color-primary-100) / <alpha-value>)',
            'theme-primary-200': 'rgb(var(--theme-color-primary-200) / <alpha-value>)',
            'theme-primary-300': 'rgb(var(--theme-color-primary-300) / <alpha-value>)',
            'theme-primary-400': 'rgb(var(--theme-color-primary-400) / <alpha-value>)',
            'theme-primary-500': 'rgb(var(--theme-color-primary-500) / <alpha-value>)',
            'theme-primary-600': 'rgb(var(--theme-color-primary-600) / <alpha-value>)',
            'theme-primary-650': 'rgb(var(--theme-color-primary-650) / <alpha-value>)',
            'theme-primary-700': 'rgb(var(--theme-color-primary-700) / <alpha-value>)',
            'theme-primary-800': 'rgb(var(--theme-color-primary-800) / <alpha-value>)',
            'theme-primary-900': 'rgb(var(--theme-color-primary-900) / <alpha-value>)',
            'theme-primary-950': 'rgb(var(--theme-color-primary-950) / <alpha-value>)',

            // secondary
            'theme-secondary-25': 'rgb(var(--theme-color-secondary-25) / <alpha-value>)',
            'theme-secondary-50': 'rgb(var(--theme-color-secondary-50) / <alpha-value>)',
            'theme-secondary-100': 'rgb(var(--theme-color-secondary-100) / <alpha-value>)',
            'theme-secondary-200': 'rgb(var(--theme-color-secondary-200) / <alpha-value>)',
            'theme-secondary-300': 'rgb(var(--theme-color-secondary-300) / <alpha-value>)',
            'theme-secondary-400': 'rgb(var(--theme-color-secondary-400) / <alpha-value>)',
            'theme-secondary-500': 'rgb(var(--theme-color-secondary-500) / <alpha-value>)',
            'theme-secondary-600': 'rgb(var(--theme-color-secondary-600) / <alpha-value>)',
            'theme-secondary-700': 'rgb(var(--theme-color-secondary-700) / <alpha-value>)',
            'theme-secondary-800': 'rgb(var(--theme-color-secondary-800) / <alpha-value>)',
            'theme-secondary-900': 'rgb(var(--theme-color-secondary-900) / <alpha-value>)',

            // error
            'theme-error-25': 'rgb(var(--theme-color-error-25) / <alpha-value>)',
            'theme-error-50': 'rgb(var(--theme-color-error-50) / <alpha-value>)',
            'theme-error-100': 'rgb(var(--theme-color-error-100) / <alpha-value>)',
            'theme-error-200': 'rgb(var(--theme-color-error-200) / <alpha-value>)',
            'theme-error-300': 'rgb(var(--theme-color-error-300) / <alpha-value>)',
            'theme-error-400': 'rgb(var(--theme-color-error-400) / <alpha-value>)',
            'theme-error-500': 'rgb(var(--theme-color-error-500) / <alpha-value>)',
            'theme-error-600': 'rgb(var(--theme-color-error-600) / <alpha-value>)',
            'theme-error-700': 'rgb(var(--theme-color-error-700) / <alpha-value>)',
            'theme-error-800': 'rgb(var(--theme-color-error-800) / <alpha-value>)',
            'theme-error-900': 'rgb(var(--theme-color-error-900) / <alpha-value>)',

            // warning
            'theme-warning-25': 'rgb(var(--theme-color-warning-25) / <alpha-value>)',
            'theme-warning-50': 'rgb(var(--theme-color-warning-50) / <alpha-value>)',
            'theme-warning-100': 'rgb(var(--theme-color-warning-100) / <alpha-value>)',
            'theme-warning-200': 'rgb(var(--theme-color-warning-200) / <alpha-value>)',
            'theme-warning-300': 'rgb(var(--theme-color-warning-300) / <alpha-value>)',
            'theme-warning-400': 'rgb(var(--theme-color-warning-400) / <alpha-value>)',
            'theme-warning-500': 'rgb(var(--theme-color-warning-500) / <alpha-value>)',
            'theme-warning-600': 'rgb(var(--theme-color-warning-600) / <alpha-value>)',
            'theme-warning-700': 'rgb(var(--theme-color-warning-700) / <alpha-value>)',
            'theme-warning-800': 'rgb(var(--theme-color-warning-800) / <alpha-value>)',
            'theme-warning-900': 'rgb(var(--theme-color-warning-900) / <alpha-value>)',
        },
    },
    plugins: [],
};
