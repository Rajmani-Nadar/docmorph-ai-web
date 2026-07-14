"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, LoaderCircle } from "lucide-react";
import type { ProcessingStep } from "@/types";

const STEP_LABELS: Record<ProcessingStep, string> = {
  upload_complete: "Upload Complete",
  converting_pdf: "Converting PDF",
  reading_page: "Reading Page",
  ai_recognition: "AI Recognition",
  structuring_data: "Structuring Data",
  generating_excel: "Generating Excel",
  ready: "Ready",
};

const STEP_DESCRIPTIONS: Record<ProcessingStep, string> = {
  upload_complete: "Your PDF has been uploaded successfully",
  converting_pdf: "Converting PDF pages to images",
  reading_page: "Reading handwritten content",
  ai_recognition: "Recognizing handwritten text using AI",
  structuring_data: "Organizing extracted data into tables",
  generating_excel: "Generating Excel spreadsheet",
  ready: "Extraction complete and ready for download",
};

const STEP_ORDER: ProcessingStep[] = [
  "upload_complete",
  "converting_pdf",
  "reading_page",
  "ai_recognition",
  "structuring_data",
  "generating_excel",
  "ready",
];

type ProcessingStatusProps = {
  currentStep: ProcessingStep | null;
  progress: number;
  totalPages?: number | null;
  currentPage?: number | null;
  message?: string | null;
  error?: string | null;
};

export function ProcessingStatus({ currentStep, progress, totalPages, currentPage, message, error }: ProcessingStatusProps) {
  const statusMessage = message || (error ? error : currentStep ? STEP_DESCRIPTIONS[currentStep] : "Processing...");
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-8 shadow-[0_20px_80px_rgba(6,182,212,0.12)]">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-white">
              {currentStep ? STEP_LABELS[currentStep] : "Processing..."}
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              {statusMessage}
              {currentStep === "reading_page" && typeof totalPages === "number" && typeof currentPage === "number" ? ` (${currentPage}/${totalPages})` : ""}
            </p>
            {error && !message ? <p className="mt-2 text-xs text-rose-300">{error}</p> : null}
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-cyan-300">{progress}%</p>
            <p className="text-xs text-slate-400">Complete</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8 h-2 overflow-hidden rounded-full bg-slate-800">
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500"
        />
      </div>

      {/* Steps Timeline */}
      <div className="space-y-3">
        {STEP_ORDER.map((step, index) => {
          const isCompleted = currentStep ? STEP_ORDER.indexOf(currentStep) > index : false;
          const isActive = currentStep === step;

          return (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center gap-3 rounded-lg border px-4 py-3 transition ${
                isActive
                  ? "border-cyan-400/30 bg-cyan-400/10"
                  : isCompleted
                    ? "border-white/10 bg-white/5"
                    : "border-white/5 bg-slate-900/50"
              }`}
            >
              <div className="flex h-6 w-6 items-center justify-center">
                {isCompleted ? (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
                    <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                  </motion.span>
                ) : isActive ? (
                  <LoaderCircle className="h-6 w-6 animate-spin text-cyan-300" />
                ) : (
                  <Circle className="h-6 w-6 text-slate-600" />
                )}
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm font-medium transition ${
                    isActive || isCompleted ? "text-white" : "text-slate-500"
                  }`}
                >
                  {STEP_LABELS[step]}
                </p>
                {isActive && (
                  <p className="text-xs text-cyan-300/80">{STEP_DESCRIPTIONS[step]}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
