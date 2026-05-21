import { init } from '@sentry/react';
import { createRoot } from 'react-dom/client';
import App, { MainWrapper } from '@/App';
import '@/main.css';

if (import.meta.env.VITE_SENTRY_DSN) {
    init({
        dsn: import.meta.env.VITE_SENTRY_DSN,
        environment: import.meta.env.VITE_ENVIRONMENT,
    });
}

createRoot(document.getElementById('extension-root')!).render(
    <MainWrapper>
        <App />
    </MainWrapper>,
);
