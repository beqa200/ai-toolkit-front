"use client";

import { GenerationJob } from "@/types";
import StatusBadge from "@/components/ui/StatusBadge";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function resolveImageUrl(resultUrl: string): string {
  if (resultUrl.startsWith("http")) return resultUrl;
  return `${API_BASE}${resultUrl}`;
}

interface JobCardProps {
  job: GenerationJob;
}

export default function JobCard({ job }: JobCardProps) {
  const isImage = job.type === "IMAGE";
  const isCompleted = job.status === "COMPLETED";
  const isFailed = job.status === "FAILED";
  const isProcessing = job.status === "PENDING" || job.status === "GENERATING";

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden transition hover:shadow-md">
      {isImage && isCompleted && job.resultUrl && (
        <div className="relative aspect-square bg-gray-100">
          <img
            src={resolveImageUrl(job.resultUrl)}
            alt={job.originalPrompt}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {isImage && isProcessing && (
        <div className="aspect-square bg-gray-100 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-indigo-500 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm">Generating...</p>
          </div>
        </div>
      )}

      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <span className="text-xs font-medium text-indigo-600 uppercase">{job.type}</span>
          <StatusBadge status={job.status} />
        </div>

        <p className="text-sm text-gray-900 font-medium line-clamp-2">{job.originalPrompt}</p>

        {job.enhancedPrompt && (
          <p className="text-xs text-gray-500 line-clamp-2 italic">
            Enhanced: {job.enhancedPrompt}
          </p>
        )}

        {!isImage && isCompleted && job.resultText && (
          <div className="mt-2 rounded-lg bg-gray-50 p-3 text-sm text-gray-700 max-h-40 overflow-y-auto whitespace-pre-wrap">
            {job.resultText}
          </div>
        )}

        {isFailed && job.errorMessage && (
          <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">
            {job.errorMessage}
          </p>
        )}

        <p className="text-xs text-gray-400">
          {new Date(job.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
