"use client";

import { useEffect, useState, useCallback } from "react";
import PromptForm from "@/components/PromptForm";
import JobCard from "@/components/JobCard";
import { fetchJobs } from "@/lib/api";
import { useJobUpdates } from "@/hooks/useSocket";
import { GenerationJob, CreateJobResponse } from "@/types";

const SparklesIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
  </svg>
);

const RocketIcon = () => (
  <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
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

export default function HomePage() {
  const [jobs, setJobs] = useState<GenerationJob[]>([]);
  const [loading, setLoading] = useState(true);

  const loadJobs = useCallback(async () => {
    try {
      const data = await fetchJobs(20);
      setJobs(data);
    } catch (err) {
      console.error("Failed to load jobs:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  useJobUpdates((payload) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === payload.jobId
          ? {
              ...job,
              status: payload.status,
              resultUrl: payload.resultUrl,
              resultText: payload.resultText,
              errorMessage: payload.errorMessage,
              updatedAt: payload.updatedAt,
            }
          : job
      )
    );
  });

  function handleJobCreated(_response: CreateJobResponse) {
    loadJobs();
  }

  return (
    <div className="space-y-10">
      <section className="rounded-2xl border border-gray-200/80 bg-white/80 backdrop-blur-sm p-6 md:p-8 shadow-xl shadow-gray-100/50 animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-200">
            <SparklesIcon />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Create Generation</h1>
            <p className="text-sm text-gray-500">Transform your ideas into images or text</p>
          </div>
        </div>
        <PromptForm onJobCreated={handleJobCreated} />
      </section>

      <section className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Recent Generations</h2>
            <p className="text-sm text-gray-500 mt-0.5">Your latest AI-powered creations</p>
          </div>
          {jobs.length > 0 && (
            <span className="text-sm text-gray-400 font-medium">
              {jobs.length} {jobs.length === 1 ? "item" : "items"}
            </span>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-16 px-6 rounded-2xl border-2 border-dashed border-gray-200 bg-gradient-to-br from-gray-50/50 to-slate-50/50">
            <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 text-indigo-400 mb-4">
              <RocketIcon />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No generations yet</h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              Start by entering a prompt above to create your first AI-powered image or text.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job, index) => (
              <div key={job.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                <JobCard job={job} onJobUpdate={loadJobs} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
