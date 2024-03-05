import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useLayoutEffect } from 'react';
import { StyleSheetManager, ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import shouldForwardProp from '@styled-system/should-forward-prop';
import { LedgerProvider } from './lib/Ledger';
import AutoUnlockWrapper from './components/AutoUnlockWrapper';
import useBackgroundEventHandler from './lib/hooks/useBackgroundEventHandler';
import { ErrorHandlerProvider, useErrorHandlerContext } from './lib/context/ErrorHandler';
import { ProfileProvider } from './lib/context/Profile';
import { EnvironmentProvider, useEnvironmentContext } from './lib/context/Environment';
import LoadingModal from './shared/components/loader/LoadingModal';
import ToastContainer from './components/toast/ToastContainer';
import { initializeEnvironment } from './lib/utils/env';
import { LoadingFullScreen } from './shared/components/handleStates/LoadingFullScreen';
import { getLocalValues } from './lib/utils/localStorage';
import store, { persistor, useAppDispatch, useAppSelector } from '@/lib/store';
import { theme as baseTheme, theme } from '@/shared/theme';
import { Container } from '@/shared/components';
import { themeModes } from '@/shared/theme/categories/color';
import { hasOnboardedChanged, selectThemeMode, ThemeMode } from '@/lib/store/ui';
import routes from '@/routing';

const env = initializeEnvironment();

export const MainWrapper = ({ children }: { children?: React.ReactNode }) => {
    return (
        <EnvironmentProvider env={env}>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <StyleSheetManager shouldForwardProp={shouldForwardProp}>
                        <ThemeProvider theme={theme}>
                            <MemoryRouter initialEntries={['/']}>
                                <ErrorHandlerProvider>{children}</ErrorHandlerProvider>
                            </MemoryRouter>
                        </ThemeProvider>
                    </StyleSheetManager>
                </PersistGate>
            </Provider>
        </EnvironmentProvider>
    );
};

const AppWrapper = ({
    children,
    runEventHandlers,
    theme = { ...baseTheme, colors: themeModes[ThemeMode.LIGHT] },
}: {
    children?: React.ReactNode;
    runEventHandlers: () => void;
    theme?: React.ComponentProps<typeof ThemeProvider>['theme'];
}) => {
    return (
        <ThemeProvider theme={theme}>
            <ProfileProvider>
                <AutoUnlockWrapper runEventHandlers={runEventHandlers}>
                    <LedgerProvider>
                        <Container
                            id={
                                !window.location.href.includes('ledger')
                                    ? 'scrollable-container'
                                    : ''
                            }
                            className='custom-scroll'
                            backgroundColor='primaryBackground'
                        >
                            <Container minHeight='100%' position='relative'>
                                {children}

                                <ToastContainer />
                                <LoadingModal />
                            </Container>
                        </Container>
                    </LedgerProvider>
                </AutoUnlockWrapper>
            </ProfileProvider>
        </ThemeProvider>
    );
};

const App = () => {
    const { onError } = useErrorHandlerContext();
    const { env, isEnvironmentBooted, setIsEnvironmentBooted } = useEnvironmentContext();
    const themeMode = useAppSelector(selectThemeMode);
    const dispatch = useAppDispatch();
    const theme = { ...baseTheme, colors: themeModes[themeMode] };

    const runEventHandlers = useBackgroundEventHandler();

    useLayoutEffect(() => {
        const boot = async () => {
            try {
                await env.verify();
                await env.boot();
                const { hasOnboarded } = await getLocalValues();
                dispatch(hasOnboardedChanged(hasOnboarded));

                setIsEnvironmentBooted(true);
            } catch (error) {
                onError(error);
            }
        };

        void boot();
    }, [env]);

    if (!isEnvironmentBooted) return <LoadingFullScreen />;

    return (
        <AppWrapper theme={theme} runEventHandlers={runEventHandlers}>
            <Routes>
                {routes.map((route) => (
                    <Route key={route.path} path={route.path} element={<route.Component />} />
                ))}
            </Routes>
        </AppWrapper>
    );
};

export default App;
