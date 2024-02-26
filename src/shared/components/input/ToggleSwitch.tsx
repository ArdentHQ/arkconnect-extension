import { FC, ChangeEvent, KeyboardEvent } from 'react';
import styled from 'styled-components';
import { FlexContainer, Paragraph } from '@/shared/components';
import { handleInputKeyAction } from '@/lib/utils/handleKeyAction';
import { isFirefox } from '@/lib/utils/isFirefox';

type ToggleSwitchProps = {
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  id: string;
  disabled?: boolean;
  title?: string;
  helperText?: string;
};

const Input = styled.input`
  height: 0;
  width: 0;
  opacity: 0;
  z-index: -1;
`;

const Slider = styled.span`
  ${({ theme }) => `
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${theme.colors.toggleInactive};
    transition: 0.4s;
    border-radius: 12px;
    transition: ${isFirefox ? theme.transitions.firefoxSmoothEase : theme.transitions.smoothEase};
    z-index: 1;

    &::before {
      position: absolute;
      content: '';
      height: 16px;
      width: 16px;
      left: 0.2em;
      bottom: 0.15em;
      background-color: ${theme.colors.white};
      transition: 0.4s;
      border-radius: 50%;
      fill: ${theme.colors.white};
      filter: drop-shadow(0px 1px 2px rgba(16, 24, 40, 0.06)) drop-shadow(0px 1px 3px rgba(16, 24, 40, 0.10));
    }

    ${isFirefox ? theme.browserCompatibility.firefox.focus : ''}

    &:hover {
      background-color: ${theme.colors.primary};
    }

    ${Input}:checked + & {
      background-color: ${theme.colors.primary};

      &:hover {
        background-color: ${theme.colors.toggleHover};
      }
    }

    ${Input}:checked + &::before {
      transform: translateX(0.9em);
    }

    ${Input}:disabled + & {
      pointer-events: none;
    }

    ${Input}:disabled:not(:checked) + & {
      background-color: ${theme.colors.lightGray}

      &::before {
        background-color: #D2D2D2;
        filter: drop-shadow(0px 1px 2px rgba(16, 24, 40, 0.06)) drop-shadow(0px 1px 3px rgba(16, 24, 40, 0.10));
      }
    }

    ${Input}:disabled:checked + & {
      background-color: ${theme.colors.disabledChecked};

      &::before {
        background-color: ${theme.colors.white};
      }
    }
  `}
`;

const Label = styled.label<{ disabled?: boolean; size?: string }>`
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};

  ${Input} {
    opacity: 0;
    width: 0;
    height: 0;
  }

  ${({ theme }) => `
    &:hover ${Slider} {
      background-color: ${theme.colors.inputHover};
    `};
`;

export const ToggleSwitch: FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  id,
  disabled,
  title,
  helperText,
}) => {
  return (
    <Label htmlFor={id} disabled={disabled}>
      <FlexContainer flexDirection='column' alignItems='flex-start' gridGap='5px' marginLeft='44'>
        <Paragraph $typeset='headline' color='base' width='max-content'>
          {title}
        </Paragraph>
        {helperText && (
          <Paragraph $typeset='body' fontWeight='regular' color='gray'>
            {helperText}
          </Paragraph>
        )}
      </FlexContainer>
      <Input
        id={id}
        type='checkbox'
        disabled={disabled}
        checked={checked}
        onChange={onChange}
        tabIndex={-1}
      />
      <Slider
        role='checkbox'
        tabIndex={0}
        aria-label={`${title} slider`}
        aria-checked={checked}
        aria-disabled={disabled}
        onKeyDown={(e: KeyboardEvent<HTMLSpanElement>) =>
          handleInputKeyAction(e, onChange, e as unknown as ChangeEvent<HTMLInputElement>)
        }
      />
    </Label>
  );
};
