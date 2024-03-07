import { ChangeEvent, FC, useState } from 'react';
import cn from 'classnames';
import { isFirefox } from '@/lib/utils/isFirefox';

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
                'pointer-events-none cursor-not-allowed': disabled,
                'group pointer-events-auto cursor-pointer': !disabled,
            })}
            htmlFor={id}
        >
            <div className='flex flex-col items-start gap-[0.3125rem]'>
                {title && <p className='typeset-heading'>{title}</p>}
                {helperText && <p className='typeset-body'>{helperText}</p>}
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
                className={cn('h-0 w-0 opacity-0', {
                    'focus-visible:outline-solid focus-visible:outline-2': isFirefox,
                })}
            />
            <div
                className={cn('radio-indicator', {
                    'outline outline-2 outline-offset-2 outline-theme-primary-600': isFocusWithin,
                })}
            />
        </label>
    );
};
