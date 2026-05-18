import cn from 'classnames';
import { twMerge } from 'tailwind-merge';
import { Icon, IconDefinition } from '@/shared/components';
import { isFirefox } from '@/lib/utils/isFirefox';

type BigButtonProps = React.ComponentPropsWithRef<'button'> & {
    iconLeading?: IconDefinition;
    iconTrailing?: IconDefinition;
    title: string;
    helperText?: string;
    className?: string;
};

export const BigButton = ({
    iconLeading,
    iconTrailing,
    title,
    helperText,
    className,
    ...rest
}: BigButtonProps) => {
    return (
        <button
            className={twMerge(
                cn(
                    'rounded-2.5xl shadow-light hover:border-theme-primary-800 dark:bg-subtle-black hover:dark:border-theme-primary-600 box-border flex max-h-24 w-full cursor-pointer gap-3 border border-solid border-transparent bg-white p-4 hover:border hover:border-solid disabled:pointer-events-none disabled:cursor-not-allowed',
                    {
                        'transition-firefoxSmoothEase focus-visible:outline focus-visible:outline-2':
                            isFirefox,
                        'transition-smoothEase': !isFirefox,
                    },
                ),
                className,
            )}
            {...rest}
        >
            <span className='flex w-full items-start gap-3'>
                {iconLeading && <Icon className='h-6 w-6' icon={iconLeading} />}

                <span className='flex w-full items-center justify-between'>
                    <span className='flex w-full flex-col items-start gap-2'>
                        {title && (
                            <span className='typeset-heading text-subtle-black font-medium dark:text-white'>
                                {title}
                            </span>
                        )}
                        {helperText && (
                            <span className='typeset-body text-theme-secondary-600 dark:text-theme-secondary-300 text-left font-normal'>
                                {helperText}
                            </span>
                        )}
                    </span>

                    <span className='text-light-black flex h-full flex-col items-center justify-center dark:text-white'>
                        {iconTrailing && <Icon className='h-5 w-5' icon={iconTrailing} />}
                    </span>
                </span>
            </span>
        </button>
    );
};
