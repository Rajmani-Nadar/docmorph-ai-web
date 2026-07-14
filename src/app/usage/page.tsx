"use client";

import { useEffect } from "react";
import { BarChart3, HardDrive, History, Layers3, Sparkles, UploadCloud } from "lucide-react";
import { useUsage } from "@/hooks/use-subscription";

export default function UsagePage() {
  const { usage, isLoading, error, refetch } = useUsage();

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return (
    <div className="px-6 py-20 sm:px-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Usage</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">Usage overview</h1>
            </div>
            <button onClick={() => void refetch(true)} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200">Refresh</button>
          </div>

          {isLoading ? (
            <div className="mt-8 rounded-3xl border border-white/10 bg-slate-950/70 p-8 text-sm text-slate-400">Loading subscription usage...</div>
          ) : error ? (
            <div className="mt-8 rounded-3xl border border-rose-400/20 bg-rose-400/10 p-8 text-sm text-rose-200">{error}</div>
          ) : usage ? (
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
                <div className="flex items-center gap-3 text-cyan-300"><BarChart3 className="h-5 w-5" /><h2 className="text-xl font-semibold text-white">Monthly usage</h2></div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {[
                    { label: "Uploads", value: usage.monthlyUsage.uploads, icon: UploadCloud },
                    { label: "Pages", value: usage.monthlyUsage.pages, icon: Layers3 },
                    { label: "Downloads", value: usage.downloads, icon: History },
                    { label: "Storage", value: `${usage.storageUsedMb.toFixed(1)} MB`, icon: HardDrive },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <div className="flex items-center gap-2 text-sm text-slate-400"><Icon className="h-4 w-4 text-cyan-300" />{item.label}</div>
                        <p className="mt-3 text-2xl font-semibold text-white">{item.value}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
                <div className="flex items-center gap-3 text-cyan-300"><Sparkles className="h-5 w-5" /><h2 className="text-xl font-semibold text-white">Processing statistics</h2></div>
                <div className="mt-6 space-y-4">
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm text-slate-400"><span>Processing time</span><span>{usage.monthlyUsage.processingTimeSeconds}s</span></div>
                    <div className="h-2 rounded-full bg-slate-800"><div className="h-2 rounded-full bg-cyan-400" style={{ width: "70%" }} /></div>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm text-slate-400"><span>Remaining uploads</span><span>{usage.remainingUploads ?? "∞"}</span></div>
                    <div className="h-2 rounded-full bg-slate-800"><div className="h-2 rounded-full bg-emerald-400" style={{ width: "55%" }} /></div>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm text-slate-400"><span>Remaining pages</span><span>{usage.remainingPages ?? "∞"}</span></div>
                    <div className="h-2 rounded-full bg-slate-800"><div className="h-2 rounded-full bg-violet-400" style={{ width: "60%" }} /></div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
