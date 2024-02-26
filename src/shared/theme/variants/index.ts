import { VariantArgs } from 'styled-system';
export * from './_utils';

export * from './buttons';
export * from './typesets';
export * from './flex-variant';

/**
 * Re-exports of variants and type definitions.
 *
 * When creating a new variant, remember to re-export here,
 * and create defaultProps and prop types if necessary.
 */

// Type for the argument of a variant() call, but with the "prop" OR "scale" property required
export type VariantConfig = VariantArgs &
  (
    | {
        readonly prop: string;
      }
    | {
        readonly scale: string;
      }
  );

// Util type for easily defining prop types for a specific variant
// Usage:
//    const VariantButtonProps = VariantProps<typeof buttonVariantConfig>;
export type VariantProps<T extends VariantConfig> =
  // If T contains the property "prop", use that to construct the props type
  T extends { prop: string }
    ? {
        [K in T['prop']]?: keyof T['variants'];
      }
    : // If T contains the property "scale", use that to construct the props type
    T extends { scale: string }
    ? {
        [K in T['scale']]?: keyof T['variants'];
      }
    : // This case can never occur
      never;
