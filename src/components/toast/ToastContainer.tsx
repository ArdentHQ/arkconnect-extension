import { FlexContainer } from '@/shared/components';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import * as UIStore from '@/lib/store/ui';
import Toast from './Toast';
import styled from 'styled-components';
import { useEffect } from 'react';

export enum ToastPosition {
  LOWER = '32px',
  HIGH = '92px',
  EXTRA_HIGH = '160px',
}

const ToastContainer = () => {
  const dispatch = useAppDispatch();
  const toasts = useAppSelector(UIStore.selectToasts);

  useEffect(() => {
    if (!toasts.length) return;

    dispatch(UIStore.toastsReseted());
  }, []);

  return (
    <StyledContainer
      position='fixed'
      flexDirection='column'
      alignItems='center'
      bottom={toasts[0]?.toastPosition || ToastPosition.LOWER}
      left='50%'
      zIndex='100'
      width='100%'
      paddingX='16'
    >
      {toasts.map((toast, index) => (
        <Toast key={index} type={toast.type} message={toast.message} />
      ))}
    </StyledContainer>
  );
};

const StyledContainer = styled(FlexContainer)`
  transform: translateX(-50%);
`;

export default ToastContainer;
