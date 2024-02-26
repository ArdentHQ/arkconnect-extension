import * as Sentry from '@sentry/react';

const useSentryException = (error: Error | unknown): void => {
  Sentry.captureException(error);
};

export default useSentryException;
