import React from 'react';
import styled from 'styled-components';
import {
    fontWeight,
    FontWeightProps,
    textAlign,
    TextAlignProps,
    space,
    SpaceProps,
    color,
    ColorProps,
    width,
    WidthProps,
} from 'styled-system';
import { Theme } from '../../theme';
import { HeadingVariantProps, typesetVariant } from '@/shared/theme/variants';

type BaseProps = TextAlignProps<Theme> &
    SpaceProps<Theme> &
    FontWeightProps<Theme> &
    ColorProps<Theme> &
    WidthProps<Theme> &
    HeadingVariantProps;

const StyledHeading = styled.h1<BaseProps>`
    ${fontWeight}
    ${textAlign}
  ${space}
  ${color}
  ${width}
  ${typesetVariant}
`;

type Props = React.PropsWithChildren<BaseProps>;

export const Heading = (props: Props) => {
    if (!props.$typeset) {
        return null;
    }

    const colorProp = props.color as string | undefined;

    return (
        <StyledHeading as={props.$typeset} {...props} color={colorProp}>
            {props.children}
        </StyledHeading>
    );
};
