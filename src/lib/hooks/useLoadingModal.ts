import { loadingModalUpdated, selectLoadingModal } from '@/lib/store/modal';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import constants from '@/constants';

const useLoadingModal = ({
  completedMessage,
  loadingMessage,
}: {
  completedMessage: string;
  loadingMessage: string;
}) => {
  const { isOpen: isLoading } = useAppSelector(selectLoadingModal);

  const dispatch = useAppDispatch();

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
    setLoading,
    setCompleted,
    setCompletedAndClose,
  };
};

export default useLoadingModal;
