'use client';

import { useEffect, useState, useCallback } from 'react';
import { fetchJobs } from '@/lib/api';
import { useJobUpdates } from '@/hooks/useSocket';
import { GenerationJob, JobStatus } from '@/types';
import StatusBadge from '@/components/ui/StatusBadge';

const ClockIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const ImageIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
    />
  </svg>
);

const TextIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
    />
  </svg>
);

const SearchIcon = () => (
  <svg
    className="w-4 h-4 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
    />
  </svg>
);

function TableRowSkeleton() {
  return (
    <tr>
      <td className="px-5 py-4">
        <div className="h-4 w-48 rounded animate-shimmer" />
      </td>
      <td className="px-5 py-4">
        <div className="h-4 w-16 rounded animate-shimmer" />
      </td>
      <td className="px-5 py-4">
        <div className="h-6 w-24 rounded-full animate-shimmer" />
      </td>
      <td className="px-5 py-4">
        <div className="h-4 w-32 rounded animate-shimmer" />
      </td>
    </tr>
  );
}

function formatDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } else if (days === 1) {
    return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } else if (days < 7) {
    return `${days} days ago`;
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
}

type StatusFilter = 'ALL' | JobStatus;

export default function HistoryPage() {
  const [jobs, setJobs] = useState<GenerationJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');

  const loadJobs = useCallback(async () => {
    try {
      setJobs(await fetchJobs());
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  useJobUpdates(() => {
    loadJobs();
  });

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.originalPrompt.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts: Record<StatusFilter, number> = {
    ALL: jobs.length,
    PENDING: jobs.filter((j) => j.status === 'PENDING').length,
    GENERATING: jobs.filter((j) => j.status === 'GENERATING').length,
    COMPLETED: jobs.filter((j) => j.status === 'COMPLETED').length,
    FAILED: jobs.filter((j) => j.status === 'FAILED').length,
    CANCELLED: jobs.filter((j) => j.status === 'CANCELLED').length,
  };

  const activeStatuses = (
    ['ALL', 'COMPLETED', 'GENERATING', 'PENDING', 'FAILED'] as StatusFilter[]
  ).filter((s) => statusCounts[s] > 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-200">
            <ClockIcon />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">History</h1>
            <p className="text-sm text-gray-500">Track all your generations</p>
          </div>
        </div>

        {jobs.length > 0 && (
          <div className="relative">
            <input
              type="text"
              placeholder="Search prompts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2.5 rounded-xl border-2 border-gray-200 bg-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <SearchIcon />
            </div>
          </div>
        )}
      </div>

      {jobs.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeStatuses.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                statusFilter === status
                  ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-200'
                  : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
              <span className="ml-1.5 text-xs opacity-60">({statusCounts[status]})</span>
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="overflow-x-auto rounded-2xl border border-gray-200/80 bg-white/80 backdrop-blur-sm shadow-xl shadow-gray-100/50">
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-4 font-semibold text-gray-700">Prompt</th>
                <th className="text-left px-5 py-4 font-semibold text-gray-700">Type</th>
                <th className="text-left px-5 py-4 font-semibold text-gray-700">Status</th>
                <th className="text-left px-5 py-4 font-semibold text-gray-700">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[...Array(5)].map((_, i) => (
                <TableRowSkeleton key={i} />
              ))}
            </tbody>
          </table>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20 px-6 rounded-2xl border-2 border-dashed border-gray-200 bg-gradient-to-br from-gray-50/50 to-slate-50/50">
          <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 text-indigo-400 mb-4">
            <ClockIcon />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No generation history</h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            Jobs you create will appear here so you can track their progress.
          </p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-16 px-6 rounded-2xl border-2 border-dashed border-gray-200 bg-gradient-to-br from-gray-50/50 to-slate-50/50">
          <p className="text-gray-500">No jobs matching your search</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200/80 bg-white/80 backdrop-blur-sm shadow-xl shadow-gray-100/50">
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-4 font-semibold text-gray-700">Prompt</th>
                <th className="text-left px-5 py-4 font-semibold text-gray-700">Type</th>
                <th className="text-left px-5 py-4 font-semibold text-gray-700">Status</th>
                <th className="text-left px-5 py-4 font-semibold text-gray-700">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredJobs.map((job, index) => (
                <tr
                  key={job.id}
                  className="hover:bg-indigo-50/30 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 0.03}s` }}
                >
                  <td className="px-5 py-4 max-w-xs">
                    <p className="truncate text-gray-900 font-medium">{job.originalPrompt}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 text-indigo-600">
                      {job.type === 'IMAGE' ? <ImageIcon /> : <TextIcon />}
                      <span className="text-xs font-semibold uppercase tracking-wide">{job.type}</span>
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={job.status} />
                  </td>
                  <td className="px-5 py-4 text-gray-500 whitespace-nowrap">
                    {formatDate(new Date(job.createdAt))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
