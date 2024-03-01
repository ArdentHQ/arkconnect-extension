import styled, { WebTarget } from 'styled-components';
import {
    border,
    BorderProps,
    boxShadow,
    BoxShadowProps,
    color,
    ColorProps,
    layout,
    LayoutProps,
    position,
    PositionProps,
    space,
    SpaceProps,
} from 'styled-system';
import { Theme } from '@/shared/theme';

export const Container = styled.div<
    SpaceProps<Theme> &
        ColorProps<Theme> &
        LayoutProps<Theme> &
        BorderProps<Theme> &
        PositionProps<Theme> &
        BoxShadowProps<Theme> & { as?: void | WebTarget | undefined }
>`
    ${space}
    ${color}
  ${layout}
  ${border}
  ${position}
  ${boxShadow}
`;
