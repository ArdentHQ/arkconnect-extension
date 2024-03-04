import { MutableRefObject } from 'react';
import cn from 'classnames';
import { Icon, IconDefinition } from '@/shared/components';

type InputProps = React.ComponentPropsWithRef<'input'> & {
    iconLeading?: IconDefinition;
    iconTrailing?: IconDefinition;
    trailing?: React.ReactNode;
    disabled?: boolean;
    labelText?: string;
    helperText?: string;
    innerRef?: MutableRefObject<HTMLInputElement | null>;
    variant?: 'primary' | 'destructive' | 'errorFree';
    inputClassNames?: string;
};

export const Input = ({
    iconLeading,
    iconTrailing,
    trailing,
    labelText,
    helperText,
    variant,
    id,
    innerRef,
    inputClassNames,
    ...rest
}: InputProps) => {
    return (
        <div className='flex flex-col gap-1.5'>
            {labelText && (
                <label
                    htmlFor={id}
                    className='text-theme-secondary-500 dark:text-theme-secondary-200 font-medium text-sm leading-tight'
                >
                    {labelText}
                </label>
            )}

            <div className='relative w-full'>
                {iconLeading && (
                    <div className={'absolute top-1/2 -translate-y-1/2 left-3 right-auto'}>
                        <Icon className='h-5 w-5' icon={iconLeading} />
                    </div>
                )}

                <input
                    className={cn(
                        'text-base font-normal w-full px-3 py-4 max-h-13 rounded-lg transition-smoothEase border-none outline-none disabled:cursor-not-allowed disabled:pointer-events-none placeholder:text-theme-secondary-400',
                        {
                            'input-primary': variant === 'primary',
                            'input-destructive': variant === 'destructive',
                            'input-errorFree': variant === 'errorFree',
                            'pl-10': iconLeading,
                            'pr-10': iconTrailing,
                        },
                        inputClassNames,
                    )}
                    id={id}
                    ref={innerRef}
                    {...rest}
                />

                {iconTrailing && (
                    <div className='absolute top-1/2 -translate-y-1/2 left-auto right-3'>
                        <Icon className='h-5 w-5' icon={iconTrailing} />
                    </div>
                )}

                {trailing && (
                    <div className='absolute top-1/2 -translate-y-1/2 left-auto right-3'>
                        {trailing}
                    </div>
                )}
            </div>

            {helperText && (
                <p
                    className={cn('text-sm leading-tight font-normal', {
                        'text-theme-error-500': variant === 'destructive',
                        'text-theme-secondary-500 dark:text-theme-secondary-300':
                            variant !== 'destructive',
                    })}
                >
                    {helperText}
                </p>
            )}
        </div>
    );
};
