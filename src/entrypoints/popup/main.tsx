import { createRoot } from 'react-dom/client';
import { windows } from 'webextension-polyfill';
import App, { MainWrapper } from '@/App';
import { getLocalValues } from '@/lib/utils/localStorage';
import { openSidepanel } from '@/lib/background/sidepanel';
import { initSentry } from '@/lib/utils/sentry';
import '@/main.css';

initSentry();

// When sidepanel mode is enabled and the popup is opened directly (e.g. from a
// dapp button that links straight to popup.html), redirect to the sidepanel
// instead. Extension popup pages retain user gesture context across awaits so
// openSidepanel() works here even after the storage read.
void (async () => {
    const { openInSidepanel } = await getLocalValues();
    if (openInSidepanel) {
        const win = await windows.getCurrent();
        if (win.id !== undefined) {
            await openSidepanel(win.id);
        }
        window.close();
        return;
    }

    createRoot(document.getElementById('extension-root')!).render(
        <MainWrapper>
            <App />
        </MainWrapper>,
    );
})();
