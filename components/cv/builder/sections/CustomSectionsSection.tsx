"use client";

import { Settings2 } from "lucide-react";
import { CustomSection } from "@/types/cv";
import GenericSection from "./GenericSection";
import RichTextEditor from "./RichTextEditor";

interface CustomSectionsSectionProps {
  customSections: CustomSection[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof CustomSection, value: string) => void;
}

export default function CustomSectionsSection({
  customSections,
  onAdd,
  onRemove,
  onUpdate,
}: CustomSectionsSectionProps) {
  return (
    <GenericSection
      title="/* Custom Sections */"
      items={customSections}
      emptyStateIcon={Settings2}
      emptyStateTitle="No custom sections added yet"
      emptyStateDescription='Click "Add Custom Section" to get started'
      addButtonText="Add Custom Section"
      onAdd={onAdd}
      onRemove={onRemove}
    >
      {(section: CustomSection) => (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Section Title
            </label>
            <input
              type="text"
              value={section.title}
              onChange={(e) => onUpdate(section.id, "title", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-[10px] focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Section title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Content
            </label>
            <RichTextEditor
              value={section.content}
              onChange={(value) => onUpdate(section.id, "content", value)}
              placeholder="Enter your custom content here..."
            />
          </div>
        </div>
      )}
    </GenericSection>
  );
}
