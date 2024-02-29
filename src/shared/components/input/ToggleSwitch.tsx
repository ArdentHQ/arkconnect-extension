import { FC, ChangeEvent, KeyboardEvent } from 'react';
import { handleInputKeyAction } from '@/lib/utils/handleKeyAction';
import { isFirefox } from '@/lib/utils/isFirefox';
import cn from 'classnames';

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
            className={cn('relative flex w-9 h-5 group', {
                'cursor-not-allowed pointer-events-none': disabled,
                'cursor-pointer pointer-events-auto': !disabled,
            })}
        >
            <div className='flex flex-col items-start gap-[5px] ml-11'>
                <p className='w-max text-base-black dark:text-white font-normal leading-tight text-base'>
                    {title}
                </p>
                {helperText && (
                    <p className='text-theme-secondary-600 dark:text-theme-secondary-300 font-normal text-sm leading-tight'>
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
                className='h-0 w-0 opacity-0 hidden'
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
