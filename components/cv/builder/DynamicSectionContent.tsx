"use client";

import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  Edit3,
  Save,
  X,
  Trash2,
  Plus as PlusIcon,
} from "lucide-react";
import DynamicSectionRenderer from "./DynamicSectionRenderer";
import {
  getAllSections,
  getSectionDisplayName,
  getSectionIcon,
  getSectionDescription,
} from "@/lib/cv/sections/sectionRegistry";
import "@/lib/cv/sections/initializeSections"; // Initialize section registry
import { TemplateLayout } from "@/types/cv/template";

interface DynamicSectionContentProps {
  activeSection: string;
  templateConfig?: TemplateLayout | null;
  onUpdateTemplateConfig?: (updates: Partial<TemplateLayout>) => void;
  onRemoveSection?: (sectionType: string) => void;
  onAddSection?: () => void;
  onShowAIConsent?: () => void;
  // All the data props
  personalInfo: any;
  professionalSummary: any;
  experiences: any[];
  educations: any[];
  skills: any[];
  languages: any[];
  certifications: any[];
  awards: any[];
  projects: any[];
  interests: any[];
  customSections: any[];
  // All the handler props
  onUpdatePersonalInfo: (updates: any) => void;
  onUpdateProfessionalSummary: (updates: any) => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  onAddExperience: () => void;
  onRemoveExperience: (id: string) => void;
  onUpdateExperience: (id: string, field: any, value: any) => void;
  onAddEducation: () => void;
  onRemoveEducation: (id: string) => void;
  onUpdateEducation: (id: string, field: any, value: any) => void;
  onAddSkill: () => void;
  onRemoveSkill: (id: string) => void;
  onUpdateSkill: (id: string, field: any, value: any) => void;
  onAddLanguage: () => void;
  onRemoveLanguage: (id: string) => void;
  onUpdateLanguage: (id: string, field: any, value: any) => void;
  onAddCertification: () => void;
  onRemoveCertification: (id: string) => void;
  onUpdateCertification: (id: string, field: any, value: any) => void;
  onAddAward: () => void;
  onRemoveAward: (id: string) => void;
  onUpdateAward: (id: string, field: any, value: any) => void;
  onAddProject: () => void;
  onRemoveProject: (id: string) => void;
  onUpdateProject: (id: string, field: any, value: any) => void;
  onAddInterest: () => void;
  onRemoveInterest: (id: string) => void;
  onUpdateInterest: (id: string, field: any, value: any) => void;
  onAddCustomSection: () => void;
  onRemoveCustomSection: (id: string) => void;
  onUpdateCustomSection: (id: string, field: any, value: any) => void;
}

export default function DynamicSectionContent({
  activeSection,
  templateConfig,
  onUpdateTemplateConfig,
  onRemoveSection,
  onAddSection,
  onShowAIConsent,
  personalInfo,
  professionalSummary,
  experiences,
  educations,
  skills,
  languages,
  certifications,
  awards,
  projects,
  interests,
  customSections,
  onUpdatePersonalInfo,
  onUpdateProfessionalSummary,
  onImageUpload,
  onRemoveImage,
  onAddExperience,
  onRemoveExperience,
  onUpdateExperience,
  onAddEducation,
  onRemoveEducation,
  onUpdateEducation,
  onAddSkill,
  onRemoveSkill,
  onUpdateSkill,
  onAddLanguage,
  onRemoveLanguage,
  onUpdateLanguage,
  onAddCertification,
  onRemoveCertification,
  onUpdateCertification,
  onAddAward,
  onRemoveAward,
  onUpdateAward,
  onAddProject,
  onRemoveProject,
  onUpdateProject,
  onAddInterest,
  onRemoveInterest,
  onUpdateInterest,
  onAddCustomSection,
  onRemoveCustomSection,
  onUpdateCustomSection,
}: DynamicSectionContentProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([
    activeSection,
  ]);
  const [availableSections, setAvailableSections] = useState<string[]>([]);
  const [editingHeading, setEditingHeading] = useState<string | null>(null);
  const [editedHeadingText, setEditedHeadingText] = useState("");

  // Get available sections based on template configuration
  useEffect(() => {
    if (templateConfig) {
      // Get sections enabled in the template
      const enabledSections = new Set<string>();
      templateConfig.columns.forEach((column) => {
        column.sections.forEach((sectionType) => {
          enabledSections.add(sectionType);
        });
      });

      // Define the default order for sections - only show first 5 essential sections initially
      const defaultOrder = [
        "personal-info",
        "education",
        "work-experience",
        "skills",
        "professional-summary",
      ];

      // Additional sections that can be added later
      const additionalSections = [
        "languages",
        "certifications",
        "awards",
        "projects",
        "interests",
        "custom",
      ];

      // Sort sections according to default order
      const sortedSections = Array.from(enabledSections).sort((a, b) => {
        const indexA = defaultOrder.indexOf(a);
        const indexB = defaultOrder.indexOf(b);
        const additionalIndexA = additionalSections.indexOf(a);
        const additionalIndexB = additionalSections.indexOf(b);

        // If both sections are in the essential sections, sort by their position
        if (indexA !== -1 && indexB !== -1) {
          return indexA - indexB;
        }

        // If both sections are in additional sections, sort by their position
        if (additionalIndexA !== -1 && additionalIndexB !== -1) {
          return additionalIndexA - additionalIndexB;
        }

        // Essential sections come first
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;

        // Additional sections come after essential sections
        if (additionalIndexA !== -1) return -1;
        if (additionalIndexB !== -1) return 1;

        // If neither section is in any order, maintain original order
        return 0;
      });

      setAvailableSections(sortedSections);
    } else {
      // Fallback to all registered sections
      const allSections = Object.keys(getAllSections());
      setAvailableSections(allSections);
    }
  }, [templateConfig]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(
      (prev) =>
        prev.includes(sectionId)
          ? [] // Close all sections if clicking the currently open one
          : [sectionId] // Open only the clicked section
    );
  };

  // Handle section heading editing
  const handleStartEditHeading = (sectionType: string) => {
    const currentHeading = getSectionHeading(sectionType);
    setEditingHeading(sectionType);
    setEditedHeadingText(currentHeading ?? "");
  };

  const handleSaveHeading = () => {
    if (editingHeading && editedHeadingText.trim() && onUpdateTemplateConfig) {
      const newHeadings = {
        ...templateConfig?.sectionHeadings,
        [editingHeading]: editedHeadingText.trim(),
      };
      onUpdateTemplateConfig({ sectionHeadings: newHeadings });
      setEditingHeading(null);
      setEditedHeadingText("");
    }
  };

  const handleCancelEditHeading = () => {
    setEditingHeading(null);
    setEditedHeadingText("");
  };

  const handleRemoveSection = (sectionType: string) => {
    if (onRemoveSection) {
      onRemoveSection(sectionType);
    }
  };

  // Get section data based on section type
  // Get section heading (custom or default)
  const getSectionHeading = (sectionType: string) => {
    if (
      templateConfig?.sectionHeadings?.[
        sectionType as keyof typeof templateConfig.sectionHeadings
      ]
    ) {
      return templateConfig.sectionHeadings[
        sectionType as keyof typeof templateConfig.sectionHeadings
      ];
    }
    return getSectionDisplayName(sectionType);
  };

  const getSectionData = (sectionType: string) => {
    const dataMap: Record<string, any> = {
      "personal-info": personalInfo,
      "professional-summary": professionalSummary,
      "work-experience": experiences,
      education: educations,
      skills: skills,
      languages: languages,
      certifications: certifications,
      awards: awards,
      projects: projects,
      interests: interests,
      custom: customSections,
    };
    return dataMap[sectionType] || null;
  };

  // Get section handlers based on section type
  const getSectionHandlers = (sectionType: string) => {
    const handlersMap: Record<string, any> = {
      "personal-info": {
        onUpdate: onUpdatePersonalInfo,
        onImageUpload,
        onRemoveImage,
      },
      "professional-summary": {
        onUpdate: onUpdateProfessionalSummary,
      },
      "work-experience": {
        personalInfo: personalInfo,
        onUpdate: onUpdateExperience,
        onAdd: onAddExperience,
        onRemove: onRemoveExperience,
      },
      education: {
        onUpdate: onUpdateEducation,
        onAdd: onAddEducation,
        onRemove: onRemoveEducation,
      },
      skills: {
        onUpdate: onUpdateSkill,
        onAdd: onAddSkill,
        onRemove: onRemoveSkill,
      },
      languages: {
        onUpdate: onUpdateLanguage,
        onAdd: onAddLanguage,
        onRemove: onRemoveLanguage,
      },
      certifications: {
        onUpdate: onUpdateCertification,
        onAdd: onAddCertification,
        onRemove: onRemoveCertification,
      },
      awards: {
        onUpdate: onUpdateAward,
        onAdd: onAddAward,
        onRemove: onRemoveAward,
      },
      projects: {
        onUpdate: onUpdateProject,
        onAdd: onAddProject,
        onRemove: onRemoveProject,
      },
      interests: {
        onUpdate: onUpdateInterest,
        onAdd: onAddInterest,
        onRemove: onRemoveInterest,
      },
      custom: {
        onUpdate: onUpdateCustomSection,
        onAdd: onAddCustomSection,
        onRemove: onRemoveCustomSection,
      },
    };
    return handlersMap[sectionType] || {};
  };

  return (
    <div className="space-y-2">
      {availableSections.map((sectionType) => {
        const isExpanded = expandedSections.includes(sectionType);
        const isActive = activeSection === sectionType;
        const displayName = getSectionHeading(sectionType);
        const icon = getSectionIcon(sectionType);
        const description = getSectionDescription(sectionType);
        const isEditing = editingHeading === sectionType;
        const hasCustomHeading =
          templateConfig?.sectionHeadings?.[
            sectionType as keyof typeof templateConfig.sectionHeadings
          ];

        return (
          <div
            key={sectionType}
            className={`border rounded-[10px] overflow-hidden transition-all duration-200 ${
              isActive
                ? "border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            }`}
          >
            <div className="flex items-center">
              <button
                onClick={() => toggleSection(sectionType)}
                className={`flex-1 px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${
                  isActive ? "bg-blue-50 dark:bg-blue-900/20" : ""
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{icon}</span>
                  <div className="text-left flex-1">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedHeadingText}
                        onChange={(e) => setEditedHeadingText(e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveHeading();
                          if (e.key === "Escape") handleCancelEditHeading();
                        }}
                      />
                    ) : (
                      <div>
                        <span
                          className={`font-medium ${
                            hasCustomHeading
                              ? "text-blue-600 dark:text-blue-400"
                              : isActive
                              ? "text-blue-900 dark:text-blue-100"
                              : "text-gray-900 dark:text-gray-100"
                          }`}
                        >
                          {displayName}
                        </span>
                        {description && (
                          <p
                            className={`text-xs mt-0.5 ${
                              isActive
                                ? "text-blue-700 dark:text-blue-200"
                                : "text-gray-500 dark:text-gray-400"
                            }`}
                          >
                            {description}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                )}
              </button>

              {/* Section Action Buttons */}
              <div className="flex items-center space-x-1 pr-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSaveHeading}
                      className="p-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md transition-colors"
                      title="Save heading"
                    >
                      <Save className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleCancelEditHeading}
                      className="p-1.5 text-gray-600 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                      title="Cancel editing"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleStartEditHeading(sectionType)}
                      className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                      title="Edit heading"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    {sectionType !== "personal-info" && ( // Don't allow removing personal info
                      <button
                        onClick={() => handleRemoveSection(sectionType)}
                        className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                        title="Remove section"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            {isExpanded && (
              <div className="border-t border-gray-200 dark:border-gray-700">
                <div className="p-4">
                  <DynamicSectionRenderer
                    sectionType={sectionType}
                    sectionData={getSectionData(sectionType)}
                    sectionConfig={templateConfig}
                    onShowAIConsent={onShowAIConsent}
                    {...getSectionHandlers(sectionType)}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Add Section Button */}
      {onAddSection && (
        <div className="mt-4">
          <button
            onClick={onAddSection}
            className="w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-[10px] text-gray-600 dark:text-gray-400 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add New Section</span>
          </button>
        </div>
      )}
    </div>
  );
}
