"use client";

import { useEffect } from "react";
import { History as HistoryIcon } from "lucide-react";
import { useHistory } from "@/hooks/use-data";

export default function HistoryPage() {
  const { history, isLoading, error, fetchHistory } = useHistory();

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <div className="px-6 py-20 sm:px-8 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <HistoryIcon className="h-5 w-5 text-cyan-300" />
          <h1 className="text-3xl font-semibold tracking-tight text-white">Processing history</h1>
        </div>

        {isLoading ? (
          <div className="mt-8 rounded-3xl border border-white/10 bg-slate-950/70 p-6 text-sm text-slate-300">
            Loading history from the backend...
          </div>
        ) : error ? (
          <div className="mt-8 rounded-3xl border border-rose-400/20 bg-rose-400/10 p-6 text-sm text-rose-200">
            {error}
          </div>
        ) : history.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-white/10 bg-slate-950/70 p-10 text-center text-slate-400">
            No previous extractions.
          </div>
        ) : (
          <div className="mt-8 overflow-hidden rounded-3xl border border-white/10">
            <table className="min-w-full divide-y divide-white/10 text-left">
              <thead className="bg-slate-900/80 text-sm uppercase tracking-[0.2em] text-slate-400">
                <tr>
                  <th className="px-4 py-4">Document</th>
                  <th className="px-4 py-4">Created</th>
                  <th className="px-4 py-4">Type</th>
                  <th className="px-4 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-slate-950/70 text-sm text-slate-300">
                {history.map((entry) => (
                  <tr key={entry.job_id}>
                    <td className="px-4 py-4">{entry.filename}</td>
                    <td className="px-4 py-4">{entry.uploaded_at}</td>
                    <td className="px-4 py-4">Excel</td>
                    <td className="px-4 py-4">
                      <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-cyan-200">{entry.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
