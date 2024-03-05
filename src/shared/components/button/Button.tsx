import cn from 'classnames';
import { Icon, IconDefinition, Loader } from '@/shared/components';
import { isFirefox } from '@/lib/utils/isFirefox';

type ButtonProps = React.ComponentPropsWithRef<'button'> & {
    iconLeading?: IconDefinition;
    iconTrailing?: IconDefinition;
    isLoading?: boolean;
    disabled?: boolean;
    className?: string;
    variant?: 'primary' | 'secondary' | 'secondaryBlack' | 'primaryText' | 'primaryLink' | 'primaryLinkDestructive' | 'linkDestructive' | 'destructivePrimary' | 'destructiveSecondary';
};


export const Button = ({
    iconLeading,
    iconTrailing,
    children,
    isLoading,
    className,
    variant,
    ...rest
}: ButtonProps) => {
    if(isLoading) {
        return (
            <button className={cn('button-base button-primary', {
                'transition-firefoxSmoothEase focus-visible:outline focus-visible:outline-2': isFirefox,
                'transition-smoothEase': !isFirefox,
            }, className)} {...rest}>
                <Loader variant='small' />
            </button>
        );
    }

    return (
        <button className={cn('button-base', {
            'button-primary': variant === 'primary',
            'button-secondary': variant === 'secondary',
            'button-secondaryBlack': variant === 'secondaryBlack',
            'button-primaryText': variant === 'primaryText',
            'button-primaryLink': variant === 'primaryLink',
            'button-primaryLinkDestructive': variant === 'primaryLinkDestructive',
            'button-linkDestructive': variant === 'linkDestructive',
            'button-destructivePrimary': variant === 'destructivePrimary',
            'button-destructiveSecondary': variant === 'destructiveSecondary',
        }, className)} {...rest}>
            {iconLeading && <Icon className='h-5 w-5' icon={iconLeading} />}
            {children}
            {iconTrailing && <Icon className='h-5 w-5' icon={iconTrailing} />}
        </button>
    );
};
