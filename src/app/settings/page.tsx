import { Settings as SettingsIcon, ShieldCheck, Sparkles } from "lucide-react";

export default function SettingsPage() {
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
              <p className="mt-2 text-sm text-slate-400">PDFs are handled through placeholder backend routes that will later connect to the Python service.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-cyan-300" />
                <p className="font-semibold text-white">Automations</p>
              </div>
              <p className="mt-2 text-sm text-slate-400">Set up review, export, and delivery preferences for campus operations.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
