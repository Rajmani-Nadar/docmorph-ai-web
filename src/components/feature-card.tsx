import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

type FeatureCardProps = {
  title: string;
  description: string;
  icon: ReactNode;
  href?: string;
};

export function FeatureCard({ title, description, icon, href }: FeatureCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(6,182,212,0.12)] backdrop-blur-xl">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-400">{description}</p>
      {href ? (
        <Link href={href} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300">
          Explore <ArrowRight className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  );
}
