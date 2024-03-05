import cn from 'classnames';
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
    | 'destructiveSecondary';

type ButtonProps = React.ComponentPropsWithRef<'button'> & {
    iconLeading?: IconDefinition;
    iconTrailing?: IconDefinition;
    isLoading?: boolean;
    disabled?: boolean;
    className?: string;
    variant?: ButtonVariant;
};

const buttonClass: Record<string, ButtonVariant> = {
    'button-primary': 'primary',
    'button-secondary': 'secondary',
    'button-secondaryBlack': 'secondaryBlack',
    'button-primaryText': 'primaryText',
    'button-primaryLink': 'primaryLink',
    'button-primaryLinkDestructive': 'primaryLinkDestructive',
    'button-linkDestructive': 'linkDestructive',
    'button-destructivePrimary': 'destructivePrimary',
    'button-destructiveSecondary': 'destructiveSecondary',
};

const buttonVariantClass = (variant?: ButtonVariant) => (variant ? buttonClass[variant] : '');

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
                { [buttonVariantClass(variant)]: buttonVariantClass(variant) },
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
