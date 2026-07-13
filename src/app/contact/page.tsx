import { SectionHeading } from "@/components/section-heading";
import { Mail, PhoneCall } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="px-6 py-20 sm:px-8 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <SectionHeading
            eyebrow="Contact"
            title="Let’s build a smoother intake workflow"
            description="Whether you run a school office or a college administration team, we can help streamline extraction and review."
          />
          <div className="mt-8 space-y-4 text-slate-300">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-cyan-300" />
              <span>hello@handwrittenpdf.com</span>
            </div>
            <div className="flex items-center gap-3">
              <PhoneCall className="h-5 w-5 text-cyan-300" />
              <span>+1 (800) 555-0148</span>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 backdrop-blur-xl">
          <h3 className="text-2xl font-semibold text-white">Tell us about your campus workflow</h3>
          <p className="mt-3 text-slate-400">We will help you shape the right intake process for attendance records, admissions forms, and student lists.</p>
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm leading-7 text-slate-300">
            “Trusted by education teams who value clean data, fast turnaround, and polished exports.”
          </div>
        </div>
      </div>
    </div>
  );
}
