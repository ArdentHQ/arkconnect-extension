import { WebTarget } from 'styled-components';


import { forwardRef, LegacyRef, MouseEventHandler } from 'react';
import cn from 'classnames';
import { Icon, IconDefinition } from '@/shared/components';
import constants from '@/constants';
import { Address, LedgerIcon, TestnetIcon } from '@/components/wallet/address/Address.blocks';
import { isFirefox } from '@/lib/utils/isFirefox';
import Amount from '@/components/wallet/Amount';

type RowLayoutProps = React.ComponentPropsWithRef<'div'> & {
    iconLeading?: React.ReactNode;
    iconTrailing?: IconDefinition;
    title?: string;
    helperText?: string | string[];
    rightHelperText?: string;
    children?: React.ReactNode | React.ReactNode[];
    testnetIndicator?: boolean;
    ledgerIndicator?: boolean;
    disabled?: boolean;
    currency?: string;
    address?: string;
    tabIndex?: number;
    as?: void | WebTarget | undefined;
    iconClassName?: string;
    className?: string;
    variant?: 'primary' | 'errorFree';
    onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
};

export const RowLayout = forwardRef(function RowLayout(
    {
        address,
        as,
        children,
        className,
        currency,
        disabled,
        helperText,
        iconClassName,
        iconLeading,
        iconTrailing,
        ledgerIndicator,
        onClick,
        onKeyDown,
        rightHelperText,
        tabIndex = 0,
        testnetIndicator,
        title,
        variant = 'primary',
    }: RowLayoutProps,
    forwardedRef: React.Ref<HTMLDivElement>,
) {
    const hasPointer = onClick !== undefined;

    const containerStyles = cn('relative flex w-full max-h-[74px] p-4 gap-3 disabled:cursor-not-allowed disabled:pointer-events-none', {
        'cursor-pointer': hasPointer,
        'cursor-auto': !hasPointer,
        'border-none bg-transparent': as === 'button',
        'rounded-2xl bg-white dark:bg-subtle-black shadow-[0_1px_4px_0_rgba(0,0,0,0.05)] hover:shadow-[0_0_0_1px] hover:shadow-theme-secondary-200 hover:dark:shadow-theme-secondary-600': variant === 'primary',
        'rounded-[20px] bg-white dark:bg-subtle-black shadow-[0_1px_4px_0_rgba(0,0,0,0.05)] border border-solid border-theme-primary-700 dark:border-theme-primary-650': variant === 'errorFree',
        'focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2': isFirefox
    }, className);

    if(as === 'button') {
        return (
            <button 
                className={containerStyles} 
                tabIndex={tabIndex}
                ref={forwardRef as any as LegacyRef<HTMLButtonElement>}
                onClick={onClick as any as MouseEventHandler<HTMLButtonElement>}
                onKeyDown={onKeyDown as any as React.KeyboardEventHandler<HTMLButtonElement>}
            >
                <span className='w-full gap-3 flex items-star'>
                    {iconLeading && iconLeading}

                    <span className='flex items-center justify-between w-full'>
                        <span className='flex flex-col items-start gap-1 '>
                            <span className='flex flex-row items-center gap-1.5'>
                                {title && (
                                    <span className={cn('typeset-headline', {
                                        'font-medium': helperText,
                                        'font-normal': !helperText,
                                        'text-theme-secondary-500 dark:text-theme-secondary-300': disabled,
                                        'text-light-black dark:text-white': !disabled
                                    })}>
                                        {title}
                                    </span>
                                )}

                                {ledgerIndicator && <LedgerIcon />}
                                {testnetIndicator && <TestnetIcon />}
                            </span>

                            {helperText && (
                                <span className='flex text-sm leading-[18px] text-left items-center gap-[5px] text-theme-secondary-500 dark:text-theme-secondary-300'>
                                    {address && (
                                        <>
                                            <Address
                                                address={address}
                                                tooltipPlacement='bottom-start'
                                            />
                                            <span> • </span>
                                        </>
                                    )}
                                    {Array.isArray(helperText) ?
                                        helperText.map((item, index) => {
                                            if(index === 0) {
                                                return (
                                                    <Amount
                                                        value={Number(item)}
                                                        maxDigits={
                                                            constants.MAX_CURRENCY_DIGITS_ALLOWED
                                                        }
                                                        ticker={currency ?? ''}
                                                        withTicker={!!currency}
                                                        key={index}
                                                        tooltipPlacement='bottom-start'
                                                    />
                                                );
                                            } else {
                                                return (
                                                    <span key={index}>
                                                        {index > 0 && helperText.length > 1 && (
                                                            <span className='flex gap-[5px]'>
                                                                <span>{' '}•{' '}</span>
                                                                <span>{item}</span>
                                                            </span>
                                                        )}
                                                    </span>
                                                );
                                            }
                                        })
                                        :
                                        helperText
                                    }
                                </span>
                            )}
                        </span>

                        <span className='flex items-center'>
                            {rightHelperText && (
                                <span
                                    className='typeset-headline font-normal text-theme-secondary-500 dark:text-theme-secondary-300 mr-2'
                                >
                                    {rightHelperText}
                                </span>
                            )}

                            {children && (
                                <span className={cn({
                                    'mr-4': iconTrailing,
                                    'mr-0': !iconTrailing
                                })}>
                                    {children}
                                </span>
                            )}

                            {iconTrailing && (
                                <span className='flex items-center gap-2'>
                                    {iconTrailing && (
                                        <Icon
                                            className={cn(
                                                'h-5 w-5',
                                                {
                                                    'text-theme-secondary-500 dark:text-theme-secondary-300':
                                                        disabled,
                                                    'text-light-black dark:text-white': !disabled,
                                                },
                                                iconClassName,
                                            )}
                                            icon={iconTrailing}
                                        />
                                    )}
                                </span>
                            )}
                        </span>
                    </span>
                </span>
            </button>
        );
    }

    return (
        <div 
            className={containerStyles}
            tabIndex={tabIndex}
            ref={forwardedRef}
            onKeyDown={onKeyDown}
            onClick={onClick}
        >
            <div className='w-full gap-3 flex items-star'>
                {iconLeading && iconLeading}

                <div className='flex items-center justify-between w-full'>
                    <div className='flex flex-col items-start gap-1'>
                        <div className='flex flex-row items-center gap-1.5'>
                            {title && (
                                <p className={cn('typeset-headline', {
                                    'font-medium': helperText,
                                    'font-normal': !helperText,
                                    'text-theme-secondary-500 dark:text-theme-secondary-300': disabled,
                                    'text-light-black dark:text-white': !disabled
                                })}>
                                    {title}
                                </p>
                            )}

                            {ledgerIndicator && <LedgerIcon />}
                            {testnetIndicator && <TestnetIcon />}
                        </div>

                        {helperText && (
                            <div className='flex text-sm leading-[18px] text-left items-center gap-[5px] text-theme-secondary-500 dark:text-theme-secondary-300'>
                                {address && (
                                    <>
                                        <Address
                                            address={address}
                                            tooltipPlacement='bottom-start'
                                        />
                                        <span> • </span>
                                    </>
                                )}
                                {Array.isArray(helperText) ?
                                    helperText.map((item, index) => {
                                        if(index === 0) {
                                            return (
                                                <Amount
                                                    value={Number(item)}
                                                    maxDigits={
                                                        constants.MAX_CURRENCY_DIGITS_ALLOWED
                                                    }
                                                    ticker={currency ?? ''}
                                                    withTicker={!!currency}
                                                    key={index}
                                                    tooltipPlacement='bottom-start'
                                                />
                                            );
                                        } else {
                                            return (
                                                <div key={index}>
                                                    {index > 0 && helperText.length > 1 && (
                                                        <div className='flex gap-[5px]'>
                                                            <div>{' '}•{' '}</div>
                                                            <div>{item}</div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        }
                                    })
                                    :
                                    helperText
                                }
                            </div>
                        )}
                    </div>
                    
                    <div className='flex items-center'>
                            {rightHelperText && (
                                <p
                                    className='typeset-headline font-normal text-theme-secondary-500 dark:text-theme-secondary-300 mr-2'
                                >
                                    {rightHelperText}
                                </p>
                            )}

                            {children && (
                                <div className={cn({
                                    'mr-4': iconTrailing,
                                    'mr-0': !iconTrailing
                                })}>
                                    {children}
                                </div>
                            )}

                            {iconTrailing && (
                                <div className='flex items-center gap-2'>
                                    {iconTrailing && (
                                        <Icon
                                            className={cn(
                                                'h-5 w-5',
                                                {
                                                    'text-theme-secondary-500 dark:text-theme-secondary-300':
                                                        disabled,
                                                    'text-light-black dark:text-white': !disabled,
                                                },
                                                iconClassName,
                                            )}
                                            icon={iconTrailing}
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                </div>
            </div>
        </div>
    );
});
