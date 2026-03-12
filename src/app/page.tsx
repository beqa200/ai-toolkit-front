"use client";

import { useEffect, useState, useCallback } from "react";
import PromptForm from "@/components/PromptForm";
import JobCard from "@/components/JobCard";
import { fetchJobs } from "@/lib/api";
import { useJobUpdates } from "@/hooks/useSocket";
import { GenerationJob, CreateJobResponse } from "@/types";

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
    <div className="space-y-8">
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900 mb-4">Create Generation</h1>
        <PromptForm onJobCreated={handleJobCreated} />
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Jobs</h2>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg font-medium">No jobs yet</p>
            <p className="text-sm mt-1">Create your first generation above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
