"use client";

import { useCallback, useEffect, useState } from "react";
import { uploadPDF, getJobStatus, getResult, downloadExcel, deleteJob, APIError } from "@/lib/api";
import type { UploadState, ExtractedRow, JobStatusResponse, ProcessingStep, UploadResponse } from "@/types";

const initialState: UploadState = {
  file: null,
  jobId: null,
  status: "idle",
  currentStep: null,
  progress: 0,
  extractedData: [],
  error: null,
  message: null,
  currentPage: null,
  totalPages: null,
};

function normalizeExtractedData(payload: unknown): ExtractedRow[] {
  if (Array.isArray(payload)) {
    return payload as ExtractedRow[];
  }

  if (!payload || typeof payload !== "object") {
    return [];
  }

  const value = payload as Record<string, unknown>;
  const candidates = [value.extracted_data, value.data, value.rows, value.result, value.results, value.records];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate as ExtractedRow[];
    }

    if (candidate && typeof candidate === "object") {
      const nested = candidate as Record<string, unknown>;
      if (Array.isArray(nested.data)) {
        return nested.data as ExtractedRow[];
      }
      if (Array.isArray(nested.rows)) {
        return nested.rows as ExtractedRow[];
      }
      if (Array.isArray(nested.records)) {
        return nested.records as ExtractedRow[];
      }
    }
  }

  return [];
}

function normalizeProcessingStep(rawStep: string | null | undefined): ProcessingStep | null {
  if (!rawStep) {
    return null;
  }

  const value = rawStep.trim().toLowerCase();
  const mapping: Record<string, ProcessingStep> = {
    upload_complete: "upload_complete",
    converting_pdf: "converting_pdf",
    reading_page: "reading_page",
    ai_recognition: "ai_recognition",
    structuring_data: "structuring_data",
    generating_excel: "generating_excel",
    saving_results: "ready",
    ready: "ready",
    completed: "ready",
  };

  if (["failed", "error", "cancelled", "canceled"].includes(value)) {
    return null;
  }

  return mapping[value] ?? null;
}

export function useUpload() {
  const [state, setState] = useState<UploadState>(initialState);
  const [isPolling, setIsPolling] = useState(false);

  const selectFile = useCallback((file: File) => {
    if (file.type !== "application/pdf") {
      setState((prev) => ({
        ...prev,
        error: "Only PDF files are allowed",
      }));
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setState((prev) => ({
        ...prev,
        error: "File size must be less than 25MB",
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      file,
      error: null,
      message: null,
      currentPage: null,
      totalPages: null,
      status: "idle",
      jobId: null,
      currentStep: null,
      progress: 0,
      extractedData: [],
    }));
  }, []);

  const removeFile = useCallback(() => {
    setState((prev) => ({
      ...prev,
      file: null,
      error: null,
      message: null,
      currentPage: null,
      totalPages: null,
      status: "idle",
      jobId: null,
      currentStep: null,
      progress: 0,
      extractedData: [],
    }));
  }, []);

  const handleUpload = useCallback(async () => {
    if (!state.file) return;

    setState((prev) => ({
      ...prev,
      status: "uploading",
      error: null,
      message: null,
      currentPage: null,
      totalPages: null,
      jobId: null,
      currentStep: null,
      progress: 0,
      extractedData: [],
    }));

    try {
      const response = await uploadPDF(state.file);
      const jobId = (response as UploadResponse & { job_id?: string }).jobId || (response as UploadResponse & { job_id?: string }).job_id;
      setState((prev) => ({
        ...prev,
        jobId: jobId || null,
        status: response.status,
        progress: 5,
        error: null,
        currentStep: "upload_complete",
      }));
      setIsPolling(Boolean(jobId));
    } catch (err) {
      const message = err instanceof APIError ? err.message : "Upload failed";
      setState((prev) => ({
        ...prev,
        status: "failed",
        error: message,
      }));
    }
  }, [state.file]);

  useEffect(() => {
    if (!isPolling || !state.jobId) return;

    const pollInterval = window.setInterval(async () => {
      try {
        const status: JobStatusResponse = await getJobStatus(state.jobId!);
        const nextStatus = status.status || "processing";
        const nextStep = normalizeProcessingStep(status.stage ?? status.currentStep ?? null);

        setState((prev) => ({
          ...prev,
          status: nextStatus,
          currentStep: nextStep,
          progress: Math.max(0, Math.min(100, Math.round(status.progress || 0))),
          error: status.error || null,
          message: status.message || null,
          currentPage: typeof status.currentPage === "number" ? status.currentPage : prev.currentPage,
          totalPages: typeof status.totalPages === "number" ? status.totalPages : prev.totalPages,
        }));

        if (nextStatus === "completed") {
          const result = await getResult(state.jobId!);
          setState((prev) => ({
            ...prev,
            extractedData: normalizeExtractedData(result),
            currentStep: "ready",
            progress: 100,
            error: null,
            message: result && typeof result === "object" ? (result as { message?: string }).message ?? "Extraction completed successfully" : "Extraction completed successfully",
          }));
          setIsPolling(false);
          window.clearInterval(pollInterval);
        } else if (nextStatus === "failed") {
          setState((prev) => ({
            ...prev,
            error: prev.error || status.error || "Processing failed",
            currentStep: nextStep ?? prev.currentStep ?? null,
            message: status.message || prev.message || status.error || "Processing failed",
          }));
          setIsPolling(false);
          window.clearInterval(pollInterval);
        }
      } catch (err) {
        const message = err instanceof APIError ? err.message : "Status check failed";
        setState((prev) => ({
          ...prev,
          error: message,
        }));
        setIsPolling(false);
        window.clearInterval(pollInterval);
      }
    }, 2000);

    return () => window.clearInterval(pollInterval);
  }, [isPolling, state.jobId]);

  const handleDownload = useCallback(
    async (format: "xlsx" | "csv" = "xlsx") => {
      if (!state.jobId) return;

      try {
        const response = await downloadExcel(state.jobId, format);
        const link = document.createElement("a");
        link.href = response.download_url;
        link.download = `extraction.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        if (response.download_url.startsWith("blob:")) {
          window.setTimeout(() => URL.revokeObjectURL(response.download_url), 10000);
        }
      } catch (err) {
        const message = err instanceof APIError ? err.message : "Download failed";
        setState((prev) => ({
          ...prev,
          error: message,
        }));
      }
    },
    [state.jobId]
  );

  const handleCancel = useCallback(async () => {
    if (!state.jobId) return;

    try {
      await deleteJob(state.jobId);
      setIsPolling(false);
      setState(initialState);
    } catch (err) {
      const message = err instanceof APIError ? err.message : "Cancel failed";
      setState((prev) => ({
        ...prev,
        error: message,
      }));
    }
  }, [state.jobId]);

  const reset = useCallback(() => {
    setState(initialState);
    setIsPolling(false);
  }, []);

  return {
    file: state.file,
    jobId: state.jobId,
    status: state.status,
    currentStep: state.currentStep,
    progress: state.progress,
    extractedData: state.extractedData,
    error: state.error,
    message: state.message,
    currentPage: state.currentPage,
    totalPages: state.totalPages,
    isProcessing: state.status === "processing" || state.status === "uploading" || state.status === "pending",
    selectFile,
    removeFile,
    handleUpload,
    handleDownload,
    handleCancel,
    reset,
  };
}
