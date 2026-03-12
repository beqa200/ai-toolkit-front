import { CreateJobRequest, CreateJobResponse, GenerationJob } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with status ${res.status}`);
  }

  return res.json();
}

export function createJob(data: CreateJobRequest): Promise<CreateJobResponse> {
  return request("/api/generations", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function fetchJobs(limit?: number, offset?: number): Promise<GenerationJob[]> {
  const params = new URLSearchParams();
  if (limit !== undefined) params.set("limit", String(limit));
  if (offset !== undefined) params.set("offset", String(offset));
  const qs = params.toString();
  return request(`/api/generations${qs ? `?${qs}` : ""}`);
}

export function fetchJob(id: string): Promise<GenerationJob> {
  return request(`/api/generations/${id}`);
}

export interface CancelJobResponse {
  jobId: string;
  status: string;
  message: string;
}

export function cancelJob(id: string): Promise<CancelJobResponse> {
  return request(`/api/generations/${id}/cancel`, {
    method: "POST",
  });
}

export interface RetryJobResponse {
  jobId: string;
  status: string;
  originalJobId: string;
  message: string;
}

export function retryJob(id: string): Promise<RetryJobResponse> {
  return request(`/api/generations/${id}/retry`, {
    method: "POST",
  });
}
