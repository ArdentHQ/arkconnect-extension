import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import {
    selectThemeAccent,
    selectThemeMode,
    ThemeAccent,
    themeAccentUpdated,
    ThemeMode,
    themeModeUpdated,
} from '@/lib/store/ui';

const useThemeMode = () => {
    const dispatch = useAppDispatch();
    const currentThemeMode = useAppSelector(selectThemeMode);
    const currentThemeAccent = useAppSelector(selectThemeAccent);

    useEffect(() => {
        if (currentThemeMode === undefined) {
            const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
            dispatch(themeModeUpdated(isDarkMode ? ThemeMode.DARK : ThemeMode.LIGHT));
            return;
        }

        if (currentThemeMode === ThemeMode.DARK) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [currentThemeMode]);

    useEffect(() => {
        if (currentThemeAccent === ThemeAccent.GREEN) {
            document.documentElement.classList.add('accent-green');
        } else {
            document.documentElement.classList.remove('accent-green');
        }
    }, [currentThemeAccent]);

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

    const toggleThemeAccent = (
        evt: React.MouseEvent<HTMLElement> | React.ChangeEvent<HTMLElement>,
    ) => {
        evt.preventDefault();
        evt.stopPropagation();
        dispatch(
            themeAccentUpdated(
                currentThemeAccent === ThemeAccent.NAVY ? ThemeAccent.GREEN : ThemeAccent.NAVY,
            ),
        );
    };

    const isDark = () => currentThemeMode === ThemeMode.DARK;

    return {
        toggleThemeAccent,
        toggleThemeMode,
        currentThemeMode,
        currentThemeAccent,
        isDark,
    };
};

export default useThemeMode;
