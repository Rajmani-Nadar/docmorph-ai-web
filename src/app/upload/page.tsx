"use client";

import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { CheckCircle2, CheckSquare2, FileUp, PlugZap, RefreshCw, Upload, X } from "lucide-react";
import { useUpload } from "@/hooks/use-upload";
import { useHealthCheck } from "@/hooks/use-health-check";
import { useUsage, useSubscription } from "@/hooks/use-subscription";
import { ProcessingStatus } from "@/components/processing-status";
import { ExcelPreview } from "@/components/excel-preview";
import { ErrorAlert } from "@/components/error-alert";
import { SubscriptionUpgradeModal } from "@/components/subscription-upgrade-modal";

export default function UploadPage() {
  const { file, status, currentStep, progress, extractedData, error, message, currentPage, totalPages, selectFile, removeFile, handleUpload, handleDownload, handleCancel, reset } = useUpload();
  const { isOnline, isLoading: isHealthLoading, error: healthError, checkHealth } = useHealthCheck();
  const { usage, isLoading: usageLoading } = useUsage();
  const { subscription } = useSubscription();
  const [showError, setShowError] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    setShowError(Boolean(error || (!isOnline && !isHealthLoading)));
  }, [error, isOnline, isHealthLoading]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!isOnline) {
        setShowError(true);
        return;
      }

      if (acceptedFiles.length > 0) {
        selectFile(acceptedFiles[0]);
      }
    },
    [isOnline, selectFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    maxSize: 25 * 1024 * 1024,
    disabled: !isOnline || isHealthLoading,
  });

  const isProcessing = status === "processing" || status === "uploading" || status === "pending";
  const isComplete = status === "completed";
  const isFailed = status === "failed";
  const backendMessage = error || healthError || null;
  const quotaReached = (usage?.remainingUploads ?? 1) <= 0 || (usage?.remainingPages ?? 1) <= 0;
  const canUpload = isOnline && !isHealthLoading && !quotaReached;

  return (
    <div className="px-6 py-20 sm:px-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {showError && backendMessage && (
          <div className="mb-6">
            <ErrorAlert
              error={backendMessage}
              onDismiss={() => setShowError(false)}
              onRetry={isFailed ? handleUpload : () => {
                setShowError(false);
                checkHealth();
              }}
            />
          </div>
        )}

        <SubscriptionUpgradeModal
          open={showUpgradeModal}
          title="Your monthly quota has been reached"
          message="Upgrade to Pro or Enterprise to continue uploading PDFs and processing pages."
          onClose={() => setShowUpgradeModal(false)}
        />

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
          <div className="flex items-center gap-3">
            <PlugZap className={`h-4 w-4 ${isOnline ? "text-emerald-400" : "text-rose-400"}`} />
            <span>{isHealthLoading ? "Checking backend connection..." : isOnline ? "Backend Online" : "Backend Offline"}</span>
          </div>
          <button
            onClick={() => checkHealth()}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
          >
            <RefreshCw className={`h-4 w-4 ${isHealthLoading ? "animate-spin" : ""}`} /> Reconnect
          </button>
        </div>

        <div className="rounded-4xl border border-white/10 bg-white/5 p-8 shadow-[0_30px_120px_rgba(6,182,212,0.18)] backdrop-blur-2xl lg:p-12">
          {!isProcessing && !isComplete ? (
            <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Upload</p>
                <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">Drop in your handwritten PDF</h1>
                <p className="mt-4 text-lg leading-8 text-slate-400">
                  Upload a PDF up to 25MB and begin a premium extraction journey for student records, attendance registers, or admissions forms.
                </p>

                <div className="mt-8 rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-[0_20px_80px_rgba(6,182,212,0.08)]">
                  <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm text-cyan-100">
                    <p className="font-semibold text-white">Current plan: {subscription?.currentPlan ?? "FREE"}</p>
                    <p className="mt-1">Remaining uploads: {usage?.remainingUploads ?? "∞"}</p>
                    <p className="mt-1">Remaining pages: {usage?.remainingPages ?? "∞"}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-2 text-cyan-300">
                      <CheckSquare2 className="h-5 w-5" />
                    </div>
                    <p className="text-lg font-semibold text-white">Supported Documents</p>
                  </div>
                  <div className="mt-5 space-y-3 text-sm text-slate-300">
                    {["Attendance Registers", "Admission Forms", "Student Records", "Handwritten Tables"].map((item) => (
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

              <div
                {...getRootProps()}
                className={`cursor-pointer rounded-4xl border-2 border-dashed p-8 transition ${
                  isDragActive ? "border-cyan-300 bg-cyan-400/10" : "border-white/10 bg-slate-900/70"
                } ${!canUpload ? "opacity-70" : ""}`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center text-center">
                  {file ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                        <CheckCircle2 className="h-8 w-8" />
                      </div>
                      <p className="mt-5 text-lg font-semibold text-white">File selected</p>
                      <p className="mt-2 text-sm text-slate-400">{file.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      <div className="mt-6 flex flex-wrap justify-center gap-2">
                        <button
                          onClick={() => {
                            removeFile();
                          }}
                          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10"
                        >
                          <X className="h-4 w-4" /> Remove
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isOnline) {
                              setShowError(true);
                              return;
                            }
                            if (quotaReached) {
                              setShowUpgradeModal(true);
                              return;
                            }
                            handleUpload();
                          }}
                          disabled={!canUpload || isHealthLoading || usageLoading}
                          className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <Upload className="h-4 w-4" /> {quotaReached ? "Upgrade to Pro" : "Upload & Process"}
                        </button>
                      </div>
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
          ) : null}

          {isProcessing ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Processing</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Extracting handwritten data</h2>
                </div>
                <button
                  onClick={handleCancel}
                  className="rounded-full border border-rose-400/30 bg-rose-400/10 px-4 py-2 text-sm font-semibold text-rose-200 transition hover:bg-rose-400/20"
                >
                  Cancel
                </button>
              </div>
              <ProcessingStatus currentStep={currentStep} progress={progress} message={message} error={error} currentPage={currentPage} totalPages={totalPages} />
            </div>
          ) : null}

          {isComplete && file ? (
            <div className="space-y-6">
              <ExcelPreview
                data={extractedData}
                filename={file.name}
                onDownload={handleDownload}
                onReset={reset}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
