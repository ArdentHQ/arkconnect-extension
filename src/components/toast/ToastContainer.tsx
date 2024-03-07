import styled from 'styled-components';
import { useEffect } from 'react';
import cn from 'classnames';
import Toast from './Toast';
import { FlexContainer } from '@/shared/components';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { selectToasts, toastsReseted } from '@/lib/store/ui';

export enum ToastPosition {
    /* LOWER = '32px',
    HIGH = '92px',
    EXTRA_HIGH = '160px', */
    LOWER = 'bottom-8',
    HIGH = 'bottom-23',
    EXTRA_HIGH = 'bottom-40',
}

const ToastContainer = () => {
    const dispatch = useAppDispatch();
    const toasts = useAppSelector(selectToasts);

    useEffect(() => {
        if (!toasts.length) return;

        dispatch(toastsReseted());
    }, []);

    return (
        <div
            className={cn(
                'fixed left-1/2 z-100 flex w-full -translate-x-1/2 flex-col items-center px-4',
                toasts[0]?.toastPosition || ToastPosition.LOWER,
            )}
        >
            {toasts.map((toast, index) => (
                <Toast key={index} type={toast.type} message={toast.message} />
            ))}
        </div>
    );

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
