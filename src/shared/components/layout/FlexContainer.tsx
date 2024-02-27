import styled from 'styled-components';
import {
  flexbox,
  FlexboxProps,
  space,
  SpaceProps,
  position,
  PositionProps,
  layout,
  LayoutProps,
  TextAlignProps,
  textAlign,
  BorderProps,
  border,
  ColorProps,
  color,
  GridGapProps,
  gridGap,
  boxShadow,
  BoxShadowProps,
} from 'styled-system';
import { Theme } from '@/shared/theme';
import { flexVariant, FlexVariantProps } from '@/shared/theme/variants';

export const FlexContainer = styled.div<
  FlexboxProps<Theme> &
    SpaceProps<Theme> &
    PositionProps<Theme> &
    LayoutProps<Theme> &
    TextAlignProps<Theme> &
    BorderProps<Theme> &
    ColorProps<Theme> &
    GridGapProps<Theme> &
    FlexVariantProps &
    BoxShadowProps<Theme>
>`
  display: flex;
  ${({ as }) =>
    as === 'button' &&
    `
    border: none;
    background-color: transparent;
  `}
  ${flexbox}
  ${space}
  ${position}
  ${layout}
  ${textAlign}
  ${border}
  ${color}
  ${gridGap}
  ${boxShadow}
  ${flexVariant}
`;
