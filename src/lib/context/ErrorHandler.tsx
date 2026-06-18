import { createContext, ReactNode, useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { runtime, windows } from 'webextension-polyfill';
import useOnError from '@/lib/hooks';
import removeWindowInstance from '@/lib/utils/removeWindowInstance';
import ErrorModal from '@/components/connect/ErrorModal';

interface Context {
    onError: (error: Error | unknown, showErrorModal?: boolean) => void;
}

interface Properties {
    children: ReactNode;
}

const ErrorHandlerContext = createContext<Context | undefined>(undefined);

export const ErrorHandlerProvider = ({ children }: Properties) => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const onError = useOnError();

    const handleOnError = (error: Error | unknown, showErrorModal: boolean = true) => {
        onError(error);
        if (showErrorModal) {
            setError((error as Error)?.message);
            setShowErrorModal(showErrorModal);
        }
    };

    const closeSidepanel = async () => {
        const win = await windows.getCurrent();
        if (win.id !== undefined) {
            await runtime.sendMessage({ type: 'CLOSE_SIDEPANEL', data: { windowId: win.id } });
        }
    };

    const handleClose = async () => {
        setShowErrorModal(false);
        if (state?.sidepanelWasOpen) {
            navigate('/');
        } else if (state?.windowId) {
            await removeWindowInstance(state?.windowId);
        } else if (state?.sidepanelWasOpen === false) {
            await closeSidepanel();
        } else {
            navigate('/');
        }
    };

    const handleBack = () => {
        setShowErrorModal(false);
        navigate(-1);
    };

    return (
        <ErrorHandlerContext.Provider
            value={{
                onError: handleOnError,
            }}
        >
            {showErrorModal && (
                <ErrorModal error={error} onClose={handleClose} onBack={handleBack} />
            )}
            {children}
        </ErrorHandlerContext.Provider>
    );
};

/**
 * If you needs to react to changes in the environment state
 * use the `state` field that will be updated whenever env.persist() is called:
 *
 * const context = useErrorHandlerContext();
 */

export const useErrorHandlerContext = (): Context => {
    const value = useContext(ErrorHandlerContext);
    if (value === undefined) {
        throw new Error('[useErrorHandler] Component not wrapped within a Provider');
    }
    return value;
};
