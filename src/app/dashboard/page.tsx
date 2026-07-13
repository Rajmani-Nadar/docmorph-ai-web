import { FileSpreadsheet, Download, History, Sparkles } from "lucide-react";

const cards = [
  { title: "Total PDFs", value: "128", icon: <FileSpreadsheet className="h-6 w-6" /> },
  { title: "Students Extracted", value: "8,402", icon: <Sparkles className="h-6 w-6" /> },
  { title: "Downloads", value: "96", icon: <Download className="h-6 w-6" /> },
];

const recentUploads = [
  { name: "Attendance Register A", date: "2 hours ago", status: "Ready" },
  { name: "Admission Batch 04", date: "Today", status: "Reviewing" },
  { name: "Student Records", date: "Yesterday", status: "Exported" },
];

export default function DashboardPage() {
  return (
    <div className="px-6 py-20 sm:px-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Dashboard</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">Operational overview</h1>
          </div>
          <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">Live workspace</div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {cards.map((card) => (
            <div key={card.title} className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-400">{card.title}</p>
                <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-2 text-cyan-300">{card.icon}</div>
              </div>
              <p className="mt-6 text-3xl font-semibold text-white">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <History className="h-5 w-5 text-cyan-300" />
              <h2 className="text-xl font-semibold text-white">Recent uploads</h2>
            </div>
            <div className="mt-6 space-y-4">
              {recentUploads.map((upload) => (
                <div key={upload.name} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                  <div>
                    <p className="font-medium text-white">{upload.name}</p>
                    <p className="text-sm text-slate-400">{upload.date}</p>
                  </div>
                  <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200">{upload.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <h2 className="text-xl font-semibold text-white">Why teams use this flow</h2>
            <p className="mt-4 text-sm leading-7 text-slate-400">A calm, structured workflow reduces manual errors and helps campus staff get to clean spreadsheets faster.</p>
            <div className="mt-8 rounded-2xl border border-white/10 bg-slate-950/70 p-6 text-sm leading-7 text-slate-300">
              “Upload once, review easily, export in Excel or CSV for administration needs.”
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
