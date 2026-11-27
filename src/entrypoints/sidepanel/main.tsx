import { createRoot } from 'react-dom/client';
import App, { MainWrapper } from '@/App';
import { initSentry } from '@/lib/utils/sentry';
import '@/main.css';

initSentry();

createRoot(document.getElementById('extension-root')!).render(
    <MainWrapper>
        <App />
    </MainWrapper>,
);
