import styled from 'styled-components';
import {
  variant,
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
import { Icon, IconDefinition, Loader } from '@/shared/components';
import { FlexVariantProps, flexVariant } from '@/shared/theme/variants';
import { isFirefox } from '@/lib/utils/isFirefox';

type VariantProps = {
  variant?:
    | 'primary'
    | 'secondary'
    | 'secondaryBlack'
    | 'primaryText'
    | 'primaryLink'
    | 'primaryLinkDestructive'
    | 'destructivePrimary'
    | 'destructiveSecondary';
};

type BaseProps = ColorProps<Theme> &
  SpaceProps<Theme> &
  LayoutProps<Theme> &
  PositionProps<Theme> &
  ShadowProps<Theme> &
  BorderProps<Theme> &
  FlexVariantProps &
  VariantProps;

type ButtonProps = React.ComponentPropsWithRef<typeof StyledButton> & {
  iconLeading?: IconDefinition;
  iconTrailing?: IconDefinition;
  isLoading?: boolean;
  disabled?: boolean;
};

const StyledButton = styled.button<BaseProps>`
  position: relative;
  border: none;
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${({ theme }) => theme.fontSizes.headline}px;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  border-radius: ${({ theme }) => theme.radii['16']}px;
  width: 100%;
  padding: 16px 28px;
  max-height: 52px;
  transition: ${({ theme }) => isFirefox ? theme.transitions.firefoxSmoothEase : theme.transitions.smoothEase};
  cursor: pointer;
  grid-gap: 12px;

  &:disabled {
    cursor: not-allowed;
    pointer-events: none;
  }

  ${({ theme }) => isFirefox ? theme.browserCompatibility.firefox.focus : ''}

  ${space}
  ${color}
  ${layout}
  ${position}
  ${shadow}
  ${border}
  ${flexVariant}

  ${({ theme }) =>
    variant({
      variants: {
        primary: {
          backgroundColor: `${theme.colors.primary}`,
          color: `${theme.colors.white}`,
          '&:hover': {
            backgroundColor: `${theme.colors.primary600}`,
          },
          '&:focus': {
            boxShadow: `0px 0px 0px 4px ${theme.colors.primaryFocused}`,
          },
          '&:disabled': {
            color: `${theme.colors.secondary400}`,
            backgroundColor: `${theme.colors.primaryDisabled}`,
          },
        },
        secondary: {
          color: `${theme.colors.primary}`,
          backgroundColor: `${theme.colors.background}`,
          border: `1px solid ${theme.colors.primary}`,
          '&:hover': {
            backgroundColor: `${theme.colors.secondaryButtonHover}`,
          },
          '&:focus': {
            boxShadow: '0px 0px 0px 4px #E5F3ED',
          },
          '&:disabled': {
            border: `1px solid ${theme.colors.lightGray}`,
            color: `${theme.colors.gray}`,
            backgroundColor: `${theme.colors.background}`,
          },
        },
        secondaryBlack: {
          border: `1px solid ${theme.colors.secondaryBlackButton}`,
          backgroundColor: `${theme.colors.background}`,
          color: `${theme.colors.secondaryBlackButton}`,
          fontWeight: `${theme.fontWeights.medium}`,
          boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
          '&:hover': {
            backgroundColor: `${theme.colors.secondaryBlackHover}`,
          },
          '&:focus': {
            boxShadow: `0px 0px 0px 4px ${theme.colors.secondaryBlackShadow}`,
          },
          '&:disabled': {
            border: `1px solid ${theme.colors.disabledGray}`,
            color: `${theme.colors.disabledGray}`,
            backgroundColor: `${theme.colors.base}`,
          },
        },
        primaryText: {
          backgroundColor: `${theme.colors.primaryBackground}`,
          color: `${theme.colors.primary}`,
          '&:hover': {
            backgroundColor: `${theme.colors.primary50}`,
          },
          '&:disabled': {
            color: `${theme.colors.gray}`,
          },
        },
        primaryLink: {
          backgroundColor: `${theme.colors.transparent}`,
          color: `${theme.colors.primary}`,
          '&:hover': {
            color: `${theme.colors.primary600}`,
          },
          '&:disabled': {
            color: `${theme.colors.gray}`,
          },
          padding: 0,
        },
        primaryLinkDestructive: {
          backgroundColor: `${theme.colors.primaryBackground}`,
          color: `${theme.colors.error}`,
          padding: 0,
          fontWeight: 'medium',
        },
        destructivePrimary: {
          backgroundColor: `${theme.colors.error}`,
          color: `${theme.colors.white}`,
          '&:hover': {
            backgroundColor: `${theme.colors.error700}`,
          },
          '&:disabled': {
            backgroundColor: `${theme.colors.destructivePrimaryDisabled}`,
          },
        },
        destructiveSecondary: {
          backgroundColor: `${theme.colors.background}`,
          color: `${theme.colors.error}`,
          border: `1px solid ${theme.colors.error}`,
          '&:hover': {
            backgroundColor: `${theme.colors.destructiveSecondary}`,
          },
          '&:focus': {
            boxShadow: `0px 0px 0px 4px ${theme.colors.destructiveSecondaryShadow}`,
          },
          '&:disabled': {
            border: `1px solid ${theme.colors.error200}`,
            color: `${theme.colors.error300}`,
          },
        },
      },
    })};
`;

export const Button = ({
  iconLeading,
  iconTrailing,
  children,
  isLoading,
  ...rest
}: ButtonProps) => {
  if (isLoading) {
    return (
      <StyledButton $flexVariant='rowCenter' variant='primary' {...rest}>
        <Loader variant='small' />
      </StyledButton>
    );
  }

  return (
    <StyledButton $flexVariant='rowCenter' {...rest}>
      {iconLeading && <Icon width='20px' height='20px' icon={iconLeading} />}
      {children}
      {iconTrailing && <Icon width='20px' height='20px' icon={iconTrailing} />}
    </StyledButton>
  );
};
