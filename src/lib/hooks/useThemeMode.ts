import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { selectThemeMode, ThemeMode, themeModeUpdated } from '@/lib/store/ui';

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

    return {
        toggleThemeMode,
        currentThemeMode,
        isDark,
    };
};

export default useThemeMode;
