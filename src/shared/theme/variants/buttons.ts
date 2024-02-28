import { theme } from '../index';
import { makeVariant } from './_utils';

/**
 * NOTE: Temp content for example purposes
 */

const buttonVariantConfig = {
    prop: 'variant' as const,
    variants: {
        primary: {
            bg: theme.colors.primary,
            color: theme.colors.white,
            borderRadius: '64px',
        },
        secondary: {
            bg: theme.colors.black,
            color: theme.colors.white,
            borderRadius: '64px',
        },
    } as const,
};

export const { variant: buttonVariant, defaultProps: defaultButtonProps } = makeVariant(
    buttonVariantConfig,
    'primary',
);
