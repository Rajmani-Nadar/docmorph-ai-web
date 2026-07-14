"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/context/auth-context";
import { useSubscription, useUsage } from "@/hooks/use-subscription";

export default function ProfilePage() {
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const { usage } = useUsage();
  const [name, setName] = useState(user?.name || "");
  const [password, setPassword] = useState("");

  useEffect(() => {
    setName(user?.name || "");
  }, [user]);

  return (
    <ProtectedRoute>
      <div className="px-6 py-20 sm:px-8 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <h1 className="text-3xl font-semibold text-white">Profile</h1>
          <p className="mt-3 text-slate-400">Update your name and password.</p>
          <div className="mt-8 space-y-4">
            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
              <p className="font-semibold text-white">Subscription</p>
              <p className="mt-2">Plan: {subscription?.currentPlan ?? "FREE"}</p>
              <p className="mt-1">Renewal: {subscription?.renewalDate ? new Date(subscription.renewalDate).toLocaleDateString() : "TBD"}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
              <p className="font-semibold text-white">Usage summary</p>
              <p className="mt-2">Uploads: {usage?.uploadsUsed ?? 0}</p>
              <p className="mt-1">Pages: {usage?.pagesUsed ?? 0}</p>
              <p className="mt-1">Storage: {usage ? `${usage.storageUsedMb.toFixed(1)} MB` : "0 MB"}</p>
            </div>
            <div>
              <label className="text-sm text-slate-300">Name</label>
              <input value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white" />
            </div>
            <div>
              <label className="text-sm text-slate-300">New Password</label>
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white" />
            </div>
            <button className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950">Save changes</button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
