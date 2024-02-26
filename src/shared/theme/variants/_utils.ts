import { variant } from 'styled-system';
import { VariantConfig } from '.';

// Defines an object with default props for a specific variant
// Usage:
//    const defaultProps = makeDefaultProps(buttonVariantConfig, 'primary');
const makeDefaultProps = <T extends VariantConfig>(
  variantConfig: T,
  defaultValue: keyof T['variants'],
) => {
  const key = (variantConfig.prop ?? variantConfig.scale) as string;
  return { [key]: defaultValue };
};

// Utility function for creating a variant and (optionally) default props.
// Usage:
//    const {
//      variant: buttonVariant,
//      defaultProps: defaultButtonProps
//    } = makeVariant(buttonVariantConfig, 'primary');
export const makeVariant = <T extends VariantConfig>(
  variantConfig: T,
  defaultValue?: keyof T['variants'],
) => {
  return {
    variant: variant(variantConfig),
    defaultProps: defaultValue ? makeDefaultProps(variantConfig, defaultValue) : {},
  };
};
