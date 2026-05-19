import { initializeInPageHandler } from '@/ArkConnectInPageProvider';

// Called from the wxt inpage entrypoint. Attaches the ArkConnect provider to
// the page's window so dApps can detect it.
export function startInpage() {
    initializeInPageHandler();
}
