"use client";

import React from "react";
import { getSectionComponent } from "@/lib/cv/sections/sectionRegistry";

interface DynamicSectionRendererProps {
  sectionType: string;
  sectionData: any;
  sectionConfig?: any;
  onUpdate?: (updates: any) => void;
  onAdd?: () => void;
  onRemove?: (id: string) => void;
  // Add other common section props as needed
  [key: string]: any;
}

/**
 * Dynamic Section Renderer - Renders any section component based on section type
 * This eliminates the need for hardcoded switch statements!
 */
export default function DynamicSectionRenderer({
  sectionType,
  sectionData,
  sectionConfig,
  onUpdate,
  onAdd,
  onRemove,
  ...props
}: DynamicSectionRendererProps) {
  // Get the section component dynamically
  const sectionInfo = getSectionComponent(sectionType);

  if (!sectionInfo) {
    console.warn(`Section component not found for type: ${sectionType}`);
    return (
      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-[10px]">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p className="text-sm">Section "{sectionType}" not available</p>
          <p className="text-xs mt-1">
            This section type is not registered in the system.
          </p>
        </div>
      </div>
    );
  }

  const SectionComponent = sectionInfo.component;

  // Create props object for the section component
  const sectionProps = {
    // Common props that most sections expect
    ...props,

    // Pass sectionConfig explicitly for components that need it
    sectionConfig: sectionConfig,

    // Section-specific data
    ...(sectionType === "personal-info" && { personalInfo: sectionData }),
    ...(sectionType === "professional-summary" && {
      professionalSummary: sectionData,
    }),
    ...(sectionType === "work-experience" && { experiences: sectionData }),
    ...(sectionType === "education" && { educations: sectionData }),
    ...(sectionType === "skills" && { skills: sectionData }),
    ...(sectionType === "languages" && { languages: sectionData }),
    ...(sectionType === "certifications" && { certifications: sectionData }),
    ...(sectionType === "awards" && { awards: sectionData }),
    ...(sectionType === "projects" && { projects: sectionData }),
    ...(sectionType === "interests" && { interests: sectionData }),
    ...(sectionType === "custom" && { customSections: sectionData }),

    // Common handler props
    ...(onUpdate && {
      onUpdate: onUpdate,
      onUpdatePersonalInfo:
        sectionType === "personal-info" ? onUpdate : undefined,
      onUpdateProfessionalSummary:
        sectionType === "professional-summary" ? onUpdate : undefined,
      onUpdateExperience:
        sectionType === "work-experience" ? onUpdate : undefined,
      onUpdateEducation: sectionType === "education" ? onUpdate : undefined,
      onUpdateSkill: sectionType === "skills" ? onUpdate : undefined,
      onUpdateLanguage: sectionType === "languages" ? onUpdate : undefined,
      onUpdateCertification:
        sectionType === "certifications" ? onUpdate : undefined,
      onUpdateAward: sectionType === "awards" ? onUpdate : undefined,
      onUpdateProject: sectionType === "projects" ? onUpdate : undefined,
      onUpdateInterest: sectionType === "interests" ? onUpdate : undefined,
      onUpdateCustomSection: sectionType === "custom" ? onUpdate : undefined,
    }),

    ...(onAdd && {
      onAdd: onAdd,
      onAddExperience: sectionType === "work-experience" ? onAdd : undefined,
      onAddEducation: sectionType === "education" ? onAdd : undefined,
      onAddSkill: sectionType === "skills" ? onAdd : undefined,
      onAddLanguage: sectionType === "languages" ? onAdd : undefined,
      onAddCertification: sectionType === "certifications" ? onAdd : undefined,
      onAddAward: sectionType === "awards" ? onAdd : undefined,
      onAddProject: sectionType === "projects" ? onAdd : undefined,
      onAddInterest: sectionType === "interests" ? onAdd : undefined,
      onAddCustomSection: sectionType === "custom" ? onAdd : undefined,
    }),

    ...(onRemove && {
      onRemove: onRemove,
      onRemoveExperience:
        sectionType === "work-experience" ? onRemove : undefined,
      onRemoveEducation: sectionType === "education" ? onRemove : undefined,
      onRemoveSkill: sectionType === "skills" ? onRemove : undefined,
      onRemoveLanguage: sectionType === "languages" ? onRemove : undefined,
      onRemoveCertification:
        sectionType === "certifications" ? onRemove : undefined,
      onRemoveAward: sectionType === "awards" ? onRemove : undefined,
      onRemoveProject: sectionType === "projects" ? onRemove : undefined,
      onRemoveInterest: sectionType === "interests" ? onRemove : undefined,
      onRemoveCustomSection: sectionType === "custom" ? onRemove : undefined,
    }),
  };

  try {
    return <SectionComponent {...sectionProps} />;
  } catch (error) {
    console.error(`Error rendering section ${sectionType}:`, error);
    return (
      <div className="p-4 border border-red-200 dark:border-red-700 rounded-[10px] bg-red-50 dark:bg-red-900/20">
        <div className="text-center text-red-600 dark:text-red-400">
          <p className="text-sm font-medium">Error rendering section</p>
          <p className="text-xs mt-1">
            Section "{sectionType}" encountered an error.
          </p>
        </div>
      </div>
    );
  }
}
