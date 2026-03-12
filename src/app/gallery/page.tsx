"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchJobs } from "@/lib/api";
import { useJobUpdates } from "@/hooks/useSocket";
import { GenerationJob } from "@/types";
import JobCard from "@/components/JobCard";

export default function GalleryPage() {
  const [jobs, setJobs] = useState<GenerationJob[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p className="text-lg font-medium">No completed generations yet</p>
        <p className="text-sm mt-1">Create a generation to see results here.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Gallery</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
