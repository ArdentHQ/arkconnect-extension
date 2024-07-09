import { ReactNode, useRef } from 'react';
import FocusTrap from 'focus-trap-react';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import Portal from '@/shared/components/utils/Portal';
import useOnClickOutside from '@/lib/hooks/useOnClickOutside';
import { Button, Icon, Icon as IconComponent, IconDefinition } from '@/shared/components';

type ModalProps = {
    children: ReactNode | ReactNode[];
    onClose: () => void;
    className?: string;
    icon?: IconDefinition | ReactNode;
    iconClassName?: string;
    variant?: 'danger';
    onCancel?: () => void;
    onResolve?: () => void;
    hideCloseButton?: boolean;
    footer?:
        | ReactNode
        | ReactNode[]
        | (({
              onCancel,
              onResolve,
          }: {
              onCancel?: () => void;
              onResolve?: () => void;
          }) => ReactNode | ReactNode[]);
    containerPadding?: '0' | '16';
    containerClassName?: string;
    contentStyles?: React.CSSProperties;
    activateFocusTrap?: boolean;
    focusTrapOptions?: FocusTrap.Props['focusTrapOptions'];
    title?: string;
    errorMessage?: string;
};

const ModalCloseIcon = ({ onClose }: { onClose: () => void }) => {
    return (
        <button onClick={onClose}>
            <Icon icon='x' className='h-4.5 w-4.5 text-light-black dark:text-white' />
        </button>
    );
};

export const ModalIcon = ({
    icon,
    iconClassName,
    variant,
    className,
}: {
    icon: IconDefinition;
    iconClassName?: string;
    variant?: 'danger';
    className?: string;
}) => {
    return (
        <div
            className={twMerge(
                cn(
                    'relative flex h-13 w-13 items-center justify-center rounded-lg border border-solid border-theme-secondary-200 shadow-light dark:border-theme-secondary-600',
                    {
                        'text-theme-error-600 dark:text-theme-error-500': variant === 'danger',
                        'text-subtle-black dark:text-subtle-white': variant !== 'danger',
                    },
                ),
                className,
            )}
        >
            <IconComponent icon={icon} className={twMerge('h-6 w-6', iconClassName)} />
        </div>
    );
};

const Modal = ({
    children,
    onClose,
    onCancel,
    onResolve,
    className,
    icon,
    iconClassName,
    variant,
    hideCloseButton = false,
    footer,
    containerClassName,
    activateFocusTrap = true,
    focusTrapOptions,
    title,
    errorMessage,
}: ModalProps) => {
    const { t } = useTranslation();
    const ref = useRef<HTMLDivElement | null>(null);

    useOnClickOutside(ref, onClose);

    return (
        <Portal>
            <FocusTrap active={activateFocusTrap} focusTrapOptions={focusTrapOptions}>
                <div className='fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center overflow-hidden outline-none'>
                    <div className={twMerge('relative mx-4 my-auto w-auto max-w-max', className)}>
                        <div
                            className='relative flex w-full flex-col rounded-xl border-none outline-none'
                            ref={ref}
                        >
                            <div
                                className={twMerge(
                                    cn(
                                        'flex flex-col gap-6 bg-white dark:bg-light-black',
                                        {
                                            'p-4': !containerClassName,
                                            'rounded-xl': !errorMessage,
                                            'rounded-t-xl': errorMessage
                                        },
                                    ),
                                    containerClassName,
                                )}
                            >
                                {(icon || !hideCloseButton) && (
                                    <div
                                        className={cn('flex justify-between', {
                                            'items-center': title && !hideCloseButton,
                                            'items-start': !title,
                                        })}
                                    >
                                        {icon && (
                                            <>
                                                {typeof icon === 'string' ? (
                                                    <ModalIcon
                                                        icon={icon as IconDefinition}
                                                        variant={variant}
                                                        className={iconClassName}
                                                    />
                                                ) : (
                                                    icon
                                                )}
                                            </>
                                        )}
                                        {title && (
                                            <h2 className='text-lg font-medium text-light-black dark:text-white'>
                                                {title}
                                            </h2>
                                        )}
                                        {!hideCloseButton && <ModalCloseIcon onClose={onClose} />}
                                    </div>
                                )}

                                {children}

                                {footer === undefined ? (
                                    <>
                                        {(onCancel || onResolve) && (
                                            <div className='flex items-center justify-between gap-2'>
                                                {onCancel && (
                                                    <Button
                                                        variant='secondaryBlack'
                                                        onClick={onCancel}
                                                    >
                                                        {t('ACTION.CANCEL')}
                                                    </Button>
                                                )}

                                                {onResolve && (
                                                    <Button
                                                        variant='destructiveSecondary'
                                                        onClick={onResolve}
                                                    >
                                                        {t('COMMON.YES')}
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </>
                                ) : typeof footer === 'function' ? (
                                    footer({ onCancel, onResolve })
                                ) : (
                                    footer
                                )}
                            </div>
                            {
                                errorMessage && (
                                    <div className='border-t border-t-theme-error-600 dark:border-t-theme-error-500 bg-theme-error-100 text-theme-error-600 dark:text-theme-error-100 dark:bg-theme-error-800 flex flex-row py-3 px-4 gap-2 items-center rounded-b-xl'>
                                        <Icon icon='information-circle' className='h-5 w-5 flex-none'/>
                                        <span className='text-xs font-normal'>{errorMessage}</span>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </FocusTrap>

            <div className='fixed bottom-0 left-0 top-0 w-full bg-[#030303] opacity-50' />
        </Portal>
    );
};

export default Modal;
