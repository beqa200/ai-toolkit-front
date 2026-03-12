"use client";

import { useState } from "react";
import { createJob } from "@/lib/api";
import { GenerationType, CreateJobResponse } from "@/types";

interface PromptFormProps {
  onJobCreated: (response: CreateJobResponse) => void;
}

export default function PromptForm({ onJobCreated }: PromptFormProps) {
  const [prompt, setPrompt] = useState("");
  const [type, setType] = useState<GenerationType>("IMAGE");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const response = await createJob({ prompt: prompt.trim(), type });
      onJobCreated(response);
      setPrompt("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create job");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
          Prompt
        </label>
        <textarea
          id="prompt"
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe what you want to generate..."
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition resize-none"
          disabled={loading}
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex rounded-lg border border-gray-300 overflow-hidden">
          {(["IMAGE", "TEXT"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`px-4 py-2 text-sm font-medium transition ${
                type === t
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {t === "IMAGE" ? "Image" : "Text"}
            </button>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="ml-auto rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? "Creating..." : "Generate"}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{error}</p>
      )}
    </form>
  );
}
