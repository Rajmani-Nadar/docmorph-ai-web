"use client";

import { useCallback, useEffect, useState } from "react";
import { healthCheck } from "@/lib/api";

export function useHealthCheck() {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const online = await healthCheck();
      setIsOnline(online);
      if (!online) {
        setError("Backend is currently offline. Reconnect and try again.");
      }
    } catch (err) {
      setIsOnline(false);
      setError(err instanceof Error ? err.message : "Unable to reach the backend.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();

    const interval = window.setInterval(checkHealth, 15000);
    return () => window.clearInterval(interval);
  }, [checkHealth]);

  return {
    isOnline,
    isLoading,
    error,
    checkHealth,
  };
}
