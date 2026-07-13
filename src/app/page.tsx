"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, BrainCircuit, CheckCircle2, CirclePlay, Download, FileSpreadsheet, ShieldCheck, Sparkles, Table2, Upload, Workflow, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { FeatureCard } from "@/components/feature-card";
import { FAQAccordion } from "@/components/faq-accordion";
import { SectionHeading } from "@/components/section-heading";

const features = [
  {
    title: "AI Powered Extraction",
    description: "State-of-the-art handwriting recognition converts records into structured tables with exceptional clarity.",
    icon: <BrainCircuit className="h-6 w-6" />,
  },
  {
    title: "Editable Before Download",
    description: "Review every extracted row and refine details before exporting your workbook.",
    icon: <Table2 className="h-6 w-6" />,
  },
  {
    title: "Enterprise Security",
    description: "Secure document handling with polished workflows designed for institutional teams.",
    icon: <ShieldCheck className="h-6 w-6" />,
  },
  {
    title: "Lightning Fast Processing",
    description: "Accelerate repetitive data entry with rapid preprocessing and confident extraction.",
    icon: <Zap className="h-6 w-6" />,
  },
  {
    title: "Responsive Experience",
    description: "A refined interface that works beautifully across desktop, tablet, and mobile devices.",
    icon: <Workflow className="h-6 w-6" />,
  },
  {
    title: "Excel Export Ready",
    description: "Generate spreadsheet-ready output in moments, complete with editable rows and review status.",
    icon: <Download className="h-6 w-6" />,
  },
];

const workflowSteps = [
  {
    title: "Upload PDF",
    description: "Upload handwritten attendance registers, admission forms, or student records.",
    icon: Upload,
  },
  {
    title: "AI Reads Handwriting",
    description: "Google Gemini AI reads every handwritten record accurately.",
    icon: Sparkles,
  },
  {
    title: "Review Extracted Data",
    description: "Preview the extracted table and edit any field before exporting.",
    icon: Table2,
  },
  {
    title: "Download Excel",
    description: "Export to Excel instantly and keep the workflow moving.",
    icon: Download,
  },
];

const badges = [
  { label: "AI Powered", icon: Sparkles },
  { label: "Multi-page PDF Support", icon: FileSpreadsheet },
  { label: "Editable Preview", icon: Table2 },
  { label: "Excel Export", icon: Download },
];

const testimonials = [
  {
    role: "School Administrator",
    quote: "Reduced our manual data entry work from hours to minutes.",
  },
  {
    role: "College Office",
    quote: "The extraction quality is excellent, and the preview makes corrections effortless.",
  },
  {
    role: "Hospital Records Department",
    quote: "We are excited to use this once medical forms are supported.",
  },
];

export default function Home() {
  return (
    <div className="overflow-hidden">
      <section className="relative px-6 pb-24 pt-16 sm:px-8 lg:px-8 lg:pt-24">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_30px_120px_rgba(6,182,212,0.18)] backdrop-blur-2xl sm:p-12 lg:p-16">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">
                <Sparkles className="h-4 w-4" />
                Premium AI extraction for handwritten documents
              </div>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-6xl">
                Convert handwritten documents into editable Excel with DocMorph AI.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
                Turn attendance registers, admissions forms, and handwritten tables into polished spreadsheets in minutes with a premium workflow built for modern teams.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/upload" className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300">
                  Upload PDF <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/features" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3 font-semibold text-white transition hover:border-cyan-400/40 hover:text-cyan-200">
                  <CirclePlay className="h-4 w-4" /> View Demo
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                {badges.map((badge) => {
                  const Icon = badge.icon;
                  return (
                    <div key={badge.label} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/70 px-4 py-2 text-sm text-slate-300">
                      <Icon className="h-4 w-4 text-cyan-300" />
                      {badge.label}
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="relative">
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-cyan-400/30 via-fuchsia-500/10 to-transparent blur-3xl" />
              <div className="relative rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl">
                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Live workflow</p>
                      <p className="text-xl font-semibold text-white">Extraction in progress</p>
                    </div>
                    <div className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm text-emerald-300">Live</div>
                  </div>
                  <div className="mt-6 space-y-4">
                    {[
                      { name: "Attendance Register", state: "Reading page 2/4" },
                      { name: "Admission Forms", state: "Reviewing rows" },
                      { name: "Student Records", state: "Ready to export" },
                    ].map((item) => (
                      <div key={item.name} className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-cyan-400/30">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-white">{item.name}</p>
                          <p className="text-sm text-slate-400">{item.state}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 sm:px-8 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="How it Works"
            title="Convert handwritten documents into Excel in four simple steps"
            description="A premium experience from upload to export with guided review and confidence-aware results."
            align="center"
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-4">
            {workflowSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.3, delay: index * 0.08 }}
                  className="relative rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(6,182,212,0.12)] backdrop-blur-xl"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Step {index + 1}</p>
                  <h3 className="mt-3 text-xl font-semibold text-white">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-400">{step.description}</p>
                  {index < workflowSteps.length - 1 ? (
                    <div className="mt-6 hidden lg:flex lg:justify-end">
                      <ArrowRight className="h-5 w-5 text-cyan-300" />
                    </div>
                  ) : null}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 sm:px-8 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Why Choose DocMorph AI"
            title="Premium document intelligence for modern teams"
            description="Every detail is designed to feel polished, efficient, and confidently automated."
            align="center"
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard key={feature.title} title={feature.title} description={feature.description} icon={feature.icon} href="/upload" />
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 sm:px-8 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-400/10 via-slate-900/70 to-fuchsia-500/10 p-8 shadow-[0_30px_120px_rgba(6,182,212,0.16)] lg:p-12">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Testimonials</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Trusted by teams handling high-volume records.</h2>
              <p className="mt-4 text-lg text-slate-400">A thoughtful experience that removes friction from administrative workflows.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <motion.div key={testimonial.role} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 shadow-[0_16px_60px_rgba(2,8,23,0.4)]">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                    <BadgeCheck className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-semibold text-white">{testimonial.role}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-400">“{testimonial.quote}”</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 sm:px-8 lg:px-8">
        <div className="mx-auto max-w-7xl grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_20px_80px_rgba(6,182,212,0.12)] backdrop-blur-xl">
            <SectionHeading
              eyebrow="FAQ"
              title="Everything you need to know"
              description="A clear and premium experience for every step of the document conversion journey."
            />
            <div className="mt-8">
              <FAQAccordion />
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-400/10 via-slate-900/70 to-fuchsia-500/10 p-8 shadow-[0_30px_120px_rgba(6,182,212,0.16)]">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Ready to begin</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Ready to automate handwritten document processing?</h2>
            <p className="mt-4 text-lg text-slate-400">Upload a PDF and turn paper-based records into polished Excel tables in minutes.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/upload" className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300">
                Upload PDF <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/features" className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 font-semibold text-white transition hover:border-cyan-400/40 hover:text-cyan-200">
                View Demo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
