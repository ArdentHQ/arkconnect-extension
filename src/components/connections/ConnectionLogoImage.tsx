import { twMerge } from 'tailwind-merge';
import classNames from 'classnames';
import { Icon } from '@/shared/components';

import { ThemeMode } from '@/lib/store/ui';
import useThemeMode from '@/lib/hooks/useThemeMode';

interface Props extends React.HTMLProps<HTMLImageElement> {
    alt?: string;
    appLogo?: string;
    appName?: string;
    withBorder?: boolean;
    roundCorners?: boolean;
}

const ConnectionLogoImage = ({
    appName,
    appLogo,
    alt,
    withBorder = false,
    roundCorners = false,
    className,
}: Props) => {
    if (appLogo) {
        return (
            <div
                className={twMerge(
                    classNames(
                        'h-5 w-5 flex-shrink-0 overflow-hidden bg-white dark:bg-light-black',
                        {
                            'border-[10px] border-solid': withBorder,
                            'border-white dark:border-light-black': withBorder,
                            'rounded-full': roundCorners,
                        },
                    ),
                    className,
                )}
            >
                <img className='h-full w-full  object-contain' src={appLogo} alt={alt || appName} />
            </div>
        );
    }

    const { currentThemeMode } = useThemeMode();
    const defaultFavicon =
        currentThemeMode === ThemeMode.LIGHT ? 'default-favicon-light' : 'default-favicon-dark';

    return (
        <Icon
            icon={defaultFavicon}
            className='h-[15px] w-[15px] text-theme-primary-700 dark:text-theme-primary-650'
        />
    );
};

export default ConnectionLogoImage;
