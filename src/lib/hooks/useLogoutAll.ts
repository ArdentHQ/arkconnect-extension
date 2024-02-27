import { revertAll } from '../store/ui';
import useOnError from '.';
import { useAppDispatch } from '@/lib/store';

const useLogoutAll = () => {
  const dispatch = useAppDispatch();
  const onError = useOnError();

  const logoutAll = async () => {
    try {
      dispatch(revertAll());

      localStorage.removeItem('persist:ui');
    } catch (error) {
      onError(error);
    }
  };

  return logoutAll;
};

export default useLogoutAll;
