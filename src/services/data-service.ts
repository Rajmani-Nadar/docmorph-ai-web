import type { HistoryEntry, DashboardStats } from "@/types";
import { getHistory, getDashboardStats, deleteJob } from "@/lib/api";

export class HistoryService {
  static async fetchHistory(limit: number = 50, offset: number = 0): Promise<HistoryEntry[]> {
    return getHistory(limit, offset);
  }

  static async deleteEntry(jobId: string): Promise<boolean> {
    try {
      const response = await deleteJob(jobId);
      return response.success;
    } catch {
      return false;
    }
  }

  static async searchHistory(query: string, entries: HistoryEntry[]): Promise<HistoryEntry[]> {
    return entries.filter((entry) =>
      entry.filename.toLowerCase().includes(query.toLowerCase()) ||
      entry.job_id.toLowerCase().includes(query.toLowerCase())
    );
  }

  static async filterByStatus(
    status: "completed" | "running" | "failed",
    entries: HistoryEntry[]
  ): Promise<HistoryEntry[]> {
    return entries.filter((entry) => {
      if (status === "running") return entry.status === "processing" || entry.status === "pending";
      return entry.status === status;
    });
  }
}

export class DashboardService {
  static async fetchStats(): Promise<DashboardStats | null> {
    try {
      return await getDashboardStats();
    } catch {
      return null;
    }
  }

  static formatTime(seconds: number): string {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
    return `${Math.round(seconds / 3600)}h`;
  }

  static formatNumber(num: number): string {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  }
}
