"use client";

import { Languages, Trash2 } from "lucide-react";
import { Language } from "@/types/cv";

interface LanguagesSectionProps {
  languages: Language[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof Language, value: string) => void;
}

export default function LanguagesSection({
  languages,
  onAdd,
  onRemove,
  onUpdate,
}: LanguagesSectionProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">
          {/* Languages */}
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
          <span>Add Language</span>
        </button>
      </div>

      {languages.length === 0 ? (
        <div className="text-center py-12">
          <Languages className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            No languages added yet
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Click &quot;Add Language&quot; to get started
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {languages.map((lang) => (
            <div
              key={lang.id}
              className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-[10px]"
            >
              <div className="flex-1">
                <input
                  type="text"
                  value={lang.name}
                  onChange={(e) => onUpdate(lang.id, "name", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-[10px] focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Language name"
                />
              </div>
              <div className="w-40">
                <select
                  value={lang.level}
                  onChange={(e) => onUpdate(lang.id, "level", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-[10px] focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="Basic">Basic</option>
                  <option value="Conversational">Conversational</option>
                  <option value="Professional">Professional</option>
                  <option value="Native">Native</option>
                </select>
              </div>
              <button
                onClick={() => onRemove(lang.id)}
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
