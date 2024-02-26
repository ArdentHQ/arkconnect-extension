import styled from 'styled-components';
import {
  space,
  SpaceProps,
  color,
  ColorProps,
  layout,
  LayoutProps,
  position,
  PositionProps,
  shadow,
  ShadowProps,
  border,
  BorderProps,
} from 'styled-system';
import { Theme } from '@/shared/theme';
import { FlexContainer, Icon, IconDefinition, Paragraph } from '@/shared/components';
import { FlexVariantProps, flexVariant } from '@/shared/theme/variants';
import { isFirefox } from '@/lib/utils/isFirefox';

type BaseProps = ColorProps<Theme> &
  SpaceProps<Theme> &
  LayoutProps<Theme> &
  PositionProps<Theme> &
  ShadowProps<Theme> &
  BorderProps<Theme> &
  FlexVariantProps;

type BigButtonProps = React.ComponentPropsWithRef<typeof StyledButton> & {
  iconLeading?: IconDefinition;
  iconTrailing?: IconDefinition;
  title: string;
  helperText?: string;
};

const StyledButton = styled.button<BaseProps>`
  ${({ theme }) => `
  border: 1px solid transparent;
  border-radius: ${theme.radii['20']}px;
  background-color: ${theme.colors.inputBackground};
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.05);
  display: flex;
  width: 100%;
  padding: 16px;
  max-height: 96px;
  box-sizing: border-box;
  transition: ${isFirefox ? theme.transitions.firefoxSmoothEase : theme.transitions.smoothEase};
  cursor: pointer;
  grid-gap: 12px;

  &:hover {
    border: 1px solid ${theme.colors.activeNav};
  }

  ${isFirefox ? theme.browserCompatibility.firefox.focus : ''}

  &:disabled {
    cursor: not-allowed;
    pointer-events: none;
  }
`}
  ${space}
  ${color}
  ${layout}
  ${position}
  ${shadow}
  ${border}
  ${flexVariant}
`;

export const BigButton = ({
  iconLeading,
  iconTrailing,
  title,
  helperText,
  ...rest
}: BigButtonProps) => {
  return (
    <StyledButton {...rest}>
      <FlexContainer width='100%' gridGap='12px' alignItems='flex-start'>
        {iconLeading && <Icon width='24px' height='24px' icon={iconLeading} />}
        <FlexContainer alignItems='center' justifyContent='space-between' width='100%'>
          <FlexContainer flexDirection='column' alignItems='flex-start' width='100%' gridGap='8px'>
            {title && (
              <Paragraph $typeset='headline' fontWeight='medium' color='base'>
                {title}
              </Paragraph>
            )}
            {helperText && (
              <Paragraph $typeset='body' fontWeight='regular' color='gray' textAlign='left'>
                {helperText}
              </Paragraph>
            )}
          </FlexContainer>
          <FlexContainer
            height='100%'
            $flexVariant='columnCenter'
            justifyContent='center'
            color='base'
          >
            {iconTrailing && <Icon width='20px' height='20px' icon={iconTrailing} />}
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
    </StyledButton>
  );
};
