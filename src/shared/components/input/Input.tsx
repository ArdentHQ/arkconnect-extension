import { MutableRefObject, ReactNode, useState } from 'react';
import cn from 'classnames';

type InputProps = React.ComponentPropsWithRef<'input'> & {
    trailing?: React.ReactNode;
    disabled?: boolean;
    labelText?: string;
    helperText?: string;
    innerRef?: MutableRefObject<HTMLInputElement | null>;
    variant?: 'primary' | 'destructive' | 'errorFree';
    className?: string;
    secondaryText?: string | React.ReactNode;
    displayValue?: ReactNode;
};

export const Input = ({
    trailing,
    labelText,
    helperText,
    variant,
    id,
    innerRef,
    className,
    secondaryText,
    displayValue,
    ...rest
}: InputProps) => {
    const [focused, setFocused] = useState(false);

    const handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        setFocused(false);
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
                        className='text-sm font-medium leading-tight text-theme-secondary-500 dark:text-theme-secondary-200'
                    >
                        {labelText}
                    </label>
                )}

                {secondaryText && (
                    <span className='text-sm font-medium text-theme-secondary-500 dark:text-theme-secondary-200'>
                        {secondaryText}
                    </span>
                )}
            </div>

            <div
                className='relative flex w-full items-center'
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
            >
                {!focused && displayValue && (
                    <span
                        className='absolute left-3 top-4 cursor-text'
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
                        'transition-smoothEase text-input max-h-13 w-full rounded-lg border-none px-3 py-4 text-base font-normal outline-none placeholder:text-theme-secondary-400 disabled:pointer-events-none disabled:cursor-not-allowed',
                        {
                            'text-input-primary': variant === 'primary',
                            'text-input-destructive': variant === 'destructive',
                            'text-input-errorFree': variant === 'errorFree',
                            '!text-transparent': !focused && displayValue,
                        },
                        className,
                    )}
                    id={id}
                    ref={innerRef}
                    onFocus={(e) => handleInputFocus(e)}
                    onBlur={(e) => handleInputBlur(e)}
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
