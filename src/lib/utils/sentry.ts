import { BrowserOptions, init } from '@sentry/react';

const PII_HEADER_DENYLIST = ['forwarded', '-ip', 'remote-', 'via', '-user'];

// Sentry v11 collects user info, cookies and HTTP bodies when `dataCollection` is unset.
// A wallet must not leak those, so this keeps the restrictive v10 defaults.
const dataCollection: BrowserOptions['dataCollection'] = {
    userInfo: false,
    cookies: false,
    httpHeaders: {
        request: { deny: PII_HEADER_DENYLIST },
        response: { deny: PII_HEADER_DENYLIST },
    },
    httpBodies: [],
    urlQueryParams: { deny: PII_HEADER_DENYLIST },
    genAI: { inputs: false, outputs: false },
    databaseQueryData: false,
    queues: false,
    graphQL: { document: false, variables: false },
};

export const initSentry = (): void => {
    if (!import.meta.env.VITE_SENTRY_DSN) {
        return;
    }

    init({
        dsn: import.meta.env.VITE_SENTRY_DSN,
        environment: import.meta.env.VITE_ENVIRONMENT,
        dataCollection,
    });
};
