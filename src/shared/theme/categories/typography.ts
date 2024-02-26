/**
 * Anything related to typography and font properties.
 *
 */

const typography = {
  fonts: {
    regular: 'DM Sans',
  },

  fontWeights: {
    regular: 400,
    medium: 500,
    bold: 700,
  },
  fontSizes: {
    small: 12,
    callout: 14,
    body: 14,
    headline: 16,
    h4: 18,
    h3: 20,
    h2: 24,
    h1: 28,
  },

  lineHeights: {
    small: 15,
    callout: 18,
    body: 18,
    headline: 20,
    h4: 23,
    h3: 25,
    h2: 30,
    h1: 35,
  },
};

export type SizeKey = keyof typeof typography.fontSizes;
export type TypesetKey = keyof typeof typography.fontSizes;

export default typography;
