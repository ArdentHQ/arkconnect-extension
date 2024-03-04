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
            className={cn('relative flex group', {
                'cursor-not-allowed pointer-events-none': disabled,
                'cursor-pointer pointer-events-auto': !disabled,
            })}
        >
            <span className='flex flex-col items-start gap-[5px] ml-7'>
                {title && <span className='leading-tight font-normal typeset-heading'>{title}</span>}
                {helperText && <span className='leading-tight font-normal typeset-body'>{helperText}</span>}
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
                className='h-0 w-0 opacity-0 z-[-1]'
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
