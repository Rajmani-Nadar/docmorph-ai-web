"use client";

import { useEffect } from "react";
import { CreditCard, ReceiptText, RefreshCw } from "lucide-react";
import { useBilling } from "@/hooks/use-subscription";

export default function BillingPage() {
  const { billing, isLoading, error, refetch } = useBilling();

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return (
    <div className="px-6 py-20 sm:px-8 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Billing</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">Billing history</h1>
          </div>
          <button onClick={() => void refetch(true)} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200">Refresh</button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
            <div className="flex items-center gap-3 text-cyan-300"><ReceiptText className="h-5 w-5" /><h2 className="text-xl font-semibold text-white">Billing history</h2></div>
            {isLoading ? (
              <div className="mt-6 text-sm text-slate-400">Loading billing events...</div>
            ) : error ? (
              <div className="mt-6 text-sm text-rose-200">{error}</div>
            ) : billing.length === 0 ? (
              <div className="mt-6 text-sm text-slate-400">No billing history yet.</div>
            ) : (
              <div className="mt-6 space-y-3">
                {billing.map((event) => (
                  <div key={event.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-white">{event.eventType}</p>
                      <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-cyan-200">{event.status}</span>
                    </div>
                    <p className="mt-2 text-slate-400">{event.occurredAt ? new Date(event.occurredAt).toLocaleDateString() : "Pending"}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
              <div className="flex items-center gap-3 text-cyan-300"><CreditCard className="h-5 w-5" /><h2 className="text-xl font-semibold text-white">Invoices</h2></div>
              <p className="mt-4 text-sm text-slate-400">Invoice generation will appear here once payment integration is enabled.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
              <div className="flex items-center gap-3 text-cyan-300"><RefreshCw className="h-5 w-5" /><h2 className="text-xl font-semibold text-white">Upcoming renewal</h2></div>
              <p className="mt-4 text-sm text-slate-400">Renewal details will be shown here once billing is finalized.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
              <div className="flex items-center gap-3 text-cyan-300"><CreditCard className="h-5 w-5" /><h2 className="text-xl font-semibold text-white">Payment method</h2></div>
              <p className="mt-4 text-sm text-slate-400">No payment gateway is active yet.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
