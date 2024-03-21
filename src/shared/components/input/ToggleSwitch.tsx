import { ChangeEvent, FC, KeyboardEvent } from 'react';
import cn from 'classnames';
import { handleInputKeyAction } from '@/lib/utils/handleKeyAction';
import { isFirefox } from '@/lib/utils/isFirefox';

type ToggleSwitchProps = {
    checked: boolean;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    id: string;
    disabled?: boolean;
    title?: string;
    helperText?: string;
};

export const ToggleSwitch: FC<ToggleSwitchProps> = ({
    checked,
    onChange,
    id,
    disabled,
    title,
    helperText,
}) => {
    return (
        <label
            htmlFor={id}
            className={cn('group relative flex h-5 w-9', {
                'pointer-events-none cursor-not-allowed': disabled,
                'pointer-events-auto cursor-pointer': !disabled,
            })}
        >
            <div className='ml-11 flex flex-col items-start gap-1.25'>
                <p className='text-base-black w-max text-base font-normal leading-tight dark:text-white'>
                    {title}
                </p>
                {helperText && (
                    <p className='text-sm font-normal leading-tight text-theme-secondary-600 dark:text-theme-secondary-300'>
                        {helperText}
                    </p>
                )}
            </div>
            <input
                id={id}
                type='checkbox'
                disabled={disabled}
                checked={checked}
                onChange={onChange}
                tabIndex={-1}
                className='hidden h-0 w-0 opacity-0'
            />
            <div
                role='checkbox'
                tabIndex={0}
                aria-label={`${title} slider`}
                aria-checked={checked}
                aria-disabled={disabled}
                onKeyDown={(e: KeyboardEvent<HTMLSpanElement>) =>
                    handleInputKeyAction(e, onChange, e as unknown as ChangeEvent<HTMLInputElement>)
                }
                className={cn('toggle-switch-slider', {
                    'transition-firefoxSmoothEase focus-visible:outline focus-visible:outline-2':
                        isFirefox,
                    'transition-smoothEase': !isFirefox,
                })}
            />
        </label>
    );
};
