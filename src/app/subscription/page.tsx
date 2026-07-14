"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Crown, RefreshCw } from "lucide-react";
import { useSubscription } from "@/hooks/use-subscription";

export default function SubscriptionPage() {
  const { subscription, plans, isLoading, error, refetch, changePlan } = useSubscription();
  const [pendingPlan, setPendingPlan] = useState<string | null>(null);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const currentPlanCode = subscription?.currentPlan ?? "FREE";
  const isCurrent = (planCode: string) => planCode === currentPlanCode;

  const handlePlanChange = async (planCode: string) => {
    setPendingPlan(planCode);
    await changePlan(planCode);
    setPendingPlan(null);
  };

  return (
    <div className="px-6 py-20 sm:px-8 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Subscription</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">Plan overview</h1>
          </div>
          <button onClick={() => void refetch(true)} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200">Refresh</button>
        </div>

        {isLoading ? (
          <div className="mt-8 rounded-3xl border border-white/10 bg-slate-950/70 p-8 text-sm text-slate-400">Loading plans and subscription state...</div>
        ) : error ? (
          <div className="mt-8 rounded-3xl border border-rose-400/20 bg-rose-400/10 p-8 text-sm text-rose-200">{error}</div>
        ) : (
          <>
            <div className="mt-8 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6">
              <div className="flex items-center gap-3 text-cyan-200"><Crown className="h-5 w-5" /><h2 className="text-xl font-semibold text-white">Current plan</h2></div>
              <p className="mt-3 text-3xl font-semibold text-white">{subscription?.planName ?? "Free"}</p>
              <p className="mt-2 text-sm text-slate-200">Status: {subscription?.subscriptionStatus ?? "active"}</p>
              <p className="mt-1 text-sm text-slate-200">Renewal: {subscription?.renewalDate ? new Date(subscription.renewalDate).toLocaleDateString() : "TBD"}</p>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              {plans.map((plan) => (
                <div key={plan.code} className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">{plan.code}</p>
                    {isCurrent(plan.code) ? <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200">Current</span> : null}
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold text-white">{plan.name}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-400">{plan.description}</p>
                  <ul className="mt-6 space-y-3 text-sm text-slate-300">
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-cyan-300" />{plan.maxUploadsPerMonth === null ? "Unlimited uploads" : `${plan.maxUploadsPerMonth} uploads/month`}</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-cyan-300" />{plan.maxPagesPerMonth === null ? "Unlimited pages" : `${plan.maxPagesPerMonth} pages/month`}</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-cyan-300" />{plan.maxUploadSizeMb === null ? "Unlimited upload size" : `${plan.maxUploadSizeMb} MB uploads`}</li>
                    {plan.features.priorityProcessing ? <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-cyan-300" />Priority processing</li> : null}
                    {plan.features.csvExport ? <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-cyan-300" />CSV export</li> : null}
                  </ul>
                  <button
                    onClick={() => void handlePlanChange(plan.code)}
                    disabled={isCurrent(plan.code) || pendingPlan === plan.code}
                    className="mt-6 w-full rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {pendingPlan === plan.code ? <span className="inline-flex items-center gap-2"><RefreshCw className="h-4 w-4 animate-spin" />Updating</span> : isCurrent(plan.code) ? "Current plan" : plan.code === "FREE" ? "Downgrade" : "Upgrade"}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
