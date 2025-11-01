"use client";

import { useState } from "react";

interface LoadCVModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoad: (id: string) => void;
  isLoading: boolean;
}

export default function LoadCVModal({
  isOpen,
  onClose,
  onLoad,
  isLoading,
}: LoadCVModalProps) {
  const [cvId, setCvId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cvId.trim()) {
      onLoad(cvId.trim());
      setCvId("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-[10px] max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Load CV
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="cvId"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              CV ID
            </label>
            <input
              type="text"
              id="cvId"
              value={cvId}
              onChange={(e) => setCvId(e.target.value)}
              placeholder="Enter CV ID"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !cvId.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md transition-colors"
            >
              {isLoading ? "Loading..." : "Load CV"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
