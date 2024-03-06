import styled from 'styled-components';
import {
    borderRadius,
    BorderRadiusProps,
    color,
    ColorProps,
    flexbox,
    FlexboxProps,
    gridGap,
    GridGapProps,
    layout,
    LayoutProps,
} from 'styled-system';
import { Theme } from '@/shared/theme';

export const ExternalLink = styled.a<
    FlexboxProps<Theme> &
        LayoutProps<Theme> &
        ColorProps<Theme> &
        GridGapProps<Theme> &
        BorderRadiusProps<Theme>
>`
    text-decoration: none;
    cursor: pointer;
    color: inherit;

    &:hover {
        text-decoration: underline;
    }

    &:focus-visible {
        outline: 2px solid ${({ theme }) => theme.colors.primary600};
    }
    ${flexbox}
    ${layout}
    ${color}
    ${gridGap}
    ${borderRadius}
`;
