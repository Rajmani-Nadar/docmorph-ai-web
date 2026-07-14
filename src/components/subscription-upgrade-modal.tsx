"use client";

import { Sparkles } from "lucide-react";

export function SubscriptionUpgradeModal({
  open,
  title,
  message,
  onClose,
}: {
  open: boolean;
  title: string;
  message: string;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[2rem] border border-cyan-400/20 bg-slate-900/95 p-6 shadow-[0_30px_120px_rgba(6,182,212,0.24)]">
        <div className="flex items-center gap-3 text-cyan-300">
          <Sparkles className="h-5 w-5" />
          <p className="text-sm font-semibold uppercase tracking-[0.3em]">Upgrade Needed</p>
        </div>
        <h3 className="mt-4 text-2xl font-semibold text-white">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-slate-400">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
          >
            Close
          </button>
          <a
            href="/pricing"
            className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            View plans
          </a>
        </div>
      </div>
    </div>
  );
}
