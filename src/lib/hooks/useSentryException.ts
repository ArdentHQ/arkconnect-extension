import { captureException } from '@sentry/react';

const useSentryException = (error: Error | unknown): void => {
  captureException(error);
};

export default useSentryException;
