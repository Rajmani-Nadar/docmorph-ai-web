export async function uploadPDF(file: File): Promise<{ success: boolean; uploadId?: string }> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: formData });
  return res.json();
}

export async function extractData(uploadId: string): Promise<{ success: boolean; data?: Record<string, string>[] }> {
  const res = await fetch("/api/extract", { method: "POST", body: JSON.stringify({ uploadId }) });
  return res.json();
}

export async function exportFile(uploadId: string, format: "xlsx" | "csv"): Promise<{ success: boolean; url?: string }> {
  const res = await fetch("/api/export", { method: "POST", body: JSON.stringify({ uploadId, format }) });
  return res.json();
}
