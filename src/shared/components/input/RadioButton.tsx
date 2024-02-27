import { FC, ChangeEvent, useState } from 'react';
import styled from 'styled-components';
import { FlexContainer, Paragraph } from '@/shared/components';
import { isFirefox } from '@/lib/utils/isFirefox';

type RadioButtonProps = {
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

  ${isFirefox ? `&:focus-visible {
    outline-style: solid;
    outline-width: 2px;
  }` : ''}
`;

const Indicator = styled.div<{
  isFocusWithin?: boolean;
}>`
  ${({ theme }) => `
    border: 1px solid ${theme.colors.radioButton};
    border-radius: 10px;
    width: 20px;
    height: 20px;
    position: absolute;
    top: 0;
    transition: ${theme.transitions.smoothEase};
    transition-property: background-color, border-color;

    &:not(:disabled):hover {
      background-color: ${theme.colors.inputHover};
    }

    &:focus,
    &:active {
      box-shadow: 0px 0px 0px 2px #E5FFF4;
    }

    &::after {
      content: "";
      position: absolute;
      display: none;
    }

    ${Input}:checked + &::after {
      display: block;
      border: solid ${theme.colors.radioButton};
      border-radius: 1em;
      background-color: ${theme.colors.radioButton};
      width: 0.5em;
      height: 0.5em;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    ${Input}:disabled:checked + &::after {
      background-color: ${theme.colors.disabledRadio};
      border: solid ${theme.colors.disabledRadio}
    }

    ${Input}:disabled + & {
      pointer-events: none;
      border: 1px solid ${theme.colors.secondary300};
      background: ${theme.colors.disabledRadioBackground};
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
  min-height: 20px;
  width: 20px;

  ${({ theme }) => `
    &:hover ${Indicator} {
      background-color: ${theme.colors.inputHover};
    `};
`;

export const RadioButton: FC<RadioButtonProps> = ({
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
      <FlexContainer flexDirection='column' alignItems='flex-start' gridGap='5px'>
        {title && (
          <Paragraph $typeset='headline' color='base'>
            {title}
          </Paragraph>
        )}
        {helperText && (
          <Paragraph $typeset='body' fontWeight='regular' color='gray'>
            {helperText}
          </Paragraph>
        )}
      </FlexContainer>
      <Input
        id={id}
        type='radio'
        role='radio'
        name={name}
        disabled={disabled}
        onChange={onChange}
        checked={checked}
        aria-checked={checked}
        aria-disabled={disabled}
        aria-label={`${title} radio button`}
        tabIndex={tabIndex}
        onFocus={(event) => {
          setIsFocusWithin(event.relatedTarget !== null);
        }}
        onBlur={() => {
          setIsFocusWithin(false);
        }}
      />
      <Indicator isFocusWithin={isFocusWithin} />
    </Label>
  );
};
