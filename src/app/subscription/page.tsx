"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Crown, RefreshCw } from "lucide-react";
import { useSubscription, refreshSubscriptionState } from "@/hooks/use-subscription";
import { createPaymentOrder, verifyPayment } from "@/lib/api";
import { createRazorpayCheckout } from "@/lib/razorpay";
import { useAuth } from "@/context/auth-context";

type PaymentStatus = {
  type: "idle" | "processing" | "success" | "error";
  message: string;
};

export default function SubscriptionPage() {
  const { subscription, plans, isLoading, error, refetch } = useSubscription();
  const { user } = useAuth();
  const [pendingPlan, setPendingPlan] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({ type: "idle", message: "" });

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const currentPlanCode = subscription?.currentPlan ?? "FREE";
  const isCurrent = (planCode: string) => planCode === currentPlanCode;

  const handlePlanChange = async (planCode: string, planName: string) => {
    if (isCurrent(planCode) || pendingPlan) {
      return;
    }

    setPendingPlan(planCode);
    setPaymentStatus({ type: "processing", message: `Creating a secure Razorpay checkout for ${planName}...` });

    try {
      const order = await createPaymentOrder(planCode);
      const key = order.keyId ?? order.key_id ?? process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "";
      const amount = Number(order.amount ?? 0);
      const currency = order.currency ?? "INR";
      const orderId = order.orderId ?? order.order_id ?? "";

      const checkout = await createRazorpayCheckout({
        key,
        amount,
        currency,
        name: "DocMorph AI",
        description: `Upgrade to ${planName}`,
        order_id: orderId,
        prefill: {
          name: user?.name ?? "",
          email: user?.email ?? "",
          contact: "",
        },
        theme: { color: "#06b6d4" },
        handler: async (response) => {
          setPaymentStatus({ type: "processing", message: "Payment received. Verifying the transaction securely..." });
          try {
            const verified = await verifyPayment({
              ...response,
              planCode,
            });
            const isVerified = verified.success || verified.verified || verified.status?.toLowerCase() === "verified";

            if (!isVerified) {
              throw new Error(verified.message || "Verification failed. Please contact support.");
            }

            setPaymentStatus({ type: "success", message: "Payment successful. Your subscription has been updated." });
            refreshSubscriptionState();
            await refetch(true);
          } catch (error) {
            setPaymentStatus({
              type: "error",
              message: error instanceof Error ? error.message : "Verification failed. Please contact support.",
            });
          } finally {
            setPendingPlan(null);
          }
        },
        modal: {
          ondismiss: () => {
            setPendingPlan(null);
            setPaymentStatus({ type: "error", message: "Payment was cancelled. No charge was made." });
          },
        },
      });

      checkout.open();
      setPaymentStatus({ type: "processing", message: "Complete the payment in Razorpay to continue." });
    } catch (error) {
      setPendingPlan(null);
      setPaymentStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Unable to start checkout. Please try again.",
      });
    }
  };

  return (
    <div className="px-6 py-20 sm:px-8 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-4xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
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

            {paymentStatus.type !== "idle" ? (
              <div className={`mt-6 rounded-2xl border px-4 py-3 text-sm ${paymentStatus.type === "success" ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200" : paymentStatus.type === "error" ? "border-rose-400/20 bg-rose-400/10 text-rose-200" : "border-cyan-400/20 bg-cyan-400/10 text-cyan-100"}`}>
                {paymentStatus.message}
              </div>
            ) : null}

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              {plans.map((plan) => (
                <div key={plan.code} className="rounded-4xl border border-white/10 bg-slate-950/70 p-6">
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
                    onClick={() => void handlePlanChange(plan.code, plan.name)}
                    disabled={isCurrent(plan.code) || pendingPlan === plan.code || plan.code === "FREE"}
                    className="mt-6 w-full rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {pendingPlan === plan.code ? <span className="inline-flex items-center gap-2"><RefreshCw className="h-4 w-4 animate-spin" />Processing</span> : isCurrent(plan.code) ? "Current plan" : plan.code === "FREE" ? "Current plan" : "Upgrade"}
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
