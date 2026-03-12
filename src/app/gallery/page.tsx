"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchJobs } from "@/lib/api";
import { useJobUpdates } from "@/hooks/useSocket";
import { GenerationJob, GenerationType } from "@/types";
import JobCard from "@/components/JobCard";

const PhotoIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
);

const ImageIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
);

const TextIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
  </svg>
);

function JobCardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white/80 overflow-hidden">
      <div className="aspect-square animate-shimmer" />
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-4 w-16 rounded-full animate-shimmer" />
          <div className="h-6 w-20 rounded-full animate-shimmer" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full rounded animate-shimmer" />
          <div className="h-4 w-2/3 rounded animate-shimmer" />
        </div>
        <div className="h-3 w-20 rounded animate-shimmer" />
      </div>
    </div>
  );
}

type FilterType = "ALL" | GenerationType;

export default function GalleryPage() {
  const [jobs, setJobs] = useState<GenerationJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("ALL");

  const loadJobs = useCallback(async () => {
    try {
      const all = await fetchJobs();
      setJobs(all.filter((j) => j.status === "COMPLETED"));
    } catch (err) {
      console.error("Failed to load gallery:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  useJobUpdates((payload) => {
    if (payload.status === "COMPLETED") {
      loadJobs();
    }
  });

  const filteredJobs = filter === "ALL" ? jobs : jobs.filter((j) => j.type === filter);
  const imageCount = jobs.filter((j) => j.type === "IMAGE").length;
  const textCount = jobs.filter((j) => j.type === "TEXT").length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-200">
            <PhotoIcon />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gallery</h1>
            <p className="text-sm text-gray-500">Your completed AI generations</p>
          </div>
        </div>

        {jobs.length > 0 && (
          <div className="flex p-1 bg-gray-100/80 rounded-xl">
            <button
              onClick={() => setFilter("ALL")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filter === "ALL"
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              All ({jobs.length})
            </button>
            <button
              onClick={() => setFilter("IMAGE")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filter === "IMAGE"
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <ImageIcon />
              Images ({imageCount})
            </button>
            <button
              onClick={() => setFilter("TEXT")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filter === "TEXT"
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <TextIcon />
              Text ({textCount})
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20 px-6 rounded-2xl border-2 border-dashed border-gray-200 bg-gradient-to-br from-gray-50/50 to-slate-50/50">
          <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 text-indigo-400 mb-4">
            <PhotoIcon />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No completed generations yet</h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            Create a generation to see your results here in the gallery.
          </p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-16 px-6 rounded-2xl border-2 border-dashed border-gray-200 bg-gradient-to-br from-gray-50/50 to-slate-50/50">
          <p className="text-gray-500">No {filter.toLowerCase()} generations found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job, index) => (
            <div key={job.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
              <JobCard job={job} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
