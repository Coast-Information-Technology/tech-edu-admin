"use client";
import React, { useState } from "react";
import { XMarkIcon, PencilIcon, CheckIcon } from "@heroicons/react/24/outline";
import { ResumeSection } from "@/types/cv/index";

interface SectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: ResumeSection | null;
  // allow async or sync saves
  onSave: (section: ResumeSection) => void | Promise<void>;
  onUpdateSection?: (
    sectionId: string,
    updates: Partial<ResumeSection>
  ) => void;
  children?: React.ReactNode;
}

export function SectionModal({
  isOpen,
  onClose,
  section,
  onSave,
  onUpdateSection,
  children,
}: SectionModalProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(section?.heading || "");
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (section) setEditedTitle(section.heading || "");
  }, [section]);

  const handleSaveTitle = () => {
    if (section && onUpdateSection && editedTitle.trim()) {
      onUpdateSection(section.id, { heading: editedTitle.trim() });
      setIsEditingTitle(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedTitle(section?.heading || "");
    setIsEditingTitle(false);
  };

  const handleSave = async () => {
    if (!section || isLoading) return;
    try {
      setIsLoading(true);
      await onSave(section);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !section) return null;

  return (
    <div className="absolute inset-0 z-50 bg-white shadow-xl rounded-[10px]">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex-1">
            {isEditingTitle ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="text-lg font-semibold text-gray-900 bg-transparent border-b-2 border-blue-500 focus:outline-none focus:border-blue-600"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveTitle();
                    else if (e.key === "Escape") handleCancelEdit();
                  }}
                />
                <button
                  onClick={handleSaveTitle}
                  className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                  title="Save title"
                  disabled={isLoading}
                >
                  <CheckIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="p-1 text-gray-500 hover:bg-gray-100 rounded transition-colors"
                  title="Cancel edit"
                  disabled={isLoading}
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-semibold text-gray-900 capitalize">
                  {section.heading || section.type.replace("-", " ")}
                </h2>
                <button
                  onClick={() => setIsEditingTitle(true)}
                  className="p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded transition-colors"
                  title="Edit section title"
                  disabled={isLoading}
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
              </div>
            )}
            <p className="text-sm text-gray-600">
              Edit your {section.heading || section.type.replace("-", " ")}{" "}
              information
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-[10px] p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pb-20 hide-custom-scrollbar">
          <div className="p-6">{children}</div>
        </div>

        {/* Fixed Footer */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 px-6 py-4 bg-white shadow-lg">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-[10px] hover:bg-gray-50 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-[10px] hover:bg-blue-700 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading && (
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              )}
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
