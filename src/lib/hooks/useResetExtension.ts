import { runtime } from 'webextension-polyfill';
import { useNavigate } from 'react-router-dom';
import useOnError from '.';
import { useProfileContext } from '@/lib/context/Profile';
import { revertAll } from '@/lib/store/ui';
import { useAppDispatch } from '@/lib/store';
import { clearLocalStorage } from '@/lib/utils/localStorage';

const useResetExtension = () => {
    const dispatch = useAppDispatch();
    const onError = useOnError();
    const { initProfile } = useProfileContext();

    const navigate = useNavigate();

    const resetUi = () => {
        dispatch(revertAll());
    };

    const clearPersistedData = () => {
        localStorage.removeItem('persist:ui');
    };

    const resetEnvironment = async () => {
        await runtime.sendMessage({ type: 'RESET' });
    };

    const resetExtension = async () => {
        try {
            navigate('/splash-screen');

            resetUi();

            clearPersistedData();

            await Promise.all([resetEnvironment(), clearLocalStorage()]);

            await initProfile();
        } catch (error) {
            onError(error);
        }
    };

    return resetExtension;
};

export default useResetExtension;
