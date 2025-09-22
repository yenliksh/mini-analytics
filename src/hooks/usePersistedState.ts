import { useEffect } from "react";
import { useState } from "react";

export function usePersistedState<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initial;
    }
    return initial;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState] as const;
}
