import { useEffect } from 'react';
import cn from 'classnames';
import Toast from './Toast';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { selectToasts, toastsReseted } from '@/lib/store/ui';

export enum ToastPosition {
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
                'fixed left-1/2 z-50 flex w-full -translate-x-1/2 flex-col items-center px-4',
                toasts[0]?.toastPosition || ToastPosition.LOWER,
            )}
        >
            {toasts.map((toast, index) => (
                <Toast key={index} type={toast.type} message={toast.message} />
            ))}
        </div>
    );
};

export default ToastContainer;
