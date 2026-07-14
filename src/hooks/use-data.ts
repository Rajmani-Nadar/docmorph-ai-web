"use client";

import { useCallback, useEffect, useState } from "react";
import type { HistoryEntry, DashboardStats } from "@/types";
import { HistoryService, DashboardService } from "@/services/data-service";

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async (limit: number = 50, offset: number = 0) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await HistoryService.fetchHistory(limit, offset);
      setHistory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch history");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteEntry = useCallback(async (jobId: string) => {
    try {
      const success = await HistoryService.deleteEntry(jobId);
      if (success) {
        setHistory((prev) => prev.filter((entry) => entry.job_id !== jobId));
      }
      return success;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete entry";
      setError(message);
      return false;
    }
  }, []);

  const search = useCallback(async (query: string) => {
    return HistoryService.searchHistory(query, history);
  }, [history]);

  const filterByStatus = useCallback(async (status: "completed" | "running" | "failed") => {
    return HistoryService.filterByStatus(status, history);
  }, [history]);

  return {
    history,
    isLoading,
    error,
    fetchHistory,
    deleteEntry,
    search,
    filterByStatus,
  };
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await DashboardService.fetchStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch stats");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats,
  };
}
