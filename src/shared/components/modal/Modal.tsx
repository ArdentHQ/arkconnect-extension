import { ComponentProps, ReactNode, useRef } from 'react';
import styled from 'styled-components';
import FocusTrap from 'focus-trap-react';
import Portal from '../utils/Portal';
import useOnClickOutside from '@/lib/hooks/useOnClickOutside';
import { FlexContainer, IconDefinition, Icon as IconComponent, Button , Container, Icon } from '@/shared/components';
import useThemeMode from '@/lib/hooks/useThemeMode';

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  opacity: 0.5;
  background: rgba(3, 3, 3, 1);
  width: 100%;
  height: 100%;
  z-index: 40;
`;

const ModalWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden auto;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 50;
  outline: none;
`;

const ModalContent = styled.div`
  position: relative;
  width: auto;
  max-width: max-content;
  margin: auto 16px;
`;

const ModalBody = styled.div`
  border: none;
  border-radius: 12px;
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  outline: none;
`;

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
  contentStyles?: React.CSSProperties;
  activateFocusTrap?: boolean;
  focusTrapOptions?: FocusTrap.Props['focusTrapOptions'];
};

const ModalCloseIcon = ({ onClose }: { onClose: () => void }) => {
  const { getThemeColor } = useThemeMode();

  return (
    <Container
      onClick={onClose}
      className='c-pointer'
      as='button'
      border='none'
      backgroundColor='transparent'
    >
      <Icon icon='x' color={getThemeColor('lightBlack', 'white')} width='18px' height='18px' />
    </Container>
  );
};

export const ModalIcon = ({
  icon,
  iconClassName,
  variant,
  color,
}: {
  icon: IconDefinition;
  iconClassName?: string;
  variant?: 'danger';
  color?: ComponentProps<typeof IconComponent>['color'];
}) => {
  return (
    <FlexContainer
      width='52px'
      height='52px'
      border='1px solid'
      borderColor='toggleInactive'
      borderRadius='8'
      position='relative'
      color={color ?? (variant === 'danger' ? 'error' : 'tooltipBackground')}
      justifyContent='center'
      alignItems='center'
      boxShadow='0px 0.91667px 3.66667px 0px rgba(0, 0, 0, 0.05)'
    >
      <IconComponent icon={icon} width='24px' height='24px' className={iconClassName} />
    </FlexContainer>
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
  containerPadding = '16',
  contentStyles,
  activateFocusTrap = true,
  focusTrapOptions,
}: ModalProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useOnClickOutside(ref, onClose);

  return (
    <Portal>
      <FocusTrap active={activateFocusTrap} focusTrapOptions={focusTrapOptions}>
        <ModalWrapper>
          <ModalContent className={className} style={contentStyles}>
            <ModalBody ref={ref}>
              <FlexContainer
                flexDirection='column'
                gridGap='24px'
                borderRadius='12'
                padding={containerPadding}
                bg='background'
              >
                {(icon || !hideCloseButton) && (
                  <FlexContainer justifyContent='space-between' alignItems='flex-start'>
                    {icon && (
                      <>
                        {typeof icon === 'string' ? (
                          <ModalIcon icon={icon as IconDefinition} variant={variant} />
                        ) : (
                          icon
                        )}
                      </>
                    )}
                    {!hideCloseButton && <ModalCloseIcon onClose={onClose} />}
                  </FlexContainer>
                )}

                {children}

                {footer === undefined ? (
                  <>
                    {(onCancel || onResolve) && (
                      <FlexContainer
                        justifyContent='space-between'
                        alignItems='center'
                        gridGap='8px'
                      >
                        {onCancel && (
                          <Button variant='secondaryBlack' onClick={onCancel}>
                            Cancel
                          </Button>
                        )}

                        {onResolve && (
                          <Button variant='destructiveSecondary' onClick={onResolve}>
                            Yes
                          </Button>
                        )}
                      </FlexContainer>
                    )}
                  </>
                ) : typeof footer === 'function' ? (
                  footer({ onCancel, onResolve })
                ) : (
                  footer
                )}
              </FlexContainer>
            </ModalBody>
          </ModalContent>
        </ModalWrapper>
      </FocusTrap>

      <Backdrop />
    </Portal>
  );
};

export default Modal;
