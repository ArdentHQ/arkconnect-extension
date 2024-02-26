import Tippy, { type TippyProps } from '@tippyjs/react';
import { roundArrow } from 'tippy.js';

import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/shift-away-subtle.css';
import 'tippy.js/dist/svg-arrow.css';
import { useTooltip } from '@/shared/components/tooltip/useTooltip';
import useThemeMode from '@/lib/hooks/useThemeMode';

interface Properties extends TippyProps {
  variant?: 'default' | 'danger';
  hideAfter?: number;
}

export const Tooltip = ({
  className,
  offset,
  variant = 'default',
  hideAfter,
  touch = false,
  disabled = false,
  ...properties
}: Properties): JSX.Element => {
  const { currentThemeMode } = useThemeMode();

  const { handleShow } = useTooltip({ hideAfter });

  return (
    <Tippy
      animation='shift-away-subtle'
      offset={offset ?? [0, 7]}
      arrow={roundArrow}
      theme={`ark-${currentThemeMode}`}
      duration={150}
      onShown={handleShow}
      disabled={disabled}
      touch={touch}
      {...properties}
    />
  );
};
