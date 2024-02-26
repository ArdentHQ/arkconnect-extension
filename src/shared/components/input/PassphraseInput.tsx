import styled, { css } from 'styled-components';
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
import { Container, FlexContainer, Paragraph } from '@/shared/components';
import { forwardRef } from 'react';

type VariantProps = {
  variant?: 'primary' | 'destructive' | 'errorFree';
};

type BaseProps = ColorProps<Theme> &
  SpaceProps<Theme> &
  LayoutProps<Theme> &
  PositionProps<Theme> &
  ShadowProps<Theme> &
  BorderProps<Theme> &
  VariantProps & { hideValue: boolean };

type TextAreaProps = React.ComponentPropsWithRef<typeof StyledTextArea> & {
  disabled?: boolean;
  labelText?: string;
  helperText?: string;
};

const StyledTextArea = styled.textarea<BaseProps>`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${({ theme }) => theme.fontSizes.headline}px;
  font-weight: ${({ theme }) => theme.fontWeights.regular};
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
  transition: ${({ theme }) => theme.transitions.smoothEase};
  border: none;
  outline: none;
  resize: none;

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

  ${({ hideValue }) =>
    hideValue &&
    css`
      -webkit-text-security: disc;
    `}

  ${({ theme }) =>
    variant({
      variants: {
        primary: {
          color: `${theme.colors.base}`,
          border: `1px solid ${theme.colors.gray400}`,
          backgroundColor: `${theme.colors.inputBackground}`,
          '&:focus': {
            border: `1px solid ${theme.colors.activeInput}`,
          },
          '&:disabled': {
            backgroundColor: `${theme.colors.gray100}`,
          },
          '&:read-only': {
            backgroundColor: `${theme.colors.inputBackground}`,
          },
        },
        destructive: {
          color: `${theme.colors.base}`,
          border: `1px solid ${theme.colors.error300}`,
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

export const PassphraseInput = forwardRef(function TextArea(
  props: TextAreaProps,
  ref: React.Ref<HTMLTextAreaElement>,
) {
  const { labelText, helperText, variant, id, rows, value, onChange, ...rest } = props;

  const handleOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(event);
    }
  };

  return (
    <FlexContainer flexDirection='column' gridGap='6px'>
      {labelText && (
        <Paragraph as='label' htmlFor={id} $typeset='body' fontWeight='medium' color='gray'>
          {labelText}
        </Paragraph>
      )}
      <Container position='relative' width='100%'>
        <StyledTextArea
          variant={variant}
          rows={rows || 4}
          ref={ref}
          id={id}
          value={value}
          onChange={handleOnChange}
          {...rest}
        />
      </Container>

      {helperText && (
        <Paragraph
          $typeset='body'
          fontWeight='regular'
          color={variant == 'destructive' ? 'error' : 'gray'}
        >
          {helperText}
        </Paragraph>
      )}
    </FlexContainer>
  );
});
