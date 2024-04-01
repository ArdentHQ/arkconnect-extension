import { twMerge } from 'tailwind-merge';
import cn from 'classnames';
import Color from 'color-thief-react';
import { Icon } from '@/shared/components';

import { ThemeMode } from '@/lib/store/ui';
import useThemeMode from '@/lib/hooks/useThemeMode';
import { convertHexToRGBA } from '@/lib/utils/convertHexToRgba';

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
            <Color src={appLogo} crossOrigin="anonymous" format="hex">
                {({ loading, data }) => {
                    let color = '';

                    if (loading && data !== undefined) {
                        color = convertHexToRGBA(data, '0.20');
                    }

                    return (
                    <div
                        className={twMerge(
                            cn('h-5 w-5 flex-shrink-0 overflow-hidden bg-white dark:bg-light-black', {
                                'border-[10px] border-solid': withBorder,
                                'border-white dark:border-light-black': withBorder && loading && !data,
                                'rounded-full': roundCorners,
                            }),
                            className,
                        )}
                        style={{ borderColor: color }}
                    >
                        <img className='h-full w-full  object-contain' src={appLogo} alt={alt || appName} />
                    </div>
                );}}
            </Color>
        );
    }

    const { currentThemeMode } = useThemeMode();
    const defaultFavicon =
        currentThemeMode === ThemeMode.LIGHT ? 'default-favicon-light' : 'default-favicon-dark';

    return (
        <Icon
            icon={defaultFavicon}
            className='h-3.75 w-3.75 text-theme-primary-700 dark:text-theme-primary-650'
        />
    );
};

export default ConnectionLogoImage;
