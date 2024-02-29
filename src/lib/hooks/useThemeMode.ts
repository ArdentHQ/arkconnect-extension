import React, { useEffect } from 'react';
import { ThemeValue } from 'styled-system';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { selectThemeMode, themeModeUpdated, ThemeMode } from '@/lib/store/ui';
import { Theme } from '@/shared/theme';

export type Color = ThemeValue<'colors', Theme>;
type HexCode = `#${string}`;

export type GetThemeColor = (lightClass: Color | HexCode, darkClass: Color | HexCode) => Color;

const useThemeMode = () => {
    const dispatch = useAppDispatch();
    const currentThemeMode = useAppSelector(selectThemeMode);

    useEffect(() => {
        if (currentThemeMode === ThemeMode.DARK) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [currentThemeMode]);

    const toggleThemeMode = (
        evt: React.MouseEvent<HTMLElement> | React.ChangeEvent<HTMLElement>,
    ) => {
        evt.preventDefault();
        evt.stopPropagation();
        dispatch(
            themeModeUpdated(
                currentThemeMode === ThemeMode.DARK ? ThemeMode.LIGHT : ThemeMode.DARK,
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
