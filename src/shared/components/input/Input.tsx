import { MutableRefObject } from 'react';
import cn from 'classnames';
import { twMerge } from 'tailwind-merge';

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
                    className='text-sm font-medium leading-tight text-theme-secondary-500 dark:text-theme-secondary-200'
                >
                    {labelText}
                </label>
            )}

            <div className='relative flex w-full items-center'>
                <input
                    className={twMerge(cn(
                        'transition-smoothEase text-input max-h-13 w-full rounded-lg border-none px-3 py-4 text-base font-normal outline-none placeholder:text-theme-secondary-400 disabled:pointer-events-none disabled:cursor-not-allowed',
                        {
                            'text-input-primary': variant === 'primary',
                            'text-input-destructive': variant === 'destructive',
                            'text-input-errorFree': variant === 'errorFree',
                        },
                    ), className)}
                    id={id}
                    ref={innerRef}
                    {...rest}
                />

                {trailing && <div className='absolute left-auto right-3'>{trailing}</div>}
            </div>

            {helperText && (
                <p
                    className={cn('text-sm font-normal leading-tight', {
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
