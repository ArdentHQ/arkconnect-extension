import cn from 'classnames';
import { Icon, IconDefinition, Loader } from '@/shared/components';
import { isFirefox } from '@/lib/utils/isFirefox';

type ButtonVariant = 'primary' | 'secondary' | 'secondaryBlack' | 'primaryText' | 'primaryLink' | 'primaryLinkDestructive' | 'linkDestructive' | 'destructivePrimary' | 'destructiveSecondary';

type ButtonProps = React.ComponentPropsWithRef<'button'> & {
    iconLeading?: IconDefinition;
    iconTrailing?: IconDefinition;
    isLoading?: boolean;
    disabled?: boolean;
    className?: string;
    variant?: ButtonVariant
};

const buttonClass: Record<ButtonVariant, string>  = {
    'primary': 'button-primary',
    'secondary': 'button-secondary',
    'secondaryBlack': 'button-secondaryBlack',
    'primaryText': 'button-primaryText',
    'primaryLink': 'button-primaryLink',
    'primaryLinkDestructive': 'button-primaryLinkDestructive',
    'linkDestructive': 'button-linkDestructive',
    'destructivePrimary': 'button-destructivePrimary',
    'destructiveSecondary': 'button-destructiveSecondary',
};

const getButtonClass = (variant?: ButtonVariant) => variant ? buttonClass[variant] : '';

export const Button = ({
    iconLeading,
    iconTrailing,
    children,
    isLoading,
    className,
    variant,
    ...rest
}: ButtonProps) => {
    if (isLoading) {
        return (
            <button
                className={cn(
                    'button-base button-primary',
                    {
                        'transition-firefoxSmoothEase focus-visible:outline focus-visible:outline-2':
                            isFirefox,
                        'transition-smoothEase': !isFirefox,
                    },
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
            className={cn(
                'button-base',
                {
                    'transition-firefoxSmoothEase focus-visible:outline focus-visible:outline-2':
                        isFirefox,
                    'transition-smoothEase': !isFirefox,
                    [getButtonClass(variant)]: variant,
                },
                className,
            )}
            {...rest}
        >
            {iconLeading && <Icon className='h-5 w-5' icon={iconLeading} />}
            {children}
            {iconTrailing && <Icon className='h-5 w-5' icon={iconTrailing} />}
        </button>
    );
};
