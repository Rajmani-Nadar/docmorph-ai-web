import { BillingEvent, DashboardStats, DownloadResponse, HistoryEntry, InvoiceDetails, JobStatusResponse, PaymentHistoryEntry, PaymentOrderResponse, PaymentVerificationResponse, Plan, SubscriptionState, UploadResponse, UsageSummary } from "@/types";

const DEFAULT_API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const LOGOUT_EVENT = "docmorph.logout";

class APIError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "APIError";
  }
}

function getConfiguredApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    const stored = window.localStorage.getItem("docmorph.apiUrl");
    if (stored && stored.trim()) {
      return stored.trim().replace(/\/$/, "");
    }
  }

  return DEFAULT_API_BASE_URL;
}

export function getApiBaseUrl(): string {
  return getConfiguredApiBaseUrl();
}

export function setApiBaseUrl(baseUrl: string): string {
  const normalized = baseUrl.trim().replace(/\/$/, "");
  if (typeof window !== "undefined") {
    window.localStorage.setItem("docmorph.apiUrl", normalized);
  }
  return normalized;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorPayload: unknown = { message: response.statusText };

    try {
      errorPayload = await response.json();
    } catch {
      errorPayload = { message: response.statusText };
    }

    const message =
      typeof errorPayload === "object" && errorPayload !== null && "message" in errorPayload
        ? String((errorPayload as { message?: string }).message || response.statusText)
        : response.statusText || "API request failed";

    throw new APIError(response.status, message, errorPayload);
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json() as Promise<T>;
  }

  return response.text() as unknown as T;
}

function getStoredSession(): { accessToken: string; refreshToken: string } | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem("docmorph.auth");
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { accessToken?: string; refreshToken?: string };
    return parsed.accessToken && parsed.refreshToken ? { accessToken: parsed.accessToken, refreshToken: parsed.refreshToken } : null;
  } catch {
    return null;
  }
}

function updateStoredSession(tokens: { accessToken: string; refreshToken: string }) {
  if (typeof window === "undefined") return;
  const raw = window.localStorage.getItem("docmorph.auth");
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw) as { user?: unknown };
    window.localStorage.setItem("docmorph.auth", JSON.stringify({ ...parsed, ...tokens }));
  } catch {
    // ignore
  }
}

function dispatchLogout() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(LOGOUT_EVENT));
  }
}

function clearSession() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("docmorph.auth");
  }
}

async function refreshToken(): Promise<boolean> {
  const stored = getStoredSession();
  if (!stored) return false;

  const response = await fetch(`${getConfiguredApiBaseUrl()}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: stored.refreshToken }),
  });

  if (!response.ok) {
    clearSession();
    dispatchLogout();
    return false;
  }

  const payload = await response.json().catch(() => ({})) as { access_token?: string; refresh_token?: string };
  if (!payload.access_token || !payload.refresh_token) {
    clearSession();
    dispatchLogout();
    return false;
  }

  updateStoredSession({ accessToken: payload.access_token, refreshToken: payload.refresh_token });
  return true;
}

async function fetchWithAuth(input: RequestInfo, init: RequestInit = {}, retry = true): Promise<Response> {
  const baseUrl = getConfiguredApiBaseUrl();
  const url = typeof input === "string" ? `${baseUrl}${input.startsWith("/") ? input : `/${input}`}` : input;
  const session = getStoredSession();
  const headers = new Headers(init.headers ?? {});

  if (session?.accessToken) {
    headers.set("Authorization", `Bearer ${session.accessToken}`);
  }

  const response = await fetch(url, { ...init, headers, credentials: "include" });

  if (response.status === 401 && retry) {
    const refreshed = await refreshToken();
    if (!refreshed) {
      throw new APIError(401, "Session expired. Please sign in again.");
    }
    const refreshedSession = getStoredSession();
    if (!refreshedSession?.accessToken) {
      throw new APIError(401, "Session expired. Please sign in again.");
    }
    headers.set("Authorization", `Bearer ${refreshedSession.accessToken}`);
    const retryResponse = await fetch(url, { ...init, headers, credentials: "include" });
    return retryResponse;
  }

  return response;
}

async function makeRequest<T>(input: RequestInfo, init: RequestInit = {}, retry = true): Promise<T> {
  const response = await fetchWithAuth(input, init, retry);
  return handleResponse<T>(response);
}

export async function healthCheck(): Promise<boolean> {
  try {
    const response = await fetch(`${getConfiguredApiBaseUrl()}/health`, { method: "GET" });
    if (!response.ok) {
      return false;
    }

    const payload = await response.json().catch(() => null);
    if (!payload || typeof payload !== "object") {
      return true;
    }

    if ("status" in payload) {
      const status = String((payload as { status?: string }).status || "").toLowerCase();
      return status === "ok" || status === "healthy" || status === "online";
    }

    return true;
  } catch {
    return false;
  }
}

export async function uploadPDF(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  return makeRequest<UploadResponse>("/upload", {
    method: "POST",
    body: formData,
  });
}

export async function getJobStatus(jobId: string): Promise<JobStatusResponse> {
  return makeRequest<JobStatusResponse>(`/status/${jobId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
}

export async function getResult(jobId: string): Promise<unknown> {
  return makeRequest<unknown>(`/result/${jobId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
}

export async function downloadExcel(jobId: string, format: "xlsx" | "csv" = "xlsx"): Promise<DownloadResponse> {
  const response = await fetchWithAuth(`/download/${jobId}?format=${format}`, {
    method: "GET",
  });

  if (!response.ok) {
    let errorPayload: unknown = { message: response.statusText };

    try {
      errorPayload = await response.json();
    } catch {
      errorPayload = { message: response.statusText };
    }

    const message =
      typeof errorPayload === "object" && errorPayload !== null && "message" in errorPayload
        ? String((errorPayload as { message?: string }).message || response.statusText)
        : response.statusText || "Download failed";

    throw new APIError(response.status, message, errorPayload);
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const payload = await response.json().catch(() => null);
    if (payload && typeof payload === "object" && "download_url" in payload) {
      return payload as DownloadResponse;
    }

    throw new APIError(response.status, "Download failed", payload);
  }

  const blob = await response.blob();
  const downloadUrl = URL.createObjectURL(blob);
  return {
    download_url: downloadUrl,
    file_format: format,
  };
}

export async function deleteJob(jobId: string): Promise<{ success: boolean; message: string }> {
  return makeRequest<{ success: boolean; message: string }>(`/job/${jobId}`, {
    method: "DELETE",
  });
}

export async function getMe(): Promise<{ id: string; name: string; email: string; role: string }> {
  return makeRequest<{ id: string; name: string; email: string; role: string }>("/auth/me", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
}

export async function getHistory(limit: number = 50, offset: number = 0): Promise<HistoryEntry[]> {
  return makeRequest<HistoryEntry[]>(`/history?limit=${limit}&offset=${offset}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
}

export async function getDashboardStats(): Promise<DashboardStats> {
  return makeRequest<DashboardStats>("/dashboard", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
}

export async function getPlans(): Promise<{ plans: Plan[] }> {
  return makeRequest<{ plans: Plan[] }>("/plans", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
}

export async function getSubscription(): Promise<SubscriptionState> {
  return makeRequest<SubscriptionState>("/subscription", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
}

export async function getUsage(): Promise<UsageSummary> {
  return makeRequest<UsageSummary>("/usage", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
}

export async function getBillingHistory(): Promise<{ events: BillingEvent[] }> {
  return makeRequest<{ events: BillingEvent[] }>("/billing/history", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function createPaymentOrder(planCode: string): Promise<PaymentOrderResponse> {
  return makeRequest<PaymentOrderResponse>("/payments/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ planCode }),
  });
}

export async function verifyPayment(payload: Record<string, unknown>): Promise<PaymentVerificationResponse> {
  return makeRequest<PaymentVerificationResponse>("/payments/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function getPaymentInvoice(invoiceId: string): Promise<InvoiceDetails> {
  return makeRequest<InvoiceDetails>(`/payments/invoice/${invoiceId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
}

export async function changeSubscription(planCode: string): Promise<SubscriptionState> {
  return makeRequest<SubscriptionState>("/subscription/change", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ planCode }),
  });
}

export async function deleteHistoryEntry(jobId: string) {
  return deleteJob(jobId);
}

export { APIError };
