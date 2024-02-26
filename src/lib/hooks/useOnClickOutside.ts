import { useEffect } from 'react';

const useOnClickOutside = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref: React.MutableRefObject<any>,
  handler: (event: MouseEvent | TouchEvent) => void,
  currentRef?: React.RefObject<HTMLElement>,
) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (
        !ref.current ||
        ref.current.contains(target) ||
        (currentRef?.current && currentRef.current.contains(target))
      ) {
        return;
      }
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, currentRef]);
};

export default useOnClickOutside;
