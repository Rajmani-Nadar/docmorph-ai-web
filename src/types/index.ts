// Job and Upload Types
export type JobStatus = "pending" | "processing" | "completed" | "failed" | "cancelled";

export type ProcessingStep =
  | "upload_complete"
  | "converting_pdf"
  | "reading_page"
  | "ai_recognition"
  | "structuring_data"
  | "generating_excel"
  | "ready";

export type ExportFormat = "xlsx" | "csv";

// API Response Types
export type UploadResponse = {
  jobId: string;
  status: JobStatus;
};

export type JobStatusResponse = {
  status: JobStatus;
  progress: number;
  stage?: string | null;
  currentStep?: string | null;
  currentPage?: number;
  totalPages?: number;
  completedPages?: number;
  failedPages?: number;
  estimatedRemaining?: string | null;
  message?: string | null;
  error?: string | null;
};

export type DownloadResponse = {
  download_url: string;
  file_format: ExportFormat;
};

// Data Model Types
export type ExtractedRow = {
  [key: string]: string | number | null;
};

export type ExtractionResult = {
  success: boolean;
  data?: ExtractedRow[];
  error?: string;
};

// Upload State Types
export type UploadState = {
  file: File | null;
  jobId: string | null;
  status: JobStatus | "idle" | "uploading";
  currentStep: ProcessingStep | null;
  progress: number;
  extractedData: ExtractedRow[];
  error: string | null;
  message: string | null;
  currentPage: number | null;
  totalPages: number | null;
};

// History Types
export type HistoryEntry = {
  id?: string;
  job_id: string;
  filename: string;
  status: JobStatus;
  uploaded_at: string;
  completed_at?: string;
  rows_extracted: number;
  file_size: number;
};

// Dashboard Stats
export type DashboardStats = {
  today_uploads: number;
  total_pdfs: number;
  average_processing_time: number;
  total_downloads: number;
  recent_activity: HistoryEntry[];
};

// Auth Types
export type User = {
  id: string;
  email: string;
  name: string;
  role?: string;
};

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

export type PlanFeatureFlags = {
  priorityProcessing: boolean;
  csvExport: boolean;
  apiAccess: boolean;
  bulkUploads: boolean;
  customBranding: boolean;
};

export type Plan = {
  code: string;
  name: string;
  description: string;
  maxUploadsPerMonth: number | null;
  maxPagesPerMonth: number | null;
  maxUploadSizeMb: number | null;
  features: PlanFeatureFlags;
  historyDays: number | null;
};

export type SubscriptionState = {
  planCode: string;
  currentPlan: string;
  planName: string;
  subscriptionStatus: string;
  billingStatus: string;
  renewalDate: string | null;
  features: PlanFeatureFlags;
};

export type UsageSummary = {
  currentPlan: string;
  uploadsUsed: number;
  pagesUsed: number;
  downloads: number;
  storageUsedBytes: number;
  storageUsedMb: number;
  remainingUploads: number | null;
  remainingPages: number | null;
  monthlyUsage: {
    uploads: number;
    pages: number;
    excelDownloads: number;
    csvDownloads: number;
    processingTimeSeconds: number;
  };
  planLimit: {
    maxUploadsPerMonth: number | null;
    maxPagesPerMonth: number | null;
    maxUploadSizeMb: number | null;
  };
};

export type BillingEvent = {
  id: number;
  eventType: string;
  amount: number;
  currency: string;
  status: string;
  referenceId: string | null;
  occurredAt: string | null;
  details: Record<string, unknown>;
};

export type PaymentOrderResponse = {
  orderId?: string;
  order_id?: string;
  amount?: number | string;
  currency?: string;
  keyId?: string;
  key_id?: string;
  id?: string;
  message?: string;
};

export type PaymentVerificationResponse = {
  success?: boolean;
  verified?: boolean;
  status?: string;
  message?: string;
};

export type PaymentHistoryEntry = {
  id?: number | string;
  eventType?: string;
  amount?: number | string;
  currency?: string;
  status?: string;
  referenceId?: string | null;
  occurredAt?: string | null;
  plan?: string;
  planCode?: string;
  currentPlan?: string;
  details?: Record<string, unknown>;
};

export type InvoiceDetails = {
  id?: string | number;
  invoiceId?: string | number;
  invoiceNumber?: string;
  status?: string;
  amount?: number | string;
  currency?: string;
  createdAt?: string;
  issuedAt?: string;
  paidAt?: string;
  plan?: string;
  planCode?: string;
  [key: string]: unknown;
};
