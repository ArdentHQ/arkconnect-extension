import { KeyboardEvent } from 'react';

type ClickHandlerWithArg<T> = (arg: T) => void;

export const handleInputKeyAction = <T>(
  event: KeyboardEvent<HTMLButtonElement | HTMLDivElement | HTMLSpanElement>,
  onClick: ClickHandlerWithArg<T>,
  arg: T,
) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    onClick(arg);
  }
};

export const handleSubmitKeyAction = (
  event: KeyboardEvent<HTMLButtonElement | HTMLDivElement | HTMLSpanElement>,
  onClick: () => void,
) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    onClick();
  }
};
