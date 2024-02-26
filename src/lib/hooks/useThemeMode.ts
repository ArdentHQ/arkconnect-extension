import { useAppDispatch, useAppSelector } from '@/lib/store';
import * as UIStore from '@/lib/store/ui';
import React from 'react';
import { ThemeMode } from '@/lib/store/ui';
import { ThemeValue } from 'styled-system';
import { Theme } from '@/shared/theme';

export type Color = ThemeValue<'colors', Theme>;
type HexCode = `#${string}`;

export type GetThemeColor = (lightClass: Color | HexCode, darkClass: Color | HexCode) => Color;

const useThemeMode = () => {
  const dispatch = useAppDispatch();
  const currentThemeMode = useAppSelector(UIStore.selectThemeMode);

  const toggleThemeMode = (evt: React.MouseEvent<HTMLElement> | React.ChangeEvent<HTMLElement>) => {
    evt.preventDefault();
    evt.stopPropagation();
    dispatch(
      UIStore.themeModeUpdated(
        currentThemeMode === UIStore.ThemeMode.DARK
          ? UIStore.ThemeMode.LIGHT
          : UIStore.ThemeMode.DARK,
      ),
    );
  };

  const isDark = () => currentThemeMode === ThemeMode.DARK;
  const isLight = () => !isDark();

  const getThemeClass = (lightClass: Color | HexCode, darkClass: Color | HexCode): Color => {
    return (isLight() ? lightClass : darkClass) as Color;
  };

  return {
    toggleThemeMode,
    currentThemeMode,
    getThemeColor: getThemeClass,
    isDark,
  };
};

export default useThemeMode;
