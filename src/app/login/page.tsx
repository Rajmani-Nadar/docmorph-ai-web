import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6 py-20 sm:px-8 lg:px-8">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_30px_120px_rgba(6,182,212,0.18)] backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-3 text-cyan-300">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Login</p>
            <h1 className="text-2xl font-semibold text-white">Welcome back</h1>
          </div>
        </div>
        <div className="mt-8 space-y-3">
          <button className="w-full rounded-full border border-white/10 bg-slate-900/80 px-4 py-3 text-sm font-semibold text-white transition hover:border-cyan-400/30">Continue with Google</button>
          <button className="w-full rounded-full border border-white/10 bg-slate-900/80 px-4 py-3 text-sm font-semibold text-white transition hover:border-cyan-400/30">Continue with GitHub</button>
        </div>
        <p className="mt-8 text-sm text-slate-400">
          New here? <Link href="/register" className="font-semibold text-cyan-300">Create an account</Link>
        </p>
        <Link href="/dashboard" className="mt-8 inline-flex items-center gap-2 rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">
          Continue to dashboard <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
