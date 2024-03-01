import { createContext, ReactNode, useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import useOnError from '../hooks';
import removeWindowInstance from '../utils/removeWindowInstance';
import ErrorModal from '@/components/connect/ErrorModal';

interface Context {
    onError: (error: Error | unknown, showErrorModal?: boolean) => void;
}

interface Properties {
    children: ReactNode;
}

const ErrorHandlerContext = createContext<Context | undefined>(undefined);

export const ErrorHandlerProvider = ({ children }: Properties) => {
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

    const handleClose = async () => {
        setShowErrorModal(false);
        await removeWindowInstance(state?.windowId);
    };

    return (
        <ErrorHandlerContext.Provider
            value={{
                onError: handleOnError,
            }}
        >
            {showErrorModal && <ErrorModal error={error} onClose={handleClose} />}
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
