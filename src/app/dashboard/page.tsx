"use client";

import { FileSpreadsheet, History, Sparkles, TrendingUp, HardDrive } from "lucide-react";
import { useSubscription, useUsage, useBilling } from "@/hooks/use-subscription";

export default function DashboardPage() {
  const { subscription } = useSubscription();
  const { usage } = useUsage();

  const { billing, isLoading: billingLoading } = useBilling();

  const eventTitles: Record<string, string> = {
    payment_captured: "💳 Payment Captured",
    subscription_activated: "⭐ Subscription Activated",
  };

  const statusStyles: Record<
    string,
    { label: string; className: string }
  > = {
    completed: {
      label: "Completed",
      className:
        "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
    },
    pending: {
      label: "Pending",
      className:
        "border-amber-400/20 bg-amber-400/10 text-amber-200",
    },
    failed: {
      label: "Failed",
      className:
        "border-rose-400/20 bg-rose-400/10 text-rose-200",
    },
  };

  const cards = [
    {
      label: "Current Plan",
      value: subscription?.currentPlan ?? "FREE",
      icon: Sparkles,
    },
    {
      label: "Uploads Used",
      value: usage?.uploadsUsed ?? 0,
      icon: FileSpreadsheet,
    },
    {
      label: "Pages Used",
      value: usage?.pagesUsed ?? 0,
      icon: TrendingUp,
    },
    {
      label: "Downloads",
      value: usage?.downloads ?? 0,
      icon: History,
    },
    {
      label: "Storage Used",
      value: usage ? `${usage.storageUsedMb.toFixed(1)} MB` : "0 MB",
      icon: HardDrive,
    },
    {
      label: "Remaining Uploads",
      value: usage?.remainingUploads ?? "∞",
      icon: FileSpreadsheet,
    },
  ];

  return (
    <div className="px-6 py-20 sm:px-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Dashboard</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">Operational overview</h1>
          </div>
          <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">Live workspace</div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="rounded-4xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-400">{card.label}</p>
                  <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-2 text-cyan-300"><Icon className="h-6 w-6" /></div>
                </div>
                <p className="mt-6 text-3xl font-semibold text-white">{card.value}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-4xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Recent Billing Activity</h2>
              <span className="text-sm text-slate-400">{billingLoading ? "Loading..." : `${billing.length} events`}</span>
            </div>
            <div className="mt-6 space-y-3">
              {
                billing.length === 0 ? (
                  <p className="text-sm text-slate-400">
                    No billing activity yet.
                  </p>
                ) : (
                  billing.slice(0, 5).map((event) => {
                    const status =
                      statusStyles[event.status] ?? {
                        label: event.status,
                        className:
                          "border-cyan-400/20 bg-cyan-400/10 text-cyan-200",
                      };

                    return (
                      <div
                        key={event.id}
                        className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3"
                      >
                        <div>
                          <p className="font-medium text-white">
                            {eventTitles[event.eventType] ?? event.eventType}
                          </p>

                          <p className="text-sm text-slate-400">
                            {event.occurredAt
                              ? new Date(event.occurredAt).toLocaleString()
                              : "-"}
                          </p>
                        </div>

                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-medium ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </div>
                    );
                  })
                )
              }
            </div>
          </div>

          <div className="rounded-4xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h2 className="text-xl font-semibold text-white">Monthly Usage</h2>
            <div className="mt-6 space-y-4">
              {usage ? (
                <>
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm text-slate-400"><span>Uploads</span><span>{usage.monthlyUsage.uploads}</span></div>
                    <div className="h-2 rounded-full bg-slate-800"><div className="h-2 rounded-full bg-cyan-400" style={{ width: `${Math.min(100, (usage.monthlyUsage.uploads / Math.max(usage.planLimit.maxUploadsPerMonth ?? 1, 1)) * 100)}%` }} /></div>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm text-slate-400"><span>Pages</span><span>{usage.monthlyUsage.pages}</span></div>
                    <div className="h-2 rounded-full bg-slate-800"><div className="h-2 rounded-full bg-emerald-400" style={{ width: `${Math.min(100, (usage.monthlyUsage.pages / Math.max(usage.planLimit.maxPagesPerMonth ?? 1, 1)) * 100)}%` }} /></div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-slate-400">Usage metrics will appear here once the backend is queried.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
