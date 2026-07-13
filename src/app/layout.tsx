import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DocMorph AI",
  description: "Convert handwritten documents into editable Excel using AI.",
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "DocMorph AI",
    description: "Convert handwritten documents into editable Excel using AI.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DocMorph AI",
    description: "Convert handwritten documents into editable Excel using AI.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-slate-950 text-slate-100">
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
