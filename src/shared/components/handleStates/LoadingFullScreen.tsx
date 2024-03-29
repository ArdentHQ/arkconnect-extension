import cn from 'classnames';
import { Loader } from '@/shared/components/loader/Loader';
import useThemeMode from '@/lib/hooks/useThemeMode';

export const LoadingFullScreen = () => {
    const { isDark } = useThemeMode();

    return (
        <div
            className={cn('flex h-screen w-screen items-center justify-center', {
                // The loading screen is the first thing to show when the extension is loaded,
                // which means we can't rely on the dark class initially since the ThemeProvider
                // adds the class after is mounted. We need to check the theme mode manually.
                'bg-light-black': isDark(),
                'bg-subtle-white': !isDark(),
            })}
        >
            <Loader variant='big' />
        </div>
    );
};
