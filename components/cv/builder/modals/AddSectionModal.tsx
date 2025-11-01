"use client";

import { useState } from "react";
import { X, Search } from "lucide-react";
import { getAllSections } from "@/lib/cv/sections/sectionRegistry";

interface AddSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSection: (sectionType: string) => void;
  availableSections: string[]; // Sections already in the template
}

export default function AddSectionModal({
  isOpen,
  onClose,
  onAddSection,
  availableSections,
}: AddSectionModalProps) {
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen) return null;

  const allSections = getAllSections();
  const availableToAdd = Object.keys(allSections).filter(
    (sectionType) => !availableSections.includes(sectionType)
  );

  const filteredSections = availableToAdd.filter((sectionType) => {
    const sectionInfo = allSections[sectionType];
    const searchLower = searchTerm.toLowerCase();
    return (
      sectionInfo.displayName.toLowerCase().includes(searchLower) ||
      (sectionInfo.description?.toLowerCase().includes(searchLower) ?? false) ||
      sectionType.toLowerCase().includes(searchLower)
    );
  });

  const handleAddSection = (sectionType: string) => {
    onAddSection(sectionType);
    onClose();
    setSearchTerm("");
  };

  const handleClose = () => {
    onClose();
    setSearchTerm("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-[10px] shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Add New Section
          </h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search sections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Sections List */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredSections.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm
                  ? "No sections found matching your search."
                  : "No sections available to add."}
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {filteredSections.map((sectionType) => {
                const sectionInfo = allSections[sectionType];
                return (
                  <button
                    key={sectionType}
                    onClick={() => handleAddSection(sectionType)}
                    className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-[10px] hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 text-left group"
                  >
                    <span className="text-2xl">{sectionInfo.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {sectionInfo.displayName}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {sectionInfo.description}
                      </p>
                      <span className="inline-block mt-2 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                        {sectionInfo.category}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
