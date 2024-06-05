import cn from 'classnames';
import { twMerge } from 'tailwind-merge';
import { Icon, IconDefinition, Loader } from '@/shared/components';

import { isFirefox } from '@/lib/utils/isFirefox';

type ButtonVariant =
    | 'primary'
    | 'secondary'
    | 'secondaryBlack'
    | 'primaryText'
    | 'primaryLink'
    | 'primaryLinkDestructive'
    | 'linkDestructive'
    | 'destructivePrimary'
    | 'destructiveSecondary'
    | 'secondaryLink';

type ButtonProps = React.ComponentPropsWithRef<'button'> & {
    iconLeading?: IconDefinition;
    iconTrailing?: IconDefinition;
    iconClass?: string;
    isLoading?: boolean;
    disabled?: boolean;
    className?: string;
    variant?: ButtonVariant;
};

const buttonClass: Record<ButtonVariant, string> = {
    primary: 'button-primary',
    secondary: 'button-secondary',
    secondaryBlack: 'button-secondaryBlack',
    primaryText: 'button-primaryText',
    primaryLink: 'button-primaryLink',
    primaryLinkDestructive: 'button-primaryLinkDestructive',
    linkDestructive: 'button-linkDestructive',
    destructivePrimary: 'button-destructivePrimary',
    destructiveSecondary: 'button-destructiveSecondary',
    secondaryLink: 'button-secondaryLink',
};

const getButtonClass = (variant?: ButtonVariant) => (variant ? buttonClass[variant] : '');

export const Button = ({
    iconLeading,
    iconTrailing,
    iconClass = 'h-5 w-5',
    children,
    isLoading,
    className,
    variant,
    ...rest
}: ButtonProps) => {
    if (isLoading) {
        return (
            <button
                className={twMerge(
                    cn('button-base button-primary', {
                        'transition-firefoxSmoothEase focus-visible:outline focus-visible:outline-2':
                            isFirefox,
                        'transition-smoothEase': !isFirefox,
                    }),
                    className,
                )}
                {...rest}
            >
                <Loader variant='small' />
            </button>
        );
    }

    return (
        <button
            className={twMerge(
                cn('button-base', {
                    'transition-firefoxSmoothEase focus-visible:outline focus-visible:outline-2':
                        isFirefox,
                    'transition-smoothEase': !isFirefox,
                    [getButtonClass(variant)]: variant,
                }),
                className,
            )}
            {...rest}
        >
            {iconLeading && <Icon className={iconClass} icon={iconLeading} />}
            {children}
            {iconTrailing && <Icon className={iconClass} icon={iconTrailing} />}
        </button>
    );
};
