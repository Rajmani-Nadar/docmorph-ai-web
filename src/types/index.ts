export type UploadStatus = "idle" | "uploading" | "processing" | "success" | "error";

export type ExtractionResult = {
  success: boolean;
  data?: Record<string, string>[];
  error?: string;
};

export type ExportFormat = "xlsx" | "csv";
