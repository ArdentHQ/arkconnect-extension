import { ReactNode, useRef } from 'react';
import FocusTrap from 'focus-trap-react';
import cn from 'classnames';
import Portal from '../utils/Portal';
import useOnClickOutside from '@/lib/hooks/useOnClickOutside';
import {
    Button,
    Container,
    Icon,
    Icon as IconComponent,
    IconDefinition,
} from '@/shared/components';

type ModalProps = {
    children: ReactNode | ReactNode[];
    onClose: () => void;
    className?: string;
    icon?: IconDefinition | ReactNode;
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
};

const ModalCloseIcon = ({ onClose }: { onClose: () => void }) => {
    return (
        <Container onClick={onClose} className='c-pointer' as='button'>
            <Icon icon='x' className='h-4.5 w-4.5 text-light-black dark:text-white' />
        </Container>
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
        <div className={cn('flex w-13 h-13 border border-solid border-theme-secondary-200 dark:border-theme-secondary-600 rounded-lg relative justify-center items-center shadow-[0_1px_4px_0_rgba(0,0,0,0.05)]', {
            'text-theme-error-600 dark:text-theme-error-500': variant === 'danger',
            'text-subtle-black dark:text-subtle-white': variant !== 'danger',
        }, className)}>
            <IconComponent icon={icon} className={cn('h-6 w-6', iconClassName)} />
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
    variant,
    hideCloseButton = false,
    footer,
    containerClassName,
    activateFocusTrap = true,
    focusTrapOptions,
}: ModalProps) => {
    const ref = useRef<HTMLDivElement | null>(null);

    useOnClickOutside(ref, onClose);

    return (
        <Portal>
            <FocusTrap active={activateFocusTrap} focusTrapOptions={focusTrapOptions}>
                <div className='flex justify-center items-center overflow-y-hidden overflow-x-auto fixed bottom-0 top-0 left-0 right-0 z-50 outline-none'>
                    <div className={cn('relative w-auto max-w-max my-auto mx-4', className)}>
                        <div className='border-none rounded-xl relative flex flex-col w-full outline-none' ref={ref}>
                            <div className={cn('flex flex-col gap-6 rounded-xl bg-white dark:bg-light-black', {
                                'p-4': !containerClassName
                            }, containerClassName)}>
                                {(icon || !hideCloseButton) && (
                                    <div className='flex justify-between items-start'>
                                        {icon && (
                                            <>
                                                {typeof icon === 'string' ? (
                                                    <ModalIcon
                                                        icon={icon as IconDefinition}
                                                        variant={variant}
                                                    />
                                                ) : (
                                                    icon
                                                )}
                                            </>
                                        )}
                                        {!hideCloseButton && <ModalCloseIcon onClose={onClose} />}
                                    </div>
                                )}

                                {children}

                                {footer === undefined ? (
                                    <>
                                        {(onCancel || onResolve) && (
                                            <div className='flex justify-between items-center gap-2'>
                                                {onCancel && (
                                                    <Button
                                                        variant='secondaryBlack'
                                                        onClick={onCancel}
                                                    >
                                                        Cancel
                                                    </Button>
                                                )}

                                                {onResolve && (
                                                    <Button
                                                        variant='destructiveSecondary'
                                                        onClick={onResolve}
                                                    >
                                                        Yes
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
                        </div>
                    </div>
                </div>
            </FocusTrap>

            <div className='fixed top-0 bottom-0 left-0 opacity-50 w-full bg-[#030303]' />
        </Portal>
    );
};

export default Modal;
