import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useLayoutEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import { I18nextProvider } from 'react-i18next';
import { LedgerProvider } from './lib/Ledger';
import NextPageMiddleware from './components/NextPageMiddleware';
import { ErrorHandlerProvider, useErrorHandlerContext } from './lib/context/ErrorHandler';
import { ProfileProvider } from './lib/context/Profile';
import { EnvironmentProvider, useEnvironmentContext } from './lib/context/Environment';
import LoadingModal from './shared/components/loader/LoadingModal';
import { initializeEnvironment } from './lib/utils/env';
import { LoadingFullScreen } from './shared/components/handleStates/LoadingFullScreen';
import { i18n as index18n } from './i18n';
import ToastContainer from '@/components/toast/ToastContainer';
import store, { persistor } from '@/lib/store';
import routes from '@/routing';
import { BackgroundEvents } from '@/lib/context/BackgroundEventHandler';
import useBackgroundEventHandler from '@/lib/hooks/useBackgroundEventHandler';

const env = initializeEnvironment();

export const MainWrapper = ({ children }: { children?: React.ReactNode }) => {
    return (
        <EnvironmentProvider env={env}>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <MemoryRouter initialEntries={['/']}>
                        <ErrorHandlerProvider>{children}</ErrorHandlerProvider>
                    </MemoryRouter>
                </PersistGate>
            </Provider>
        </EnvironmentProvider>
    );
};

const AppWrapper = ({ children }: { children?: React.ReactNode }) => {
    return (
        <ProfileProvider>
            <NextPageMiddleware>
                <LedgerProvider>
                    <I18nextProvider i18n={index18n}>
                        <div
                            id={
                                !window.location.href.includes('ledger')
                                    ? 'scrollable-container'
                                    : ''
                            }
                            className='custom-scroll bg-subtle-white dark:bg-light-black'
                        >
                            <div className='relative min-h-full'>
                                {children}

                                <ToastContainer />
                                <LoadingModal />
                            </div>
                        </div>
                    </I18nextProvider>
                </LedgerProvider>
            </NextPageMiddleware>
        </ProfileProvider>
    );
};

const App = () => {
    const { onError } = useErrorHandlerContext();
    const { env, isEnvironmentBooted, setIsEnvironmentBooted } = useEnvironmentContext();
    const { runEventHandlers, events } = useBackgroundEventHandler();

    useLayoutEffect(() => {
        const boot = async () => {
            try {
                await env.verify();
                await env.boot();

                setIsEnvironmentBooted(true);
            } catch (error) {
                onError(error);
            }
        };

        void boot();
    }, [env]);

    if (!isEnvironmentBooted) return <LoadingFullScreen />;

    return (
        <BackgroundEvents events={events} runEventHandlers={runEventHandlers}>
            <AppWrapper>
                <Routes>
                    {routes.map((route) => (
                        <Route key={route.path} path={route.path} element={<route.Component />} />
                    ))}
                </Routes>
            </AppWrapper>
        </BackgroundEvents>
    );
};

export default App;
