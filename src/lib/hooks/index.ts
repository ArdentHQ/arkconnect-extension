import useSentryException from './useSentryException';

type ErrorCallback = (error: Error | unknown) => void;

const useOnError = (): ErrorCallback => {
  const onError = (error: Error | unknown) => {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error(error);
    }

    useSentryException(error);
  };

  return onError;
};

export default useOnError;
