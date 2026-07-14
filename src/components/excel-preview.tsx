"use client";

import { useMemo, useState } from "react";
import { Download, RotateCcw, Search } from "lucide-react";
import Link from "next/link";
import type { ExtractedRow } from "@/types";
import { motion } from "framer-motion";

type ExcelPreviewProps = {
  data: ExtractedRow[];
  filename: string;
  onDownload: (format: "xlsx" | "csv") => void;
  onReset: () => void;
};

export function ExcelPreview({ data, filename, onDownload, onReset }: ExcelPreviewProps) {
  const [query, setQuery] = useState("");

  const filteredData = useMemo(() => {
    if (!query.trim()) {
      return data;
    }

    const needle = query.toLowerCase();
    return data.filter((row) =>
      Object.values(row).some((value) => String(value ?? "").toLowerCase().includes(needle))
    );
  }, [data, query]);

  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-6 shadow-[0_20px_80px_rgba(6,182,212,0.12)]"
    >
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Preview Table</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">{data.length} records extracted</h2>
          <p className="mt-1 text-sm text-slate-400">{filename}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onDownload("xlsx")}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/20"
          >
            <Download className="h-4 w-4" /> Excel
          </button>
          <button
            onClick={() => onDownload("csv")}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10"
          >
            <Download className="h-4 w-4" /> CSV
          </button>
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10"
          >
            <RotateCcw className="h-4 w-4" /> New
          </button>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="mt-6 rounded-[1.25rem] border border-dashed border-white/10 bg-white/5 p-6 text-sm text-slate-400">
          The backend did not return any rows yet. The extraction can be retried from the upload step.
        </div>
      ) : (
        <>
          <label className="mt-6 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search records"
              className="w-full bg-transparent outline-none"
            />
          </label>

          <div className="mt-6 overflow-hidden rounded-[1.25rem] border border-white/10">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-slate-300">
                <thead className="sticky top-0 z-10 bg-slate-900/90 text-slate-300">
                  <tr>
                    {columns.map((column) => (
                      <th key={column} className="border-b border-white/10 px-4 py-4 font-semibold text-white">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-t border-white/10 bg-slate-950/60 transition hover:bg-white/5">
                      {columns.map((column) => {
                        const value = row[column];
                        const isConfidenceColumn = /confidence/i.test(column);
                        return (
                          <td key={`${rowIndex}-${column}`} className="px-4 py-3">
                            {isConfidenceColumn && value !== null && value !== undefined ? (
                              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-xs font-semibold text-cyan-200">
                                {String(value)}
                              </span>
                            ) : value !== null && value !== undefined ? (
                              String(value)
                            ) : (
                              "-"
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-slate-400">
        <div>
          <p>
            Showing <span className="font-semibold text-white">{filteredData.length}</span> records
          </p>
        </div>
        <Link href="/upload" className="font-semibold text-cyan-300 transition hover:text-cyan-200">
          Extract another PDF →
        </Link>
      </div>
    </motion.div>
  );
}
