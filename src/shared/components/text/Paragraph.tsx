import styled from 'styled-components';
import {
    color,
    ColorProps,
    display,
    DisplayProps,
    fontWeight,
    FontWeightProps,
    layout,
    LayoutProps,
    space,
    SpaceProps,
    textAlign,
    TextAlignProps,
} from 'styled-system';
import { Theme } from '../../theme';
import { defaultTypsetProps, TextVariantProps, typesetVariant } from '../../theme/variants';

type BaseProps = ColorProps<Theme> &
    SpaceProps<Theme> &
    FontWeightProps<Theme> &
    TextAlignProps<Theme> &
    DisplayProps<Theme> &
    LayoutProps<Theme> &
    TextVariantProps;

type Props = React.PropsWithChildren<BaseProps>;

export const Paragraph = styled.p<Props>`
    ${color}
    ${space}
  ${fontWeight}
  ${textAlign}
  ${display}
  ${layout}
  ${typesetVariant}
`;

Paragraph.defaultProps = {
    ...defaultTypsetProps,
};
