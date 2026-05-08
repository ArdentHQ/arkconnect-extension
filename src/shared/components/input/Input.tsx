import { MutableRefObject, ReactNode, useState } from 'react';

import cn from 'classnames';

type InputProps = React.ComponentPropsWithRef<'input'> & {
    trailing?: React.ReactNode;
    leading?: React.ReactNode;
    disabled?: boolean;
    labelText?: string;
    helperText?: string;
    innerRef?: MutableRefObject<HTMLInputElement | null>;
    variant?: 'primary' | 'destructive' | 'errorFree';
    className?: string;
    hasFocus?: boolean;
    secondaryText?: string | React.ReactNode;
    displayValue?: ReactNode;
};

export const Input = ({
    trailing,
    leading,
    labelText,
    helperText,
    variant,
    id,
    innerRef,
    className,
    secondaryText,
    displayValue,
    hasFocus,
    ...rest
}: InputProps) => {
    const [focused, setFocused] = useState(false);

    const handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        setFocused(hasFocus !== undefined ? hasFocus : false);
        if (rest.onBlur) rest.onBlur(event);
    };

    const handleInputFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        setFocused(true);
        if (rest.onFocus) rest.onFocus(event);
    };

    return (
        <div className='flex flex-col gap-1.5'>
            <div className='flex items-center justify-between'>
                {labelText && (
                    <label
                        htmlFor={id}
                        className='text-theme-secondary-500 dark:text-theme-secondary-200 text-sm leading-tight font-medium'
                    >
                        {labelText}
                    </label>
                )}

                {secondaryText && (
                    <span className='text-theme-secondary-500 dark:text-theme-secondary-200 text-sm font-medium'>
                        {secondaryText}
                    </span>
                )}
            </div>

            <div
                className='relative flex w-full items-center'
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(hasFocus !== undefined ? hasFocus : false)}
            >
                {leading && <div className='pointer-events-none absolute left-3'>{leading}</div>}

                {!focused && displayValue && (
                    <span
                        className='absolute top-3.5 left-3 cursor-text'
                        onClick={() => {
                            innerRef?.current?.click();
                            innerRef?.current?.focus();
                        }}
                    >
                        {displayValue}
                    </span>
                )}
                <input
                    className={cn(
                        'transition-smoothEase text-input placeholder:text-theme-secondary-400 max-h-13 w-full rounded-lg border-none px-3 py-4 text-base font-normal outline-none disabled:pointer-events-none disabled:cursor-not-allowed',
                        {
                            'text-input-primary': variant === 'primary',
                            'text-input-destructive': variant === 'destructive',
                            'text-input-errorFree': variant === 'errorFree',
                            'text-transparent!': !focused && displayValue,
                        },
                        className,
                    )}
                    id={id}
                    ref={innerRef}
                    onFocus={(e) => handleInputFocus(e)}
                    onBlur={(e) => handleInputBlur(e)}
                    {...rest}
                />

                {trailing && <div className='absolute right-3 left-auto'>{trailing}</div>}
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
