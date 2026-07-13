"use client";

import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { CheckCircle2, CheckSquare2, Download, FileText, FileUp, LoaderCircle, Table2, Upload, Sparkles } from "lucide-react";

const workflowSteps = [
  { title: "Uploading PDF...", description: "Preparing your document for analysis" },
  { title: "Converting PDF to Images...", description: "Rendering each page for OCR" },
  { title: "Reading Page 1 / 4", description: "Inspecting handwritten content" },
  { title: "AI Extracting Handwritten Records...", description: "Recognizing tables and fields" },
  { title: "Validating Extracted Data...", description: "Checking structure and consistency" },
  { title: "Generating Excel...", description: "Building the final spreadsheet" },
  { title: "Extraction Completed", description: "Your preview is ready" },
];

const previewRows = [
  { sno: "1", studentName: "Arun Kumar", fatherName: "Ramesh", mobile: "9876543210", className: "VI", dob: "12/02/2015", bloodGroup: "O+", confidence: { label: "High", percent: "95%", tone: "emerald" } },
  { sno: "2", studentName: "Divya Raj", fatherName: "Mohan", mobile: "9345678901", className: "VI", dob: "18/08/2015", bloodGroup: "A+", confidence: { label: "Medium", percent: "80%", tone: "amber" } },
  { sno: "3", studentName: "Harish", fatherName: "Kumar", mobile: "9876512345", className: "VI", dob: "05/11/2015", bloodGroup: "B+", confidence: { label: "Low", percent: "60%", tone: "rose" } },
];

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!isUploading) return;

    const timer = window.setInterval(() => {
      setActiveStep((value) => {
        const nextValue = value + 1;
        if (nextValue >= workflowSteps.length) {
          window.clearInterval(timer);
          setProgress(100);
          setShowPreview(true);
          setIsUploading(false);
          return workflowSteps.length - 1;
        }

        setProgress(Math.round(((nextValue + 1) / workflowSteps.length) * 100));
        return nextValue;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isUploading]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selected = acceptedFiles[0];
    if (!selected) return;
    setFile(selected);
    setActiveStep(0);
    setProgress(0);
    setShowPreview(false);
    setIsUploading(true);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    maxSize: 25 * 1024 * 1024,
  });

  return (
    <div className="px-6 py-20 sm:px-8 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_30px_120px_rgba(6,182,212,0.18)] backdrop-blur-2xl lg:p-12">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Upload</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">Drop in your handwritten PDF</h1>
            <p className="mt-4 text-lg leading-8 text-slate-400">
              Upload a PDF up to 25MB and begin a premium extraction journey for student records, attendance registers, or admissions forms.
            </p>

            <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-6 shadow-[0_20px_80px_rgba(6,182,212,0.08)]">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-2 text-cyan-300">
                  <CheckSquare2 className="h-5 w-5" />
                </div>
                <p className="text-lg font-semibold text-white">Supported Documents</p>
              </div>
              <div className="mt-5 space-y-3 text-sm text-slate-300">
                {[
                  "Attendance Registers",
                  "Admission Forms",
                  "Student Records",
                  "Handwritten Tables",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-400">
                <p className="font-semibold text-white">Maximum File Size</p>
                <p className="mt-1">25 MB</p>
                <p className="mt-3 font-semibold text-white">Supported Format</p>
                <p className="mt-1">PDF</p>
                <p className="mt-3 text-slate-400">Single-page and multi-page PDFs are accepted.</p>
              </div>
            </div>
          </div>

          <div {...getRootProps()} className={`cursor-pointer rounded-[2rem] border-2 border-dashed p-8 transition ${isDragActive ? "border-cyan-300 bg-cyan-400/10" : "border-white/10 bg-slate-900/70"}`}>
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center text-center">
              {isUploading ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
                    <LoaderCircle className="h-8 w-8 animate-spin" />
                  </div>
                  <p className="mt-5 text-xl font-semibold text-white">{workflowSteps[activeStep].title}</p>
                  <p className="mt-2 text-sm text-slate-400">{workflowSteps[activeStep].description}</p>
                  <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-800">
                    <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500" />
                  </div>
                  <div className="mt-4 text-sm text-cyan-300">{progress}% complete</div>
                </motion.div>
              ) : (
                <>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-cyan-300">
                    <FileUp className="h-8 w-8" />
                  </div>
                  <p className="mt-6 text-xl font-semibold text-white">Drag & drop a PDF here</p>
                  <p className="mt-2 text-sm text-slate-400">Or click to browse. Only PDF files up to 25MB are supported.</p>
                </>
              )}
            </div>
          </div>
        </div>

        {file ? (
          <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Selected file</p>
                <p className="mt-3 text-lg font-semibold text-white">{file.name}</p>
                <p className="mt-2 text-sm text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">{showPreview ? "Preview ready" : "Awaiting extraction"}</div>
            </div>
          </div>
        ) : null}

        {showPreview ? (
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mt-8 rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-6 shadow-[0_20px_80px_rgba(6,182,212,0.12)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Preview Table</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Extracted records ready for review</h2>
              </div>
              <button className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/20">
                <Download className="h-4 w-4" /> Download Excel
              </button>
            </div>

            <div className="mt-6 overflow-hidden rounded-[1.25rem] border border-white/10">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm text-slate-300">
                  <thead className="sticky top-0 z-10 bg-slate-900/90 text-slate-300">
                    <tr>
                      <th className="px-4 py-3">S.No</th>
                      <th className="px-4 py-3">Student Name</th>
                      <th className="px-4 py-3">Father Name</th>
                      <th className="px-4 py-3">Mobile Number</th>
                      <th className="px-4 py-3">Class</th>
                      <th className="px-4 py-3">DOB</th>
                      <th className="px-4 py-3">Blood Group</th>
                      <th className="px-4 py-3">Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((row) => {
                      const toneMap: Record<string, string> = {
                        emerald: "bg-emerald-500/15 text-emerald-300",
                        amber: "bg-amber-500/15 text-amber-300",
                        rose: "bg-rose-500/15 text-rose-300",
                      };
                      return (
                        <tr key={row.sno} className="border-t border-white/10 bg-slate-950/60 transition hover:bg-white/5">
                          <td className="px-4 py-3 text-white">{row.sno}</td>
                          <td className="px-4 py-3">{row.studentName}</td>
                          <td className="px-4 py-3">{row.fatherName}</td>
                          <td className="px-4 py-3">{row.mobile}</td>
                          <td className="px-4 py-3">{row.className}</td>
                          <td className="px-4 py-3">{row.dob}</td>
                          <td className="px-4 py-3">{row.bloodGroup}</td>
                          <td className="px-4 py-3">
                            <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${toneMap[row.confidence.tone]}`}>
                              <span className="h-2 w-2 rounded-full bg-current" />
                              {row.confidence.label}
                              <span className="opacity-80">{row.confidence.percent}</span>
                              {Number(row.confidence.percent.replace("%", "")) < 80 ? <span className="text-xs">Needs Review</span> : null}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}
