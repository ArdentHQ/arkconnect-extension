import { CSSProperties, FC } from 'react';
import styled from 'styled-components';
import { color, ColorProps, layout, LayoutProps } from 'styled-system';
import { IconDefinition, IconSvg } from './index.generated';
import { Theme } from '@/shared/theme';
export * from './index.generated';

type IconProps = {
    icon: IconDefinition;
    style?: CSSProperties;
    className?: string;
} & ColorProps<Theme> &
    LayoutProps<Theme>;

export const Icon: FC<IconProps> = ({ icon, style, className, ...rest }) => {
    return (
        <StyledIcon
            {...rest}
            {...{ style }}
            className={'Icon ' + (className ? className : '')}
            role='img'
        >
            {IconSvg[icon]}
        </StyledIcon>
    );
};

const StyledIcon = styled.span<ColorProps<Theme> & LayoutProps<Theme>>`
    ${layout}
    ${color}
  display: block;
`;
