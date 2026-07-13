import { History as HistoryIcon, Download, FileSpreadsheet } from "lucide-react";

const records = [
  { name: "Student Register 01", createdAt: "Jun 10, 2026", status: "Exported", type: "Excel" },
  { name: "Admission Batch 02", createdAt: "Jun 8, 2026", status: "Pending", type: "CSV" },
  { name: "Attendance Forms", createdAt: "Jun 4, 2026", status: "Ready", type: "Excel" },
];

export default function HistoryPage() {
  return (
    <div className="px-6 py-20 sm:px-8 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <HistoryIcon className="h-5 w-5 text-cyan-300" />
          <h1 className="text-3xl font-semibold tracking-tight text-white">Processing history</h1>
        </div>
        <div className="mt-8 overflow-hidden rounded-3xl border border-white/10">
          <table className="min-w-full divide-y divide-white/10 text-left">
            <thead className="bg-slate-900/80 text-sm uppercase tracking-[0.2em] text-slate-400">
              <tr>
                <th className="px-4 py-4">Document</th>
                <th className="px-4 py-4">Created</th>
                <th className="px-4 py-4">Type</th>
                <th className="px-4 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 bg-slate-950/70 text-sm text-slate-300">
              {records.map((record) => (
                <tr key={record.name}>
                  <td className="px-4 py-4">{record.name}</td>
                  <td className="px-4 py-4">{record.createdAt}</td>
                  <td className="px-4 py-4">{record.type}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-cyan-200">{record.status}</span>
                      <Download className="h-4 w-4 text-slate-400" />
                      <FileSpreadsheet className="h-4 w-4 text-slate-400" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
