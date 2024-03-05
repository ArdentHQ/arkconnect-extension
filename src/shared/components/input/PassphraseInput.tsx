import { forwardRef } from 'react';
import cn from 'classnames';

type TextAreaProps = React.ComponentPropsWithRef<'textarea'> & {
    disabled?: boolean;
    labelText?: string;
    helperText?: string;
    className?: string;
    hideValue: boolean;
    variant?: 'primary' | 'destructive' | 'errorFree';
};


export const PassphraseInput = forwardRef(function TextArea(
    props: TextAreaProps,
    ref: React.Ref<HTMLTextAreaElement>,
) {
    const { labelText, helperText, variant, id, rows, value, onChange, className, hideValue, ...rest } = props;

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
                    className='typeset-body font-medium text-theme-secondary-500 dark:text-theme-secondary-300'
                >
                    {labelText}
                </label>
            )}
            
            <div className='relative w-full'>
                <textarea
                    className={cn('text-base font-normal w-full p-3 rounded-lg shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-smoothEase border-none outline-none resize-none disabled:cursor-not-allowed disabled:pointer-events-none placeholder:text-theme-secondary-400', {
                        'passphrase-primary': variant === 'primary',
                        'passphrase-destructive': variant === 'destructive',
                        'passphrase-errorFree': variant === 'errorFree',
                        'text-security-disc': hideValue,
                    }, className)}
                    rows={rows || 4}
                    ref={ref}
                    id={id}
                    value={value}
                    onChange={handleOnChange}
                    {...rest}
                />
            </div>

            {helperText && (
                <p className={cn('typeset-body', {
                    'text-theme-error-600 dark:text-theme-error-500': variant === 'destructive',
                    'text-theme-secondary-500 dark:text-theme-secondary-300': variant !== 'destructive',
                })}>
                    {helperText}
                </p>
            )}
        </div>
    );
});
