import { ChangeEvent, FC, useState } from 'react';
import cn from 'classnames';
import { handleInputKeyAction } from '@/lib/utils/handleKeyAction';
import { isFirefox } from '@/lib/utils/isFirefox';

type CheckboxProps = {
    checked: boolean;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    name: string;
    id: string;
    title?: string;
    helperText?: string;
    disabled?: boolean;
    tabIndex?: number;
};

export const Checkbox: FC<CheckboxProps> = ({
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
            htmlFor={id}
            className={cn('group relative flex', {
                'pointer-events-none cursor-not-allowed': disabled,
                'pointer-events-auto cursor-pointer': !disabled,
            })}
        >
            <span className='ml-7 flex flex-col items-start gap-[5px]'>
                {title && (
                    <span className='typeset-heading font-normal leading-tight text-subtle-black dark:text-white'>
                        {title}
                    </span>
                )}
                {helperText && (
                    <span className='typeset-body font-normal leading-tight text-theme-secondary-600 dark:text-theme-secondary-300'>
                        {helperText}
                    </span>
                )}
            </span>

            <input
                id={id}
                type='checkbox'
                name={name}
                disabled={disabled}
                checked={checked}
                onChange={onChange}
                tabIndex={tabIndex}
                onFocus={(event) => {
                    setIsFocusWithin(event.relatedTarget !== null);
                }}
                onBlur={() => {
                    setIsFocusWithin(false);
                }}
                className='z-[-1] h-0 w-0 opacity-0'
            />
            <span
                role='checkbox'
                aria-label={`${title} checkbox`}
                aria-checked={checked}
                aria-disabled={disabled}
                onKeyDown={(e) =>
                    handleInputKeyAction(e, onChange, e as unknown as ChangeEvent<HTMLInputElement>)
                }
                className={cn('checkbox-indicator', {
                    'transition-firefoxSmoothEase': isFirefox,
                    'transition-smoothEase': !isFirefox,
                    'outline outline-2 outline-offset-2 outline-theme-primary-600': isFocusWithin,
                    'cursor-not-allowed': disabled,
                })}
            />
        </label>
    );
};
