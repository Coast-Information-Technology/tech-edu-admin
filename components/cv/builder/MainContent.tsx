"use client";

import { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Section } from "@/types/cv";

interface MainContentProps {
  children: ReactNode;
  sections: Section[];
  enabledSections: string[];
  activeSection: string;
  onNavigateSection: (direction: "next" | "prev") => void;
}

export default function MainContent({
  children,
  sections,
  enabledSections,
  activeSection,
  onNavigateSection,
}: MainContentProps) {
  const enabledSectionsList = sections.filter((section) =>
    enabledSections.includes(section.id)
  );
  const currentIndex = enabledSectionsList.findIndex(
    (section) => section.id === activeSection
  );
  const currentSection = enabledSectionsList[currentIndex];

  return (
    <div className="w-full">
      <div className="bg-white dark:bg-gray-800 rounded-[10px] shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        {/* Section Header */}
        {currentSection && (
          <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-[10px] flex items-center justify-center">
                <currentSection.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {currentSection.label}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Step {currentIndex + 1} of {enabledSectionsList.length}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {children}
      </div>
    </div>
  );
}
