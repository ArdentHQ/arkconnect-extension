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
                'relative flex max-h-13 w-full cursor-pointer items-center gap-3 border-none bg-none p-4 focus-visible:-outline-offset-2',
                {
                    'transition-smoothEase': !isFirefox,
                    'transition-firefoxSmoothEase focus-visible:outline-2 focus-visible:-outline-offset-2':
                        isFirefox,
                    'hover:bg-theme-secondary-50 dark:hover:bg-theme-secondary-700':
                        variant === 'primary',
                    'group text-theme-error-600 hover:bg-theme-error-50 dark:text-theme-error-500 dark:hover:bg-theme-error-800/20':
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
            <span className='flex w-full items-start gap-3'>
                <span className='flex items-center justify-center overflow-hidden'>
                    <span
                        className={cn(
                            'h-5 w-5 text-theme-secondary-500 dark:text-theme-secondary-300',
                            {
                                'transition-smoothEase group-hover:text-theme-error-500':
                                    variant === 'error',
                            },
                        )}
                    >
                        <Icon className='h-5 w-5' icon={iconLeading} />
                    </span>
                </span>

                <span className='flex w-full items-center justify-between'>
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
                                            'h-5 w-5',
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
