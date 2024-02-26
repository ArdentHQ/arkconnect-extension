import { VariantProps } from '.';
import { makeVariant } from './_utils';
import typography, { SizeKey, TypesetKey } from '../categories/typography';

// The properties that will be set on a component when using a typeset
type Typeset = {
  fontFamily: string;
  fontSize: number;
  lineHeight: string;
};
type Typesets = {
  [key in TypesetKey]: Typeset;
};

// Adds a typeset variant to the 'typesets' object.
// 'sizeKey' and 'textMode' together creates a unique key for using a specific typeset.
const addTypeset = (sizeKey: SizeKey, typesets: Typesets) => {
  const typesetKey = `${sizeKey}` as TypesetKey;

  // Access typeset values from the typography slice of the theme
  typesets[typesetKey] = {
    fontFamily: typography.fonts['regular'],
    fontSize: typography.fontSizes[sizeKey],
    lineHeight: typography.lineHeights[sizeKey] + 'px',
  };
};

// Variant config object for all possible typesets
export const typesetVariantConfig = {
  prop: '$typeset',
  variants: (Object.keys(typography.fontSizes) as SizeKey[]).reduce((typesets, key) => {
    // Create a typeset variant
    addTypeset(key, typesets);
    return typesets;
  }, {} as Typesets),
} as const;

export type TypesetVariantProps = VariantProps<typeof typesetVariantConfig>;
export type HeadingVariantProps = {
  $typeset?: Exclude<TypesetVariantProps['$typeset'], 'body' | 'callout' | 'headline' | 'small'>;
};
export type TextVariantProps = {
  $typeset?: Exclude<TypesetVariantProps['$typeset'], 'h1' | 'h2' | 'h3' | 'h4'>;
};

export const { variant: typesetVariant, defaultProps: defaultTypsetProps } = makeVariant(
  typesetVariantConfig,
  'body',
);
