const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-dm-sans)', ...defaultTheme.fontFamily.sans],
      },
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
      'theme-primary-100':
        'rgb(var(--theme-color-primary-100) / <alpha-value>)',
      'theme-primary-200':
        'rgb(var(--theme-color-primary-200) / <alpha-value>)',
      'theme-primary-300':
        'rgb(var(--theme-color-primary-300) / <alpha-value>)',
      'theme-primary-400':
        'rgb(var(--theme-color-primary-400) / <alpha-value>)',
      'theme-primary-500':
        'rgb(var(--theme-color-primary-500) / <alpha-value>)',
      'theme-primary-600':
        'rgb(var(--theme-color-primary-600) / <alpha-value>)',
      'theme-primary-650':
        'rgb(var(--theme-color-primary-650) / <alpha-value>)',
      'theme-primary-700':
        'rgb(var(--theme-color-primary-700) / <alpha-value>)',
      'theme-primary-800':
        'rgb(var(--theme-color-primary-800) / <alpha-value>)',
      'theme-primary-900':
        'rgb(var(--theme-color-primary-900) / <alpha-value>)',
      'theme-primary-950':
        'rgb(var(--theme-color-primary-950) / <alpha-value>)',

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
      'theme-warning-100':
        'rgb(var(--theme-color-warning-100) / <alpha-value>)',
      'theme-warning-200':
        'rgb(var(--theme-color-warning-200) / <alpha-value>)',
      'theme-warning-300':
        'rgb(var(--theme-color-warning-300) / <alpha-value>)',
      'theme-warning-400':
        'rgb(var(--theme-color-warning-400) / <alpha-value>)',
      'theme-warning-500':
        'rgb(var(--theme-color-warning-500) / <alpha-value>)',
      'theme-warning-600':
        'rgb(var(--theme-color-warning-600) / <alpha-value>)',
      'theme-warning-700':
        'rgb(var(--theme-color-warning-700) / <alpha-value>)',
      'theme-warning-800':
        'rgb(var(--theme-color-warning-800) / <alpha-value>)',
      'theme-warning-900':
        'rgb(var(--theme-color-warning-900) / <alpha-value>)',

    }
  },
  plugins: [],
};

