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
import { MutableRefObject } from 'react';
import { Theme } from '@/shared/theme';
import { Container, FlexContainer, Icon, IconDefinition, Paragraph } from '@/shared/components';
import useThemeMode, { GetThemeColor } from '@/lib/hooks/useThemeMode';

type VariantProps = {
  variant?: 'primary' | 'destructive' | 'errorFree';
};

type GetThemeColorProps = {
  getThemeColor?: GetThemeColor;
};

type BaseProps = ColorProps<Theme> &
  SpaceProps<Theme> &
  LayoutProps<Theme> &
  PositionProps<Theme> &
  ShadowProps<Theme> &
  BorderProps<Theme> &
  VariantProps &
  GetThemeColorProps;

type InputProps = React.ComponentPropsWithRef<typeof StyledInput> & {
  iconLeading?: IconDefinition;
  iconTrailing?: IconDefinition;
  paddingRight?: React.ComponentProps<typeof Container>['paddingRight'];
  trailing?: React.ReactNode;
  disabled?: boolean;
  labelText?: string;
  helperText?: string;
  innerRef?: MutableRefObject<HTMLInputElement | null>;
};

const StyledInput = styled.input<BaseProps>`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${({ theme }) => theme.fontSizes.headline}px;
  font-weight: ${({ theme }) => theme.fontWeights.regular};
  width: 100%;
  padding: 16px 12px;
  max-height: 52px;
  border-radius: 8px;
  transition: ${({ theme }) => theme.transitions.smoothEase};
  border: none;
  outline: none;

  &:disabled {
    cursor: not-allowed;
    pointer-events: none;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray400};
  }
  ${space}
  ${color}
  ${layout}
  ${position}
  ${shadow}
  ${border}

  ${({ theme, getThemeColor }) =>
    variant({
      variants: {
        primary: {
          color: `${theme.colors.base}`,
          border: `1px solid ${getThemeColor?.(theme.colors.gray400, theme.colors.gray500)}`,
          backgroundColor: `${theme.colors.inputBackground}`,
          '&:focus': {
            border: `1px solid ${theme.colors.activeInput}`,
          },
          '&:disabled': {
            backgroundColor: `${theme.colors.gray100}`,
          },
        },
        destructive: {
          color: `${theme.colors.base}`,
          border: `1px solid ${theme.colors.error500}`,
          backgroundColor: `${theme.colors.inputBackground}`,
          '&:focus': {
            border: `1px solid ${theme.colors.error}`,
          },
        },
        errorFree: {
          color: `${theme.colors.base}`,
          border: `1px solid ${theme.colors.primary}`,
          backgroundColor: `${theme.colors.inputBackground}`,
          '&:focus': {
            border: `1px solid ${theme.colors.primary}`,
          },
          '&:disabled': {
            backgroundColor: `${theme.colors.gray100}`,
          },
        },
      },
    })};
`;

export const Input = ({
  iconLeading,
  iconTrailing,
  trailing,
  labelText,
  helperText,
  variant,
  id,
  innerRef,
  paddingRight,
  ...rest
}: InputProps) => {
  const { getThemeColor } = useThemeMode();

  return (
    <FlexContainer flexDirection='column' gridGap='6px'>
      {labelText && (
        <Paragraph as='label' htmlFor={id} $typeset='body' fontWeight='medium' color='label'>
          {labelText}
        </Paragraph>
      )}
      <Container position='relative' width='100%'>
        {iconLeading && (
          <TrailingLeadingWrapper isLeading>
            <Icon width='20px' height='20px' icon={iconLeading} />
          </TrailingLeadingWrapper>
        )}

        <StyledInput
          paddingLeft={iconLeading && '40'}
          paddingRight={paddingRight || (iconTrailing && '40')}
          variant={variant}
          id={id}
          ref={innerRef}
          getThemeColor={getThemeColor}
          {...rest}
        />

        {iconTrailing && (
          <TrailingLeadingWrapper isTrailing>
            <Icon width='20px' height='20px' icon={iconTrailing} />
          </TrailingLeadingWrapper>
        )}

        {trailing && <TrailingLeadingWrapper isTrailing>{trailing}</TrailingLeadingWrapper>}
      </Container>

      {helperText && (
        <Paragraph
          $typeset='body'
          fontWeight='regular'
          color={variant == 'destructive' ? 'error500' : 'gray'}
        >
          {helperText}
        </Paragraph>
      )}
    </FlexContainer>
  );
};

const TrailingLeadingWrapper = styled.div<{ isLeading?: boolean; isTrailing?: boolean }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: ${({ isLeading }) => (isLeading ? '12px' : 'auto')};
  right: ${({ isTrailing }) => (isTrailing ? '12px' : 'auto')};
`;
