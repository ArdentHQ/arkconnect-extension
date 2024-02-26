import { loadingModalUpdated, selectLoadingModal } from '@/lib/store/modal';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import constants from '@/constants';

const useLoadingModal = ({
  loadingMessage,
  completedMessage,
  other = {},
}: {
  loadingMessage?: string;
  completedMessage?: string;
  other?: Record<string, string>;
}) => {
  const { isOpen: isLoading } = useAppSelector(selectLoadingModal);

  const dispatch = useAppDispatch();

  const open = () => {
    dispatch(
      loadingModalUpdated({
        isOpen: true,
        isLoading: false,
        completedMessage,
        loadingMessage,
        ...other,
      }),
    );
  };

  const setLoading = () => {
    dispatch(
      loadingModalUpdated({
        isOpen: true,
        isLoading: true,
        completedMessage,
        loadingMessage,
        ...other,
      }),
    );
  };

  const setCompleted = (): void => {
    dispatch(
      loadingModalUpdated({
        isOpen: true,
        isLoading: false,
        completedMessage,
        loadingMessage,
        ...other,
      }),
    );
  };

  const close = (): void => {
    dispatch(
      loadingModalUpdated({
        isOpen: false,
        isLoading: false,
        completedMessage,
        loadingMessage,
        ...other,
      }),
    );
  };

  const setCompletedAndClose = (): Promise<void> => {
    setCompleted();

    return new Promise((resolve) => {
      setTimeout(() => {
        dispatch(
          loadingModalUpdated({
            isOpen: false,
            isLoading: false,
            completedMessage,
            loadingMessage,
            ...other,
          }),
        );

        resolve();
      }, constants.SHOW_MESSAGE_AFTER_ACTION_DURING_MS);
    });
  };

  return {
    isLoading,
    open,
    close,
    setLoading,
    setCompleted,
    setCompletedAndClose,
  };
};

export default useLoadingModal;
