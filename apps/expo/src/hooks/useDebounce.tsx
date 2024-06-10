import { useEffect, useRef, useState } from "react";

export default function useDebounce(value: string, delay = 500): string {
  const [debouncedValue, setDebouncedValue] = useState<string>("");
  const timerRef = useRef();

  useEffect(() => {
    //@ts-expect-error timerRef.current is a number
    timerRef.current = setTimeout(() => setDebouncedValue(value), delay);

    return () => {
      clearTimeout(timerRef.current);
    };
  }, [value, delay]);

  return debouncedValue;
}
