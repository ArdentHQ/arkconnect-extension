import { makeVariant } from './_utils';
import { VariantProps } from '.';

/**
 * Variant for setting custom flex property
 * @columnCenter place in column center center
 * @rowCenter place in row center center
 */

const flexCenter = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
};

const flexVariantConfig = {
    prop: '$flexVariant' as const,
    variants: {
        columnCenter: {
            ...flexCenter,
            flexDirection: 'column',
        },
        rowCenter: {
            ...flexCenter,
            flexDirection: 'row',
        },
        default: {},
    } as const,
};

export type FlexVariantProps = VariantProps<typeof flexVariantConfig>;

export const { variant: flexVariant, defaultProps: defaultFlexVariantProps } = makeVariant(
    flexVariantConfig,
    'default',
);
