"use client";

import { useEffect, useState } from "react";
import { LoaderCircle, Settings as SettingsIcon, ShieldCheck, Sparkles } from "lucide-react";
import { getApiBaseUrl, setApiBaseUrl, healthCheck } from "@/lib/api";

export default function SettingsPage() {
  const [apiUrl, setApiUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setApiUrl(getApiBaseUrl());
  }, []);

  const handleTestConnection = async () => {
    const normalized = setApiBaseUrl(apiUrl);
    setStatus("loading");
    setMessage("");

    try {
      const online = await healthCheck();
      setStatus(online ? "success" : "error");
      setMessage(online ? "Connection successful." : "The backend is currently unreachable.");
    } catch {
      setStatus("error");
      setMessage("Unable to reach the backend. Verify the URL and that the service is running.");
    }
  };

  return (
    <div className="px-6 py-20 sm:px-8 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <SettingsIcon className="h-5 w-5 text-cyan-300" />
            <h1 className="text-3xl font-semibold tracking-tight text-white">Account settings</h1>
          </div>
          <p className="mt-4 text-slate-400">Configure your institution workflow with clarity and confidence.</p>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 backdrop-blur-xl">
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-cyan-300" />
                <p className="font-semibold text-white">Secure uploads</p>
              </div>
              <p className="mt-2 text-sm text-slate-400">The upload flow now targets the live FastAPI backend, with health checks and connection validation.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-cyan-300" />
                <p className="font-semibold text-white">Automations</p>
              </div>
              <p className="mt-2 text-sm text-slate-400">Set up review, export, and delivery preferences for campus operations.</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
              <label className="text-sm font-semibold text-white" htmlFor="api-url">Backend URL</label>
              <input
                id="api-url"
                value={apiUrl}
                onChange={(event) => setApiUrl(event.target.value)}
                className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 outline-none"
                placeholder="http://localhost:8000"
              />
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <button
                  onClick={handleTestConnection}
                  className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/20"
                >
                  {status === "loading" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                  Test connection
                </button>
                <button
                  onClick={() => {
                    const normalized = setApiBaseUrl(apiUrl);
                    setApiUrl(normalized);
                    setStatus("success");
                    setMessage("API URL saved locally.");
                  }}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10"
                >
                  Save
                </button>
              </div>
              {message ? (
                <p className={`mt-3 text-sm ${status === "success" ? "text-emerald-300" : "text-rose-300"}`}>{message}</p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
