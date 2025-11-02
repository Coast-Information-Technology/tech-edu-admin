"use client";
import React from "react";
import { ResumeSection } from "@/types/cv/index";
import {
  UserIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  StarIcon,
  DocumentTextIcon,
  LanguageIcon,
  TrophyIcon,
  CodeBracketIcon,
  HeartIcon,
  BookOpenIcon,
  ClipboardDocumentListIcon,
  BuildingOfficeIcon,
  NewspaperIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { Plus, Trash2 } from "lucide-react";

interface SectionListProps {
  sections: ResumeSection[];
  onSectionClick: (section: ResumeSection) => void;
  onAddSection: () => void;
  onRemoveSection?: (sectionId: string) => void;
}

const sectionIcons: { [key: string]: React.ComponentType<any> } = {
  "personal-info": UserIcon,
  "work-experience": BriefcaseIcon,
  education: AcademicCapIcon,
  skills: StarIcon,
  "professional-summary": DocumentTextIcon,
  languages: LanguageIcon,
  awards: TrophyIcon,
  projects: CodeBracketIcon,
  interests: HeartIcon,
  certifications: BookOpenIcon,
  courses: ClipboardDocumentListIcon,
  organizations: BuildingOfficeIcon,
  publications: NewspaperIcon,
  references: UserGroupIcon,
};

export function SectionList({
  sections,
  onSectionClick,
  onAddSection,
  onRemoveSection,
}: SectionListProps) {
  return (
    <div className="space-y-3">
      {/* Add Section Button */}
      <button
        onClick={onAddSection}
        className="w-full flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-[20px] text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 group"
      >
        <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center">
          <span className="text-lg font-semibold text-gray-400 group-hover:text-blue-600">
            <Plus size={15} className="font-bold" />
          </span>
        </div>
        <span className="font-medium">Add New Section</span>
      </button>

      {/* Section List */}
      {sections.map((section) => {
        const IconComponent = sectionIcons[section.type] || DocumentTextIcon;
        const isCoreSection = [
          "personal-info",
          "work-experience",
          "education",
          "skills",
          "professional-summary",
        ].includes(section.type);

        console.log(
          "Section:",
          section.type,
          "isCore:",
          isCoreSection,
          "hasRemove:",
          !!onRemoveSection
        );

        return (
          <div
            key={section.id}
            className="w-full flex items-center space-x-4 p-4 bg-white rounded-[20px] border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
          >
            {/* Icon */}
            <div className="w-10 h-10 rounded-[10px] bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
              <IconComponent className="h-5 w-5 text-gray-600 group-hover:text-blue-600" />
            </div>

            {/* Content */}
            <button
              onClick={() => onSectionClick(section)}
              className="flex-1 text-left"
            >
              <h3 className="font-medium text-gray-900 group-hover:text-blue-900">
                {section.heading ||
                  section.type?.replace("-", " ") ||
                  "Unknown Section"}
              </h3>
              <p className="text-sm text-gray-500">
                {section.type === "personal-info" &&
                  "Name, contact, and basic info"}
                {section.type === "work-experience" &&
                  "Your professional work history"}
                {section.type === "education" &&
                  "Academic background and degrees"}
                {section.type === "skills" && "Technical and soft skills"}
                {section.type === "professional-summary" &&
                  "Career overview and objectives"}
                {section.type === "languages" && "Spoken and written languages"}
                {section.type === "awards" && "Recognition and achievements"}
                {section.type === "projects" &&
                  "Personal and professional projects"}
                {section.type === "interests" &&
                  "Hobbies and personal interests"}
                {section.type === "certifications" &&
                  "Professional certifications"}
                {section.type === "courses" && "Completed courses and training"}
                {section.type === "organizations" && "Professional memberships"}
                {section.type === "publications" &&
                  "Published works and papers"}
                {section.type === "references" && "Professional references"}
              </p>
            </button>

            {/* Remove Button (only for non-core sections) */}
            {!isCoreSection && onRemoveSection && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  console.log(
                    "Remove button clicked for section:",
                    section.type
                  );
                  onRemoveSection(section.id);
                  // if (
                  //   confirm(
                  //     `Are you sure you want to remove the "${
                  //       section.heading || section.type
                  //     }" section?`
                  //   )
                  // ) {
                  //
                  // }
                }}
                className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors"
                title="Remove section"
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </button>
            )}

            {/* Arrow */}
            <div className="w-6 h-6 rounded-full bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
              <svg
                className="h-3 w-3 text-gray-400 group-hover:text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}
