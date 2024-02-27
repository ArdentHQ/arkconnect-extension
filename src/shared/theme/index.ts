import layout from './categories/layout';
import color from './categories/color';
import typography from './categories/typography';
import border from './categories/border';
import transition from './categories/transition';
import shadows from './categories/shadow';
import browserCompatibility from './categories/browserCompatibility';

/**
 * The theme for the entire frontend. Should contain all properties
 * required to effectively design components. If anything is missing,
 * add it to the theme instead of creating a one-off style.
 *
 * The theme follows the styled-system theme specification: https://styled-system.com/theme-specification
 * However, it also contains additional properties, that can be used as usual in any styled-component.
 */

export const theme = {
    ...layout,
    ...typography,
    ...color,
    ...border,
    ...transition,
    ...shadows,
    ...browserCompatibility,
};

export type Theme = typeof theme;
