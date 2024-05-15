import { createTestAddressBook, isDev } from './dev/utils/dev';
import { EnvironmentProvider, useEnvironmentContext } from './lib/context/Environment';
import { ErrorHandlerProvider, useErrorHandlerContext } from './lib/context/ErrorHandler';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import store, { persistor } from '@/lib/store';

import { BackgroundEvents } from '@/lib/context/BackgroundEventHandler';
import { I18nextProvider } from 'react-i18next';
import { i18n as index18n } from './i18n';
import { initializeEnvironment } from './lib/utils/env';
import { LedgerProvider } from './lib/Ledger';
import { LoadingFullScreen } from './shared/components/handleStates/LoadingFullScreen';
import LoadingModal from './shared/components/loader/LoadingModal';
import NextPageMiddleware from './components/NextPageMiddleware';
import { PersistGate } from 'redux-persist/es/integration/react';
import { ProfileProvider } from './lib/context/Profile';
import { Provider } from 'react-redux';
import routes from '@/routing';
import ToastContainer from '@/components/toast/ToastContainer';
import useBackgroundEventHandler from '@/lib/hooks/useBackgroundEventHandler';
import { useLayoutEffect } from 'react';

const env = initializeEnvironment();

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,
            retry: 1,
            retryDelay: 1000,
        },
    },
});

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
                        <QueryClientProvider client={queryClient}>
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
                        </QueryClientProvider>
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

                if (isDev()) {
                    createTestAddressBook();
                }

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
