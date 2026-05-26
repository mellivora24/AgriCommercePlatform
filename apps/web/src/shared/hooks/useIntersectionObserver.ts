import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  onIntersect?: () => void;
}

export const useIntersectionObserver = (
  options: UseIntersectionObserverOptions = {},
) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          options.onIntersect?.();
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px',
        root: options.root || null,
      },
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [options]);

  return { elementRef, isVisible };
};
