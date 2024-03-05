import { MutableRefObject } from 'react';
import cn from 'classnames';

type InputProps = React.ComponentPropsWithRef<'input'> & {
    trailing?: React.ReactNode;
    disabled?: boolean;
    labelText?: string;
    helperText?: string;
    innerRef?: MutableRefObject<HTMLInputElement | null>;
    variant?: 'primary' | 'destructive' | 'errorFree';
    className?: string;
};

export const Input = ({
    trailing,
    labelText,
    helperText,
    variant,
    id,
    innerRef,
    className,
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

            <div className='relative w-full flex items-center'>
                <input
                    className={cn(
                        'text-base font-normal w-full px-3 py-4 max-h-13 rounded-lg transition-smoothEase border-none outline-none disabled:cursor-not-allowed disabled:pointer-events-none placeholder:text-theme-secondary-400 text-input',
                        {
                            'text-input-primary': variant === 'primary',
                            'text-input-destructive': variant === 'destructive',
                            'text-input-errorFree': variant === 'errorFree',
                        },
                        className,
                    )}
                    id={id}
                    ref={innerRef}
                    {...rest}
                />

                {trailing && <div className='absolute left-auto right-3'>{trailing}</div>}
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
