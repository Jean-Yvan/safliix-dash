import { useEffect, useState,useCallback } from "react";

export type SuggestionOption = { label: string; value: string };




export function useMetaOptions<T>(loader: () => Promise<T>) {
  const [options, setOptions] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (isMounted: { current: boolean }) => {
    setLoading(true);
    setError(null); // Reset l'erreur au début d'une nouvelle tentative
    try {
      const data = await loader();
      if (isMounted.current) {
        setOptions(data);
      }
    } catch (e) {
      if (isMounted.current) {
        console.dir(e, {depth:2});
        const msg = e instanceof Error ? e.message : "Erreur de chargement";
        setError(msg);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [loader]);

  useEffect(() => {
    const isMounted = { current: true };
    load(isMounted);
    
    return () => {
      isMounted.current = false;
    };
  }, [load]);

  return { options, loading, error, refresh: () => load({ current: true }) };
}