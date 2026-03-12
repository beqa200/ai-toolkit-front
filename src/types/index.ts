export type JobStatus = "PENDING" | "GENERATING" | "COMPLETED" | "FAILED" | "CANCELLED";
export type GenerationType = "IMAGE" | "TEXT";

export interface GenerationJob {
  id: string;
  originalPrompt: string;
  enhancedPrompt: string | null;
  type: GenerationType;
  status: JobStatus;
  resultUrl: string | null;
  resultText: string | null;
  errorMessage: string | null;
  priority: number;
  cancelled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobRequest {
  prompt: string;
  type: GenerationType;
  priority?: number;
}

export interface CreateJobResponse {
  jobId: string;
  status: JobStatus;
  enhancedPrompt: string | null;
}

export interface JobUpdatePayload {
  jobId: string;
  status: JobStatus;
  resultUrl: string | null;
  resultText: string | null;
  errorMessage: string | null;
  updatedAt: string;
}
