import { useEffect, useRef } from 'react';

export const useNotifyOnUnload = (reject: () => void) => {
  const isSubmitted = useRef(false);

  const unloadListener = () => {
    if (isSubmitted.current) {
      return;
    }

    reject();
  };

  useEffect(() => {
    window.addEventListener('beforeunload', unloadListener);

    return () => {
      window.removeEventListener('beforeunload', unloadListener);
    };
  }, []);

  return () => (isSubmitted.current = true);
};
