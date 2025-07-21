"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>(endpoint: string, immediate = true) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const execute = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    const response = await api.get<T>(endpoint);

    if (response.error) {
      setState({ data: null, loading: false, error: response.error });
    } else {
      setState({ data: response.data || null, loading: false, error: null });
    }
  };

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [endpoint, immediate]);

  return {
    ...state,
    refetch: execute,
  };
}
