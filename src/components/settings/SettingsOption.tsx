import { forwardRef, MouseEvent } from 'react';
import cn from 'classnames';
import { Icon, IconDefinition } from '@/shared/components';
import { isFirefox } from '@/lib/utils/isFirefox';

type SettingsOptionProps = React.ComponentPropsWithRef<'div'> & {
    iconLeading: IconDefinition;
    iconTrailing?: IconDefinition;
    title: string;
    rightContent?: React.ReactNode;
    disabled?: boolean;
    iconClassName?: string;
    variant?: 'primary' | 'error';
    className?: string;
};

export const SettingsOption = forwardRef(function RowLayout(
    {
        iconLeading,
        iconTrailing,
        title,
        rightContent,
        variant = 'primary',
        disabled,
        onClick,
        iconClassName,
        className,
        ...rest
    }: SettingsOptionProps,
    forwardedRef: React.Ref<HTMLDivElement>,
) {
    return (
        <div
            className={cn(
                'relative flex w-full max-h-13 p-4 cursor-pointer gap-3 items-center border-none bg-none focus-visible:-outline-offset-2',
                {
                    'transition-smoothEase': !isFirefox,
                    'transition-firefoxSmoothEase focus-visible:outline-2 focus-visible:-outline-offset-2':
                        isFirefox,
                    'hover:bg-theme-secondary-50 dark:hover:bg-theme-secondary-700':
                        variant === 'primary',
                    'hover:bg-theme-error-50 dark:hover:bg-theme-error-800/20 text-theme-error-600 dark:text-theme-error-500 group':
                        variant === 'error',
                },
                className,
            )}
            ref={forwardedRef}
            onClick={(e: MouseEvent<HTMLDivElement>) => {
                if (!disabled && onClick) {
                    onClick(e);
                }
            }}
            tabIndex={0}
            aria-label={title}
            {...rest}
        >
            <span className='flex w-full gap-3 items-start'>
                <span className='flex justify-center items-center overflow-hidden'>
                    <span
                        className={cn(
                            'w-5 h-5 text-theme-secondary-500 dark:text-theme-secondary-300',
                            {
                                'transition-smoothEase group-hover:text-theme-error-500':
                                    variant === 'error',
                            },
                        )}
                    >
                        <Icon className='w-5 h-5' icon={iconLeading} />
                    </span>
                </span>

                <span className='flex items-center justify-between w-full'>
                    <span className='flex flex-col items-start gap-1'>
                        <p
                            className={cn('typeset-headline font-normal', {
                                'text-theme-secondary-500 dark:text-theme-secondary-300': disabled,
                                'text-light-black dark:text-white': !disabled,
                                'transition-smoothEase group-hover:text-theme-error-500':
                                    variant === 'error',
                            })}
                        >
                            {title}
                        </p>
                    </span>

                    <span className='flex items-center'>
                        {rightContent}

                        {iconTrailing && (
                            <span className='flex items-center gap-2'>
                                {iconTrailing && (
                                    <Icon
                                        icon={iconTrailing}
                                        className={cn(
                                            'w-5 h-5',
                                            {
                                                'text-theme-secondary-500 dark:text-theme-secondary-300':
                                                    disabled,
                                                'text-light-black dark:text-white': !disabled,
                                                'transition-smoothEase group-hover:text-theme-error-500':
                                                    variant === 'error',
                                            },
                                            iconClassName,
                                        )}
                                    />
                                )}
                            </span>
                        )}
                    </span>
                </span>
            </span>
        </div>
    );
});
