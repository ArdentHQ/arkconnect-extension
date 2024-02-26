import styled from 'styled-components';
import {
  color,
  space,
  SpaceProps,
  ColorProps,
  fontWeight,
  FontWeightProps,
  textAlign,
  TextAlignProps,
  layout,
  LayoutProps,
  display,
  DisplayProps,
} from 'styled-system';
import { Theme } from '../../theme';
import { typesetVariant, TextVariantProps, defaultTypsetProps } from '../../theme/variants';

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
