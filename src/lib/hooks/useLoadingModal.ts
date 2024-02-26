import { loadingModalUpdated, selectLoadingModal } from '@/lib/store/modal';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import constants from '@/constants';

const useLoadingModal = ({
  loadingMessage,
  completedMessage,
  completedDescription,
}: {
  loadingMessage?: string;
  completedMessage?: string;
  completedDescription?: string;
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
