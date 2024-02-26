import React from 'react';
import { IconDefinition, IconSvg } from './index.generated';
import styled from 'styled-components';
export * from './index.generated';
import { color, ColorProps, layout, LayoutProps } from 'styled-system';
import { Theme } from '@/shared/theme';

type IconProps = {
  icon: IconDefinition;
  style?: React.CSSProperties;
  className?: string;
} & ColorProps<Theme> &
  LayoutProps<Theme>;

export const Icon: React.FC<IconProps> = ({ icon, style, className, ...rest }) => {
  return (
    <StyledIcon {...rest} {...{ style }} className={'Icon ' + (className ? className : '')} role='img'>
      {IconSvg[icon]}
    </StyledIcon>
  );
};

const StyledIcon = styled.span<ColorProps<Theme> & LayoutProps<Theme>>`
  ${layout}
  ${color}
  display: block;
`;
