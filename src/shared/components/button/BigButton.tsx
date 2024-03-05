import cn from 'classnames';
import { Icon, IconDefinition } from '@/shared/components';
import { isFirefox } from '@/lib/utils/isFirefox';

type BigButtonProps = React.ComponentPropsWithRef<'button'> & {
    iconLeading?: IconDefinition;
    iconTrailing?: IconDefinition;
    title: string;
    helperText?: string;
    className?: string;
};

export const BigButton = ({
    iconLeading,
    iconTrailing,
    title,
    helperText,
    className,
    ...rest
}: BigButtonProps) => {
    return (
        <button
            className={cn(
                'border border-solid border-transparent rounded-[20px] bg-white dark:bg-subtle-black shadow-[0_1px_4px_0_rgba(0,0,0,0.05)] flex w-full p-4 max-h-24 box-border cursor-pointer gap-3 hover:border hover:border-solid hover:border-theme-primary-800 hover:dark:border-theme-primary-600 disabled:cursor-not-allowed disabled:pointer-events-none',
                {
                    'transition-firefoxSmoothEase focus-visible:outline focus-visible:outline-2':
                        isFirefox,
                    'transition-smoothEase': !isFirefox,
                },
                className,
            )}
            {...rest}
        >
            <span className='flex w-full gap-3 items-start'>
                {iconLeading && <Icon className='h-6 w-6' icon={iconLeading} />}

                <span className='flex items-center justify-between w-full'>
                    <span className='flex flex-col items-start w-full gap-2'>
                        {title && <span className='typeset-heading font-medium'>{title}</span>}
                        {helperText && (
                            <span className='typeset-body text-left font-normal'>{helperText}</span>
                        )}
                    </span>

                    <span className='h-full flex flex-col items-center justify-center text-light-black dark:text-white'>
                        {iconTrailing && <Icon className='h-5 w-5' icon={iconTrailing} />}
                    </span>
                </span>
            </span>
        </button>
    );
};
