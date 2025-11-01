"use client";

import { GraduationCap } from "lucide-react";
import { Education } from "@/types/cv";
import AccordionSection from "./AccordionSection";

interface EducationSectionProps {
  educations: Education[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (
    id: string,
    field: keyof Education,
    value: string | boolean
  ) => void;
}

export default function EducationSection({
  educations,
  onAdd,
  onRemove,
  onUpdate,
}: EducationSectionProps) {
  const getEducationTitle = (edu: Education) => {
    if (edu.institution && edu.degree && edu.field) {
      return `${edu.degree} in ${edu.field || "General"}`;
    }
    return edu.institution || edu.degree || edu.field || "";
  };

  return (
    <AccordionSection
      title="Education"
      items={educations}
      emptyStateIcon={GraduationCap}
      emptyStateTitle="No education added yet"
      emptyStateDescription='Click "Add Education" to get started'
      addButtonText="Add Education"
      onAdd={onAdd}
      onRemove={onRemove}
      getItemTitle={getEducationTitle}
    >
      {(edu: Education) => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Institution
            </label>
            <input
              type="text"
              value={edu.institution}
              onChange={(e) => onUpdate(edu.id, "institution", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-[10px] focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="University/School name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Degree
            </label>
            <input
              type="text"
              value={edu.degree}
              onChange={(e) => onUpdate(edu.id, "degree", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-[10px] focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Bachelor's, Master's, etc."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Field of Study
            </label>
            <input
              type="text"
              value={edu.field || ""}
              onChange={(e) => onUpdate(edu.id, "field", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-[10px] focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Computer Science, Business, etc."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Location
            </label>
            <input
              type="text"
              value={edu.location || ""}
              onChange={(e) => onUpdate(edu.id, "location", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-[10px] focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="City, State"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Start Date
            </label>
            <input
              type="month"
              value={edu.startDate}
              onChange={(e) => onUpdate(edu.id, "startDate", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-[10px] focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={edu.current}
              onChange={(e) => onUpdate(edu.id, "current", e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Currently studying here
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              End Date
            </label>
            <input
              type="month"
              value={edu.endDate || ""}
              onChange={(e) => onUpdate(edu.id, "endDate", e.target.value)}
              disabled={edu.current}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-[10px] focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              GPA (Optional)
            </label>
            <input
              type="text"
              value={edu.gpa || ""}
              onChange={(e) => onUpdate(edu.id, "gpa", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-[10px] focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="3.8/4.0"
            />
          </div>
        </div>
      )}
    </AccordionSection>
  );
}
