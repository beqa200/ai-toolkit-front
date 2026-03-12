"use client";

import { useState, useRef, useEffect } from "react";
import { createJob } from "@/lib/api";
import { GenerationType, CreateJobResponse } from "@/types";

const ImageIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
);

const TextIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
  </svg>
);

const SparkleIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
  </svg>
);

const LoadingSpinner = () => (
  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

interface PromptFormProps {
  onJobCreated: (response: CreateJobResponse) => void;
}

const MAX_CHARS = 500;

export default function PromptForm({ onJobCreated }: PromptFormProps) {
  const [prompt, setPrompt] = useState("");
  const [type, setType] = useState<GenerationType>("IMAGE");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const charCount = prompt.length;
  const isOverLimit = charCount > MAX_CHARS;
  const canSubmit = prompt.trim() && !loading && !isOverLimit;

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setError(null);

    try {
      const response = await createJob({ prompt: prompt.trim(), type });
      onJobCreated(response);
      setPrompt("");
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create job");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && canSubmit) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="relative">
        <label htmlFor="prompt" className="block text-sm font-semibold text-gray-800 mb-2">
          What would you like to create?
        </label>
        <div className="relative">
          <textarea
            ref={textareaRef}
            id="prompt"
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your vision in detail..."
            className={`w-full rounded-xl border-2 px-4 py-3 text-gray-900 placeholder-gray-400 transition-all duration-200 resize-none focus:outline-none ${
              isOverLimit
                ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                : "border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            } ${loading ? "bg-gray-50" : "bg-white"}`}
            disabled={loading}
          />
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <span className={`text-xs font-medium transition-colors ${
              isOverLimit ? "text-red-500" : charCount > MAX_CHARS * 0.8 ? "text-amber-500" : "text-gray-400"
            }`}>
              {charCount}/{MAX_CHARS}
            </span>
          </div>
        </div>
        <p className="mt-1.5 text-xs text-gray-500">
          Tip: Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 font-mono text-[10px]">⌘</kbd> + <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 font-mono text-[10px]">Enter</kbd> to generate
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex p-1 bg-gray-100 rounded-xl">
          {(["IMAGE", "TEXT"] as const).map((t) => {
            const isSelected = type === t;
            const Icon = t === "IMAGE" ? ImageIcon : TextIcon;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isSelected
                    ? "bg-white text-indigo-700 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Icon />
                {t === "IMAGE" ? "Image" : "Text"}
              </button>
            );
          })}
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="sm:ml-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-200"
        >
          {loading ? (
            <>
              <LoadingSpinner />
              <span>Creating...</span>
            </>
          ) : (
            <>
              <SparkleIcon />
              <span>Generate</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl animate-fade-in">
          <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-100 rounded-xl animate-fade-in">
          <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-green-700">Generation started! Check below for progress.</p>
        </div>
      )}
    </form>
  );
}
