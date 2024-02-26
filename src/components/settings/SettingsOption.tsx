import styled from 'styled-components';
import {
  SpaceProps,
  ColorProps,
  LayoutProps,
  PositionProps,
  ShadowProps,
  BorderProps,
  variant,
} from 'styled-system';
import { Theme } from '@/shared/theme';
import { Container, FlexContainer, Icon, IconDefinition, Paragraph } from '@/shared/components';
import { FlexVariantProps } from '@/shared/theme/variants';
import { MouseEvent, forwardRef } from 'react';
import useThemeMode from '@/lib/hooks/useThemeMode';
import { isFirefox } from '@/lib/utils/isFirefox';

type VariantProps = {
  variant?: 'primary' | 'error';
  isDark?: boolean;
};

type BaseProps = ColorProps<Theme> &
  SpaceProps<Theme> &
  LayoutProps<Theme> &
  PositionProps<Theme> &
  ShadowProps<Theme> &
  BorderProps<Theme> &
  FlexVariantProps &
  VariantProps;

type SettingsOptionProps = React.ComponentPropsWithRef<typeof StyledRow> & {
  iconLeading: IconDefinition;
  iconTrailing?: IconDefinition;
  title: string;
  rightContent?: React.ReactNode;
  color?: ColorProps<Theme>;
  disabled?: boolean;
};

const StyledRow = styled(Container)<BaseProps>`
  position: relative;
  display: flex;
  width: 100%;
  max-height: 52px;
  padding: 16px;
  cursor: pointer;
  grid-gap: 12px;
  align-items: center;
  border: none;
  background: none;

  ${({ theme, isDark }) =>
    variant({
      variants: {
        primary: {
          backgroundColor: `${theme.transitions.white}`,
          transition: isFirefox ? `${theme.transitions.firefoxSmoothEase}` : `${theme.transitions.smoothEase}`,

          '&:focus-visible': isFirefox ? {
            'outline-style': 'solid',
            'outline-width': '2px',
            'outline-offset': '-2px',
          } : {},

          '&:hover': {
            backgroundColor: `${theme.colors.secondaryBlackShadow}`,
          },
        },
        error: {
          transition: isFirefox ? `${theme.transitions.firefoxSmoothEase}` : `${theme.transitions.smoothEase}`,

          '&:focus-visible': isFirefox ? {
            'outline-style': 'solid',
            'outline-width': '2px',
            'outline-offset': '-2px',
          } : {},

          '&:hover': {
            backgroundColor: isDark ? 'rgba(204, 28, 0, 0.10)' : `${theme.colors.error50}`,
            color: `${theme.colors.error}`,
            '.icon-leading': {
              transition: `${theme.transitions.smoothEase}`,
              color: `${theme.colors.error500}`,
            },
            '.icon-trailing': {
              transition: `${theme.transitions.smoothEase}`,
              color: `${theme.colors.error500}`,
            },
            '.title-text': {
              transition: `${theme.transitions.smoothEase}`,
              color: `${theme.colors.error500}`,
            },
          },
        },
      },
    })};
`;

export const SettingsOption = forwardRef(function RowLayout(
  {
    iconLeading,
    iconTrailing,
    title,
    rightContent,
    variant = 'primary',
    color,
    disabled,
    onClick,
    ...rest
  }: SettingsOptionProps,
  forwardedRef: React.Ref<HTMLDivElement>,
) {
  const { isDark, getThemeColor } = useThemeMode();

  return (
    <StyledRow
      variant={variant}
      isDark={isDark()}
      ref={forwardedRef}
      {...rest}
      onClick={(e: MouseEvent<HTMLDivElement>) => {
        if (!disabled && onClick) {
          onClick(e);
        }
      }}
      tabIndex={0}
      aria-label={title}
      {...rest}
    >
      <FlexContainer width='100%' gridGap='12px' alignItems='flex-start' as='span'>
        <FlexContainer justifyContent='center' alignItems='center' overflow='hidden' as='span'>
          <FlexContainer
            width='20px'
            height='20px'
            color={getThemeColor('gray500', 'gray300')}
            className='icon-leading'
            as='span'
          >
            <Icon width='20px' height='20px' icon={iconLeading} />
          </FlexContainer>
        </FlexContainer>
        <FlexContainer alignItems='center' justifyContent='space-between' width='100%' as='span'>
          <FlexContainer flexDirection='column' alignItems='flex-start' gridGap='4px' as='span'>
            <Paragraph
              $typeset='headline'
              fontWeight='regular'
              color={disabled ? 'gray' : 'base'}
              className='title-text'
              as='span'
            >
              {title}
            </Paragraph>
          </FlexContainer>
          <FlexContainer alignItems='center' as='span'>
            {rightContent}
            {iconTrailing && (
              <FlexContainer alignItems='center' gridGap='8px' as='span'>
                {iconTrailing && (
                  <Icon
                    width='20px'
                    height='20px'
                    icon={iconTrailing}
                    color={color || disabled ? 'gray' : getThemeColor('base', 'white')}
                    className='icon-trailing'
                  />
                )}
              </FlexContainer>
            )}
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
    </StyledRow>
  );
});
