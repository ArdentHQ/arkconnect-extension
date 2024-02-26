import useSentryException from './useSentryException';

type ErrorCallback = (error: Error | unknown) => void;

const useOnError = (): ErrorCallback => {
  const onError = (error: Error | unknown) => {
    if (import.meta.env.DEV) {
      console.error(error);
    }

    useSentryException(error);
  };

  return onError;
};

export default useOnError;
