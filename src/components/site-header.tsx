"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileSpreadsheet, Menu } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useSubscription } from "@/hooks/use-subscription";

const quickLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/history", label: "History" },
  { href: "/settings", label: "Settings" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { subscription } = useSubscription();
  const pricingHref = isAuthenticated ? "/subscription" : "/pricing";
  const links = [
    { href: "/features", label: "Features" },
    { href: pricingHref, label: "Pricing" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-white">
          <div className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-2">
            <FileSpreadsheet className="h-5 w-5 text-cyan-300" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] text-cyan-200 uppercase">
              DocMorph AI
            </p>
            <p className="text-xs text-slate-400">Convert handwritten documents into Excel</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-4 md:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition ${active ? "text-white" : "text-slate-400 hover:text-white"}`}
              >
                {link.label}
              </Link>
            );
          })}
          {quickLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition ${active ? "text-white" : "text-slate-400 hover:text-white"}`}
              >
                {link.label}
              </Link>
            );
          })}
          {isAuthenticated ? (
            <>
              <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm font-semibold text-cyan-200">
                {subscription?.currentPlan ?? "FREE"}
              </div>
              <Link href="/profile" className="text-sm font-medium text-slate-300 transition hover:text-white">
                {user?.name || "Profile"}
              </Link>
              <button onClick={logout} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-slate-300 transition hover:text-white">
                Login
              </Link>
              <Link href="/register" className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/20">
                Register
              </Link>
            </>
          )}
          <Link
            href="/upload"
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
          >
            Upload PDF
          </Link>
        </nav>

        <button className="rounded-full border border-white/10 p-2 text-slate-100 md:hidden" onClick={() => setOpen((value) => !value)}>
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-slate-950/95 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-slate-300" onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-slate-300" onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm font-semibold text-cyan-200">
                  {subscription?.currentPlan ?? "FREE"}
                </div>
                <Link href="/profile" className="text-sm font-medium text-slate-300" onClick={() => setOpen(false)}>
                  {user?.name || "Profile"}
                </Link>
                <button onClick={() => { logout(); setOpen(false); }} className="text-left text-sm font-semibold text-cyan-300">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-slate-300" onClick={() => setOpen(false)}>
                  Login
                </Link>
                <Link href="/register" className="text-sm font-semibold text-cyan-300" onClick={() => setOpen(false)}>
                  Register
                </Link>
              </>
            )}
            <Link href="/upload" className="text-sm font-semibold text-cyan-300" onClick={() => setOpen(false)}>
              Upload PDF
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
