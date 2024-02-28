import { FC, ChangeEvent, useState } from 'react';
import { isFirefox } from '@/lib/utils/isFirefox';
import cn from 'classnames';

type RadioButtonProps = {
    checked: boolean;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    name: string;
    id: string;
    title?: string;
    helperText?: string;
    disabled?: boolean;
    tabIndex?: number;
};

export const RadioButton: FC<RadioButtonProps> = ({
    checked,
    onChange,
    name,
    id,
    title,
    helperText,
    disabled,
    tabIndex = 0,
}) => {
    const [isFocusWithin, setIsFocusWithin] = useState(false);

    return (
        <label
            className={cn('relative flex min-h-5 w-5', {
                'cursor-not-allowed pointer-events-none': disabled,
                'cursor-pointer pointer-events-auto group': !disabled,
            })}
            htmlFor={id}
        >
            <div className='flex flex-col items-start gap-[0.3125rem]'>
                {title && (
                    <p className='text-base font-normal leading-tight text-subtle-black dark:text-white'>
                        {title}
                    </p>
                )}
                {helperText && (
                    <p className='text-sm font-normal leading-tight text-theme-secondary-600 dark:text-theme-secondary-300'>
                        {helperText}
                    </p>
                )}
            </div>
            <input
                id={id}
                type='radio'
                role='radio'
                name={name}
                disabled={disabled}
                onChange={onChange}
                checked={checked}
                aria-checked={checked}
                aria-disabled={disabled}
                aria-label={`${title} radio button`}
                tabIndex={tabIndex}
                onFocus={(event) => {
                    setIsFocusWithin(event.relatedTarget !== null);
                }}
                onBlur={() => {
                    setIsFocusWithin(false);
                }}
                className={cn('h-0 w-0 opacity-0 z-[-1]', {
                    'focus-visible:outline-solid focus-visible:outline-2': isFirefox,
                })}
            />
            <div
                className={cn('radio-indicator', {
                    'outline outline-theme-primary-600 outline-2 outline-offset-2': isFocusWithin,
                })}
            ></div>
        </label>
    );
};
