import Link from "next/link";
import { ArrowRight, FileSpreadsheet } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/90">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <div className="flex items-center gap-3 text-white">
            <div className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-2">
              <FileSpreadsheet className="h-5 w-5 text-cyan-300" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.2em] text-cyan-200 uppercase">DocMorph AI</p>
              <p className="text-sm text-slate-400">Premium document intelligence for modern teams</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-slate-400">
          <Link href="/features" className="transition hover:text-white">Features</Link>
          <Link href="/pricing" className="transition hover:text-white">Pricing</Link>
          <Link href="/contact" className="transition hover:text-white">Contact</Link>
        </div>

        <Link href="/upload" className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200 transition hover:bg-cyan-400/20">
          Start a conversation <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </footer>
  );
}
