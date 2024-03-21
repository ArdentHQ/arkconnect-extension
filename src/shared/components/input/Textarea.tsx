// Note: currently unused but keeping it as basic component for future use
import { forwardRef } from 'react';
import cn from 'classnames';
import { twMerge } from 'tailwind-merge';

type TextAreaProps = React.ComponentPropsWithRef<'textarea'> & {
    disabled?: boolean;
    labelText?: string;
    helperText?: string;
    hideText?: boolean;
    className?: string;
    variant?: 'primary' | 'destructive' | 'errorFree';
};

export const TextArea = forwardRef(function TextArea(
    props: TextAreaProps,
    ref: React.Ref<HTMLTextAreaElement>,
) {
    const {
        labelText,
        helperText,
        variant,
        id,
        rows,
        hideText,
        value,
        onChange,
        className,
        ...rest
    } = props;

    const getValue = () => {
        if (!value || typeof value !== 'string') return '';

        if (hideText) {
            return value.replace(/[^\s]/g, '•');
        }
        return value;
    };

    const handleOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (onChange) {
            onChange(event);
        }
    };

    return (
        <div className='flex flex-col gap-1.5'>
            {labelText && (
                <label
                    htmlFor={id}
                    className='text-sm font-medium leading-tight text-theme-secondary-500 dark:text-theme-secondary-300'
                >
                    {labelText}
                </label>
            )}

            <div className='relative w-full'>
                <textarea
                    className={twMerge(cn(
                        'transition-smoothEase textarea w-full resize-none rounded-lg border-none p-3 text-base font-normal leading-5 shadow-secondary-dark outline-none placeholder:text-theme-secondary-400 disabled:pointer-events-none disabled:cursor-not-allowed',
                        {
                            'textarea-primary': variant === 'primary',
                            'textarea-destructive': variant === 'destructive',
                            'textarea-errorFree': variant === 'errorFree',
                        },
                    ),
                    className)}
                    rows={rows || 4}
                    ref={ref}
                    id={id}
                    value={getValue()}
                    onChange={handleOnChange}
                    {...rest}
                />
            </div>

            {helperText && (
                <p
                    className={cn('text-sm font-normal leading-tight', {
                        'text-theme-error-600 dark:text-theme-error-500': variant === 'destructive',
                        'text-theme-secondary-500 dark:text-theme-secondary-300':
                            variant !== 'destructive',
                    })}
                >
                    {helperText}
                </p>
            )}
        </div>
    );
});
