"use client";

import { Trophy } from "lucide-react";
import { Award as AwardType } from "@/types/cv";
import GenericSection from "./GenericSection";
import RichTextEditor from "./RichTextEditor";

interface AwardsSectionProps {
  awards: AwardType[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof AwardType, value: string) => void;
}

export default function AwardsSection({
  awards,
  onAdd,
  onRemove,
  onUpdate,
}: AwardsSectionProps) {
  return (
    <GenericSection
      title="/* Awards */"
      items={awards}
      emptyStateIcon={Trophy}
      emptyStateTitle="No awards added yet"
      emptyStateDescription='Click "Add Award" to get started'
      addButtonText="Add Award"
      onAdd={onAdd}
      onRemove={onRemove}
    >
      {(award: AwardType) => (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Award Title
              </label>
              <input
                type="text"
                value={award.title}
                onChange={(e) => onUpdate(award.id, "title", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-[10px] focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Award title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Issuing Organization
              </label>
              <input
                type="text"
                value={award.issuer}
                onChange={(e) => onUpdate(award.id, "issuer", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-[10px] focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Issuing organization"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Award Date
              </label>
              <input
                type="month"
                value={award.date}
                onChange={(e) => onUpdate(award.id, "date", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-[10px] focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description (Optional)
            </label>
            <RichTextEditor
              value={award.description || ""}
              onChange={(value) => onUpdate(award.id, "description", value)}
              placeholder="Describe the award and its significance..."
            />
          </div>
        </>
      )}
    </GenericSection>
  );
}
