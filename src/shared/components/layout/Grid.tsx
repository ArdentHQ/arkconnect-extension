import styled from 'styled-components';
import {
    space,
    SpaceProps,
    border,
    BorderProps,
    grid,
    GridProps,
    LayoutProps,
    layout,
    FlexboxProps,
    flexbox,
    boxShadow,
    BoxShadowProps,
    color,
    ColorProps,
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
