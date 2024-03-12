import classNames from 'classnames';
import { Loader } from '../loader/Loader';
import useThemeMode from '@/lib/hooks/useThemeMode';

export const LoadingFullScreen = () => {
    const { isDark } = useThemeMode();

    return (
        <div
            className={classNames('flex h-screen w-screen items-center justify-center', {
                'bg-light-black': isDark(),
                'bg-subtle-white': !isDark(),
            })}
        >
            <Loader variant='big' />
        </div>
    );
};
