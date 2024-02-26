import { ToastPosition } from '@/components/toast/ToastContainer';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import * as UIStore from '@/lib/store/ui';

const useToast = () => {
  const dispatch = useAppDispatch();
  const toasts = useAppSelector(UIStore.selectToasts);

  const toast = (type: UIStore.ToastType, message: string, toastPosition?: ToastPosition) => {
    const existingToast = toasts.find((toast) => toast.message === message);
    if (existingToast) return;

    dispatch(
      UIStore.toastAdded({ type, message, toastPosition: toastPosition || ToastPosition.LOWER }),
    );

    const timeout = setTimeout(() => {
      dispatch(UIStore.toastRemoved({ type, message, toastPosition: ToastPosition.LOWER }));
      clearTimeout(timeout);
    }, 3000);
  };

  return toast;
};

export default useToast;
