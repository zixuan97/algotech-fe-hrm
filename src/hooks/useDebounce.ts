import React from 'react';

/**
 * A hook used to debounce a value. The debounced value will only reflect the latest value when the hook has not been called for a specified time period.
 * @param value the value to debounce
 * @param delay the delay in ms before the debounce value is reflected
 * @returns the debounced value
 */
const useDebounce = <T>(value: T, delay: number = 500) => {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

/**
 * A hook used to debounce a function. The function will only be fired after it hasn't been called for the specified time period
 * @param func the function to debounce
 * @param delay the delay in ms before the deboounced function is actually called
 * @returns the debounced function
 */
export const useDebounceCallback = (
  func: (...args: any) => void,
  delay: number = 500
) => {
  // Use a ref to store the timeout between renders
  // and prevent changes to it from causing re-renders
  const timeout = React.useRef<NodeJS.Timeout>();

  return React.useCallback(
    (...args: any) => {
      const later = () => {
        clearTimeout(timeout.current);
        func(...args);
      };

      clearTimeout(timeout.current);
      timeout.current = setTimeout(later, delay);
    },
    [func, delay]
  );
};

export default useDebounce;
