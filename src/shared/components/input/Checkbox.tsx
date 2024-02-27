import { FC, ChangeEvent, useState } from 'react';
import styled from 'styled-components';
import { FlexContainer, Paragraph } from '@/shared/components';
import { handleInputKeyAction } from '@/lib/utils/handleKeyAction';
import { isFirefox } from '@/lib/utils/isFirefox';

type CheckboxProps = {
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  name: string;
  id: string;
  title?: string;
  helperText?: string;
  disabled?: boolean;
  tabIndex?: number;
};

const Input = styled.input`
  height: 0;
  width: 0;
  opacity: 0;
  z-index: -1;
`;

const Indicator = styled.span<{
  isFocusWithin?: boolean;
}>`
  ${({ theme }) => `
    width: 20px;
    height: 20px;
    background-color: transparent;
    position: absolute;
    top: 0em;
    border: 1px solid ${theme.colors.primary};
    border-radius: 6px;
    transition: ${isFirefox ? theme.transitions.firefoxSmoothEase : theme.transitions.smoothEase};

    &:hover {
      background-color: ${theme.colors.inputHover};
    }

    ${Input}:not(:disabled):checked + & {
      background-color: ${theme.colors.primary};

      &:hover {
        background-color: ${theme.colors.checkboxBackground};

        &::after {
          border: solid ${theme.colors.primary};
          border-width: 0 0.15em 0.15em 0;
        }
      }
    }

    &::after {
      content: '';
      position: absolute;
      display: none;
    }

    ${Input}:checked + &::after {
      transform: rotate(45deg);
      display: block;
      top: 0.1em;
      left: 0.35em;
      width: 35%;
      height: 70%;
      border: solid ${theme.colors.background};
      border-width: 0 0.2em 0.2em 0;
    }

    &:disabled {
      cursor: not-allowed;
    }

    ${Input}:disabled + & {
      border: 1px solid ${theme.colors.secondary300};
      background-color: ${theme.colors.disabledCheckbox};
      &::after {
        border: solid ${theme.colors.disabledRadio};
        border-width: 0 0.2em 0.2em 0;
      }
    }
  `}

  ${({ isFocusWithin }) => `
    ${
      isFocusWithin &&
      `
        outline-color: #01b86c;
        outline-style: solid;
        outline-width: 2px;
        outline-offset: 2px;
      `
    }
  `}
`;

const Label = styled.label<{ disabled?: boolean }>`
  position: relative;
  display: inline-block;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};
  display: flex;

  ${({ theme }) => `
    &:hover ${Indicator} {
      background-color: ${theme.colors.inputHover};
    }

    &:hover ${Input}:not(:disabled):checked + ${Indicator} {
      background-color: ${theme.colors.checkboxBackground};

      &::after {
        border: solid ${theme.colors.primary};
        border-width: 0 0.15em 0.15em 0;
      }
    }
  `}
`;

export const Checkbox: FC<CheckboxProps> = ({
  checked,
  onChange,
  name,
  id,
  title,
  helperText,
  disabled,
  tabIndex = 0,
}) => {
  const [isFocusWithin, setIsFocusWithin] = useState(false);

  return (
    <Label htmlFor={id} disabled={disabled}>
      <FlexContainer
        flexDirection='column'
        alignItems='flex-start'
        gridGap='5px'
        marginLeft='28'
        as='span'
      >
        {title && (
          <Paragraph $typeset='headline' color='base'>
            {title}
          </Paragraph>
        )}
        {helperText && (
          <Paragraph $typeset='body' fontWeight='regular' color='gray' as='span'>
            {helperText}
          </Paragraph>
        )}
      </FlexContainer>

      <Input
        id={id}
        type='checkbox'
        name={name}
        disabled={disabled}
        checked={!!checked}
        onChange={onChange}
        tabIndex={tabIndex}
        onFocus={(event) => {
          setIsFocusWithin(event.relatedTarget !== null);
        }}
        onBlur={() => {
          setIsFocusWithin(false);
        }}
      />
      <Indicator
        role='checkbox'
        aria-label={`${title} checkbox`}
        aria-checked={checked}
        aria-disabled={disabled}
        onKeyDown={(e) =>
          handleInputKeyAction(e, onChange, e as unknown as ChangeEvent<HTMLInputElement>)
        }
        isFocusWithin={isFocusWithin}
      />
    </Label>
  );
};
