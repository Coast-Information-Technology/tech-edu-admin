"use client";

import { Heart, Trash2 } from "lucide-react";
import { Interest } from "@/types/cv";

interface InterestsSectionProps {
  interests: Interest[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof Interest, value: string) => void;
}

export default function InterestsSection({
  interests,
  onAdd,
  onRemove,
  onUpdate,
}: InterestsSectionProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">
          {/* Interests */}
        </span>
        <button
          onClick={onAdd}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-[10px] transition-colors"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <span>Add Interest</span>
        </button>
      </div>

      {interests.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            No interests added yet
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Click &quot;Add Interest&quot; to get started
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {interests.map((interest) => (
            <div
              key={interest.id}
              className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-[10px]"
            >
              <div className="flex-1">
                <input
                  type="text"
                  value={interest.name}
                  onChange={(e) =>
                    onUpdate(interest.id, "name", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-[10px] focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Interest name"
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={interest.description || ""}
                  onChange={(e) =>
                    onUpdate(interest.id, "description", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-[10px] focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Description (optional)"
                />
              </div>
              <button
                onClick={() => onRemove(interest.id)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
