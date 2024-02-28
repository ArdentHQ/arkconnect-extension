import styled from 'styled-components';
import { color, ColorProps, flexbox, FlexboxProps, layout, LayoutProps } from 'styled-system';
import { Link } from 'react-router-dom';
import { Theme } from '@/shared/theme';
import { isFirefox } from '@/lib/utils/isFirefox';

export const InternalLink = styled(Link)<
    FlexboxProps<Theme> & LayoutProps<Theme> & ColorProps<Theme>
>`
    text-decoration: none;
    cursor: pointer;
    color: inherit;

    &:hover {
        text-decoration: underline;
    }

    ${({ theme }) => (isFirefox ? theme.browserCompatibility.firefox.focus : '')}

    ${flexbox}
  ${layout}
  ${color}
`;
