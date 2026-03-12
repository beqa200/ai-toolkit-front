'use client';

import { useState } from 'react';
import { GenerationJob } from '@/types';
import StatusBadge from '@/components/ui/StatusBadge';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function resolveImageUrl(resultUrl: string): string {
  if (resultUrl.startsWith('http')) return resultUrl;
  return `${API_BASE}${resultUrl}`;
}

const ImageIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
    />
  </svg>
);

const TextIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
    />
  </svg>
);

const ExpandIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
    />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
    />
  </svg>
);

interface JobCardProps {
  job: GenerationJob;
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
}

export default function JobCard({ job }: JobCardProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const isImage = job.type === 'IMAGE';
  const isCompleted = job.status === 'COMPLETED';
  const isFailed = job.status === 'FAILED';
  const isProcessing = job.status === 'PENDING' || job.status === 'GENERATING';

  const imageUrl = job.resultUrl ? resolveImageUrl(job.resultUrl) : null;

  return (
    <>
      <div className="group rounded-2xl border border-gray-200/80 bg-white/80 backdrop-blur-sm shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-indigo-100/50 hover:border-indigo-200/50 hover:-translate-y-1">
        {isImage && isCompleted && imageUrl && (
          <div
            className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-50 cursor-pointer overflow-hidden"
            onClick={() => setLightboxOpen(true)}
          >
            <img
              src={imageUrl}
              alt={job.originalPrompt}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              <ExpandIcon />
            </div>
          </div>
        )}

        {isImage && isProcessing && (
          <div className="aspect-square bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
            <div className="text-center w-full flex flex-col items-center">
              <div className="relative mx-auto">
                <div className="w-16 h-16 border-4 border-indigo-100 rounded-full" />
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-indigo-500 rounded-full animate-spin" />
              </div>
              <p className="text-sm text-indigo-600 font-medium mt-4">Creating magic...</p>
              <p className="text-xs text-indigo-400 mt-1">This may take a moment</p>
            </div>
          </div>
        )}

        {isImage && isFailed && (
          <div className="aspect-square bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
            <div className="text-center px-6">
              <div className="w-12 h-12 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-3">
                <svg
                  className="w-6 h-6 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                  />
                </svg>
              </div>
              <p className="text-sm text-red-600 font-medium">Generation failed</p>
            </div>
          </div>
        )}

        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-indigo-600">
              {isImage ? <ImageIcon /> : <TextIcon />}
              <span className="text-xs font-semibold uppercase tracking-wide">{job.type}</span>
            </div>
            <StatusBadge status={job.status} />
          </div>

          <p className="text-sm text-gray-800 font-medium line-clamp-2 leading-relaxed">
            {job.originalPrompt}
          </p>

          {job.enhancedPrompt && (
            <div className="flex items-start gap-2 p-2.5 bg-indigo-50/50 rounded-lg">
              <svg
                className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                />
              </svg>
              <p className="text-xs text-indigo-700 line-clamp-2 leading-relaxed">
                {job.enhancedPrompt}
              </p>
            </div>
          )}

          {!isImage && isCompleted && job.resultText && (
            <div className="mt-2 rounded-xl bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-100 p-4 text-sm text-gray-700 max-h-44 overflow-y-auto whitespace-pre-wrap leading-relaxed">
              {job.resultText}
            </div>
          )}

          {isFailed && job.errorMessage && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-xl">
              <svg
                className="w-4 h-4 text-red-500 shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
              <p className="text-xs text-red-700">{job.errorMessage}</p>
            </div>
          )}

          <div className="flex items-center gap-1.5 text-xs text-gray-400 pt-1">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {formatRelativeTime(new Date(job.createdAt))}
          </div>
        </div>
      </div>

      {lightboxOpen && imageUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fade-in"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <CloseIcon />
          </button>

          <a
            href={imageUrl}
            download
            onClick={(e) => e.stopPropagation()}
            className="absolute top-4 right-16 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <DownloadIcon />
          </a>

          <img
            src={imageUrl}
            alt={job.originalPrompt}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          />

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 max-w-2xl px-6 py-3 bg-white/10 backdrop-blur-md rounded-xl">
            <p className="text-white/90 text-sm text-center line-clamp-2">{job.originalPrompt}</p>
          </div>
        </div>
      )}
    </>
  );
}
