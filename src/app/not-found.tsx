import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6 py-20">
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">404</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Page not found</h1>
        <p className="mt-4 text-slate-400">The page you requested does not exist yet.</p>
        <Link href="/" className="mt-8 inline-flex rounded-full bg-cyan-400 px-5 py-3 font-semibold text-slate-950">
          Go home
        </Link>
      </div>
    </div>
  );
}
