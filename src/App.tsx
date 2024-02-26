import routes from '@/routing';
import * as UIStore from '@/lib/store/ui';
import { theme as baseTheme } from '@/shared/theme';
import { useAppSelector } from '@/lib/store';
import { themeModes } from '@/shared/theme/categories/color';
import ToastContainer from './components/toast/ToastContainer';
import { Routes, Route } from 'react-router-dom';
import { Container } from '@/shared/components';
import LoadingModal from './shared/components/loader/LoadingModal';
import { useEnvironmentContext } from './lib/context/Environment';
import { useLayoutEffect } from 'react';
import { ProfileProvider } from './lib/context/Profile';
import { useErrorHandlerContext } from './lib/context/ErrorHandler';
import useBackgroundEventHandler from './lib/hooks/useBackgroundEventHandler';
import AutoUnlockWrapper from './components/AutoUnlockWrapper';
import { LedgerProvider } from './lib/Ledger';
import { ThemeProvider, StyleSheetManager } from 'styled-components';
import { theme } from '@/shared/theme';
import store, { persistor } from '@/lib/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import { MemoryRouter } from 'react-router-dom';
import shouldForwardProp from '@styled-system/should-forward-prop';
import { EnvironmentProvider } from './lib/context/Environment';
import { ErrorHandlerProvider } from './lib/context/ErrorHandler';
import { initializeEnvironment } from './lib/utils/env';

const env = initializeEnvironment();

export const MainWrapper = ({ children }: { children?: React.ReactNode }) => {
  return (
    <EnvironmentProvider env={env}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <StyleSheetManager shouldForwardProp={shouldForwardProp}>
            <ThemeProvider theme={theme}>
              <MemoryRouter initialEntries={['/']}>
                <ErrorHandlerProvider>
                  {children}
                </ErrorHandlerProvider>
              </MemoryRouter>
            </ThemeProvider>
          </StyleSheetManager>
        </PersistGate>
      </Provider>
    </EnvironmentProvider>
  );
};

// Exported so can be reused in tests
export const AppWrapper = ({
  children,
  theme = { ...baseTheme, colors: themeModes[UIStore.ThemeMode.LIGHT] },
}: {
  children?: React.ReactNode;
  theme?: React.ComponentProps<typeof ThemeProvider>['theme'];
}) => {
  return (
    <ProfileProvider>
      <AutoUnlockWrapper>
        <LedgerProvider>
          <ThemeProvider theme={theme}>
            <Container
              id={!window.location.href.includes('ledger') ? 'scrollable-container' : ''}
              className='custom-scroll'
              backgroundColor='primaryBackground'
            >
              <Container minHeight='100%' position='relative'>
                {children}

                <ToastContainer />
                <LoadingModal />
              </Container>
            </Container>
          </ThemeProvider>
        </LedgerProvider>
      </AutoUnlockWrapper>
    </ProfileProvider>
  );
};

const App = () => {
  const { onError } = useErrorHandlerContext();
  const { env, isEnvironmentBooted, setIsEnvironmentBooted } = useEnvironmentContext();
  const themeMode = useAppSelector(UIStore.selectThemeMode);

  const theme = { ...baseTheme, colors: themeModes[themeMode] };

  useBackgroundEventHandler();

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

    boot();
  }, [env]);

  if (!isEnvironmentBooted) return null;

  return (
    <AppWrapper theme={theme}>
      <Routes>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={<route.Component />} />
        ))}
      </Routes>
    </AppWrapper>
  );
};

export default App;
