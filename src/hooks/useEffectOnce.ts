import { useEffect, useRef } from "react";

export function useEffectOnce(effect: React.EffectCallback) {
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;
    return effect();
  }, []);
}
