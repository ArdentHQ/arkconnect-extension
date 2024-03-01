import styled from 'styled-components';
import {
    border,
    BorderProps,
    boxShadow,
    BoxShadowProps,
    color,
    ColorProps,
    flexbox,
    FlexboxProps,
    grid,
    GridProps,
    layout,
    LayoutProps,
    space,
    SpaceProps,
} from 'styled-system';
import { Theme } from '@/shared/theme';

export const Grid = styled.div<
    GridProps<Theme> &
        FlexboxProps<Theme> &
        BorderProps<Theme> &
        SpaceProps<Theme> &
        BoxShadowProps<Theme> &
        ColorProps<Theme> &
        LayoutProps<Theme>
>`
    display: grid;
    ${grid}
    ${flexbox}
  ${border}
  ${space}
  ${layout}
  ${boxShadow}
  ${color}
`;
