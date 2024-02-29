import browser from 'webextension-polyfill';
import { useProfileContext } from '../context/Profile';
import useOnError from '.';
import { revertAll } from '@/lib/store/ui';
import { useAppDispatch } from '@/lib/store';
import { clearLocalStorage } from '@/lib/utils/localStorage';

const useResetExtension = () => {
    const dispatch = useAppDispatch();
    const onError = useOnError();
    const { initProfile } = useProfileContext();

    const resetUi = () => {
        dispatch(revertAll());
    };

    const clearPersistedData = () => {
        localStorage.removeItem('persist:ui');

        localStorage.removeItem('persist:form');
    };

    const resetEnvironment = async () => {
        await browser.runtime.sendMessage({ type: 'RESET' });
    };

    const resetExtension = async () => {
        try {
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
