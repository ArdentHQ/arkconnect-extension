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

// Using a button because links are not focusable in Firefox
const ExternalLinkButton = styled.button<
    FlexboxProps<Theme> &
        LayoutProps<Theme> &
        ColorProps<Theme> &
        GridGapProps<Theme> &
        BorderRadiusProps<Theme>
>`
    text-decoration: none;
    cursor: pointer;
    color: inherit;
    display: inline;

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

interface Properties
    extends FlexboxProps<Theme>,
        LayoutProps<Theme>,
        GridGapProps<Theme>,
        Omit<ColorProps<Theme>, 'color'>,
        BorderRadiusProps<Theme> {
    href?: string;
    color?: string & ColorProps<Theme>['color'];
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    children: React.ReactNode;
}

export const ExternalLink = ({ href, color, onClick, ...properties }: Properties) => {
    const clickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        window.open(href, '_blank');

        onClick?.(event);
    };

    return <ExternalLinkButton onClick={clickHandler} {...properties} color={color} />;
};
