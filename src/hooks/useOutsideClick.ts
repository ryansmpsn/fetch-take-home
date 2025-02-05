import type { RefObject } from 'react';
import { useEffect } from 'react';

function useOutsideClick<T extends HTMLElement | null>(
  ref: RefObject<T>,
  callback: () => void
) {
  const handleClick = (e: Event) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  });
}

export default useOutsideClick;
