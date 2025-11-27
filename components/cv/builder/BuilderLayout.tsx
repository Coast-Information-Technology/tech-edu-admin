// components/cv/builder/BuilderLayout.tsx

"use client";

import { ReactNode, useState, useEffect, useCallback } from "react";
import { Layout } from "lucide-react"; // cleaned: removed Eye/List/PlusIcon/Type
import ResumeNav from "./ResumeNav";
import { TemplateLayout } from "@/types/cv/template";
import { templateManager } from "@/lib/cv/templates/templateManager";
import SimpleTemplateConfig from "./SimpleTemplateConfig";
import { SectionList } from "./SectionList";
import { SectionModal } from "./modals/SectionModal";
import { SectionContentRenderer } from "./SectionContentRenderer";
import { ResumeSection } from "@/types/cv";

interface BuilderLayoutProps {
  children: ReactNode;
  onTogglePreview: () => void;
  onExportPDF: () => void;
  onExportHTML2PDF?: () => void;
  onChangeTemplate: () => void;
  showPreview: boolean;
  isExporting: boolean;
  // Mode control
  mode?: "view" | "edit" | "create";
  // API functionality
  onSaveDraft?: (cvId?: string) => void;
  onLoadCV?: () => void;
  onPublishCV?: () => void;
  onCreateCV?: () => Promise<string | null>;
  onUpdateCV?: () => void;
  onPublishDraft?: () => void;
  onShowJobMatch?: () => void;
  isSaving?: boolean;
  isLoading?: boolean;
  loading?: boolean;
  error?: string | null;
  apiError?: string | null;
  onClearError?: () => void;
  cvId?: string;
  isCreating?: boolean;
  // Success feedback
  showSuccessMessage?: boolean;
  successMessage?: string;
  onClearSuccess?: () => void;
  // Preview
  previewData?: any;
  onPreviewClick?: () => void; // <— we’ll pass this to ResumeNav as onPreview
  // Modes
  builderMode: "content" | "customize";
  onToggleBuilderMode: () => void;
  sections?: any[];
  enabledSections?: string[];
  activeSection?: string;
  onSectionChange?: (sectionId: string) => void;
  // Template configuration
  selectedTemplate?: string;
  onTemplateConfigSave?: (template: any) => void;
  // Add/remove sections
  onAddSection?: () => void;
  onRemoveSection?: (sectionId: string) => void;
  // Section data + handlers
  personalInfo?: any;
  professionalSummary?: any;
  experiences?: any[];
  educations?: any[];
  skills?: any[];
  languages?: any[];
  certifications?: any[];
  awards?: any[];
  projects?: any[];
  interests?: any[];
  customSections?: any[];
  onUpdatePersonalInfo?: (updates: any) => void;
  onUpdateProfessionalSummary?: (updates: any) => void;
  onAddExperience?: () => void;
  onRemoveExperience?: (id: string) => void;
  onUpdateExperience?: (id: string, field: string, value: any) => void;
  onAddEducation?: () => void;
  onRemoveEducation?: (id: string) => void;
  onUpdateEducation?: (id: string, field: string, value: any) => void;
  onAddSkill?: () => void;
  onRemoveSkill?: (id: string) => void;
  onUpdateSkill?: (id: string, field: string, value: any) => void;
  onAddLanguage?: () => void;
  onRemoveLanguage?: (id: string) => void;
  onUpdateLanguage?: (id: string, field: string, value: any) => void;
  onAddCertification?: () => void;
  onRemoveCertification?: (id: string) => void;
  onUpdateCertification?: (id: string, field: string, value: any) => void;
  onAddAward?: () => void;
  onRemoveAward?: (id: string) => void;
  onUpdateAward?: (id: string, field: string, value: any) => void;
  onAddProject?: () => void;
  onRemoveProject?: (id: string) => void;
  onUpdateProject?: (id: string, field: string, value: any) => void;
  onAddInterest?: () => void;
  onRemoveInterest?: (id: string) => void;
  onUpdateInterest?: (id: string, field: string, value: any) => void;
  onImageUpload?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage?: () => void;
  onShowAIConsent?: () => void;
  aiConsent?: { aiProcessing: boolean; aiTraining: boolean } | null;
  onCheckExistingConsent?: (
    cvId: string
  ) => Promise<{ aiProcessing: boolean; aiTraining: boolean } | null>;
  onUpdateSection?: (
    sectionId: string,
    updates: Partial<ResumeSection>
  ) => void;
}

export default function BuilderLayout(props: BuilderLayoutProps) {
  const {
    onChangeTemplate,
    builderMode,
    onToggleBuilderMode,
    mode = "create",
    onCreateCV,
    onUpdateCV,
    onSaveDraft,
    onPublishDraft,
    onLoadCV,
    onPublishCV,
    onShowJobMatch,
    onExportPDF,
    onExportHTML2PDF,
    isSaving = false,
    isLoading = false,
    isExporting = false,
    isCreating = false,
    loading = false,
    error = null,
    apiError = null,
    onClearError,
    cvId,
    showSuccessMessage = false,
    successMessage = "",
    onClearSuccess,
    sections = [],
    onAddSection,
    onRemoveSection,
    selectedTemplate = "modern",
    onTemplateConfigSave,
    // modal props below
    onUpdateSection,
    personalInfo,
    professionalSummary,
    experiences = [],
    educations = [],
    skills = [],
    languages = [],
    certifications = [],
    awards = [],
    projects = [],
    interests = [],
    customSections = [],
    onUpdatePersonalInfo,
    onUpdateProfessionalSummary,
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
    onImageUpload,
    onRemoveImage,
    onShowAIConsent,
    aiConsent,
    onCheckExistingConsent,
    onPreviewClick, // <— preview handler from parent
  } = props;

  const [template, setTemplate] = useState<TemplateLayout | null>(null);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<ResumeSection | null>(
    null
  );

  useEffect(() => {
    if (selectedTemplate) {
      const templateData = templateManager.getTemplate(selectedTemplate);
      if (templateData) setTemplate(templateData);
    }
  }, [selectedTemplate]);

  const handleSaveTemplate = useCallback(
    (updatedTemplate: TemplateLayout) => {
      setTemplate(updatedTemplate);
      onTemplateConfigSave?.(updatedTemplate);
    },
    [onTemplateConfigSave]
  );

  const handleResetTemplate = useCallback(() => {
    if (!selectedTemplate) return;
    const defaultTemplate = templateManager.getTemplate(selectedTemplate);
    if (defaultTemplate) setTemplate(defaultTemplate);
  }, [selectedTemplate]);

  useEffect(() => {
    if (selectedSection && sections.length > 0) {
      const updatedSection = sections.find((s) => s.id === selectedSection.id);
      if (updatedSection) setSelectedSection(updatedSection);
    }
  }, [sections, selectedSection]);

  const handleSectionClick = useCallback((section: ResumeSection) => {
    setSelectedSection(section);
    setIsSectionModalOpen(true);
  }, []);

  const handleCloseSectionModal = useCallback(() => {
    setIsSectionModalOpen(false);
    setSelectedSection(null);
  }, []);

  const handleSaveSection = useCallback(
    async (section: ResumeSection) => {
      try {
        if (section.type === "personal-info") {
          if (onCreateCV) {
            const newCvId = await onCreateCV();
            if (onSaveDraft && newCvId) await onSaveDraft(newCvId);
          }
        } else {
          // In view/edit mode, save both draft and main CV
          if (mode === "view" || mode === "edit") {
            if (onSaveDraft) await onSaveDraft();
            if (onUpdateCV) await onUpdateCV();
          } else {
            // In create mode, only save draft
            if (onSaveDraft) await onSaveDraft();
          }
        }
        handleCloseSectionModal();
      } catch (e) {
        console.error("Save section failed:", e);
        handleCloseSectionModal();
      }
    },
    [handleCloseSectionModal, onSaveDraft, onCreateCV, onUpdateCV, mode]
  );

  return (
    <div className="h-full bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-900 dark:to-gray-800">
      <ResumeNav
        onChangeTemplate={onChangeTemplate}
        builderMode={builderMode}
        onToggleBuilderMode={onToggleBuilderMode}
        onCreateCV={onCreateCV}
        onUpdateCV={onUpdateCV}
        // Hide Save Draft and Publish buttons when in view/edit mode
        onSaveDraft={mode === "create" ? onSaveDraft : undefined}
        onPublishDraft={mode === "create" ? onPublishDraft : undefined}
        onLoadCV={onLoadCV}
        onPublishCV={mode === "create" ? onPublishCV : undefined}
        onShowJobMatch={onShowJobMatch}
        onExportPDF={onExportPDF}
        onExportHTML2PDF={onExportHTML2PDF}
        isSaving={isSaving}
        isLoading={isLoading}
        isExporting={isExporting}
        isCreating={isCreating}
        loading={loading}
        cvId={cvId}
        error={error}
        // NEW: Preview button in the nav bar
        onPreview={onPreviewClick}
      />

      {/* Success toast */}
      {showSuccessMessage && onClearSuccess && (
        <div className="fixed top-20 right-4 z-50 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-300 px-6 py-4 rounded-[12px] shadow-lg max-w-md animate-slide-in-right">
          {/* ...unchanged content... */}
          <div className="flex justify-between items-start">
            {/* content omitted for brevity */}
            <button
              onClick={onClearSuccess}
              className="ml-4 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 transition-colors duration-200"
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Error toast */}
      {(apiError || error) && onClearError && (
        <div className="fixed top-20 right-4 z-50 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-6 py-4 rounded-[12px] shadow-lg max-w-md animate-slide-in-right">
          {/* ...unchanged content... */}
          <div className="flex justify-between items-start">
            {/* content omitted for brevity */}
            <button
              onClick={onClearError}
              className="ml-4 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition-colors duration-200"
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* MAIN: single column (preview removed) */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-6">
          <div className="overflow-y-auto relative">
            {builderMode === "content" ? (
              <div className="bg-white dark:bg-gray-800 rounded-[10px] shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Resume Sections
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Click on any section to edit its content
                  </p>
                </div>
                <SectionList
                  sections={sections}
                  onSectionClick={handleSectionClick}
                  onAddSection={onAddSection || (() => {})}
                  onRemoveSection={onRemoveSection}
                />
              </div>
            ) : (
              <div className="bg-white rounded-[10px] shadow-sm border border-gray-200">
                {template ? (
                  <SimpleTemplateConfig
                    key={template.id}
                    template={template}
                    onSave={handleSaveTemplate}
                    onReset={handleResetTemplate}
                  />
                ) : (
                  <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Layout className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No Template Selected
                    </h3>
                    <p className="text-sm text-gray-600">
                      Select a template to start customizing
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Section Modal */}
            <SectionModal
              isOpen={isSectionModalOpen}
              onClose={handleCloseSectionModal}
              section={selectedSection}
              onSave={handleSaveSection}
              onUpdateSection={onUpdateSection}
            >
              {selectedSection && (
                <SectionContentRenderer
                  section={selectedSection}
                  onUpdate={(updates) => {
                    switch (selectedSection.type) {
                      case "personal-info":
                        onUpdatePersonalInfo?.(updates);
                        break;
                      case "professional-summary":
                        onUpdateProfessionalSummary?.(updates);
                        break;
                      default:
                        // passthrough for custom handling
                        break;
                    }
                  }}
                  onShowAIConsent={onShowAIConsent}
                  aiConsent={aiConsent}
                  cvId={cvId}
                  onCheckExistingConsent={onCheckExistingConsent}
                  personalInfo={personalInfo}
                  professionalSummary={professionalSummary}
                  experiences={experiences}
                  educations={educations}
                  // Use the selected section's live data when editing skills/languages
                  skills={
                    selectedSection.type === "skills"
                      ? (selectedSection.data as any[]) || []
                      : skills
                  }
                  languages={
                    selectedSection.type === "languages"
                      ? (selectedSection.data as any[]) || []
                      : languages
                  }
                  certifications={certifications}
                  awards={awards}
                  projects={projects}
                  interests={interests}
                  customSections={customSections}
                  onAddExperience={onAddExperience}
                  onRemoveExperience={onRemoveExperience}
                  onUpdateExperience={onUpdateExperience}
                  onAddEducation={onAddEducation}
                  onRemoveEducation={onRemoveEducation}
                  onUpdateEducation={onUpdateEducation}
                  onAddSkill={onAddSkill}
                  onRemoveSkill={onRemoveSkill}
                  onUpdateSkill={onUpdateSkill}
                  onAddLanguage={onAddLanguage}
                  onRemoveLanguage={onRemoveLanguage}
                  onUpdateLanguage={onUpdateLanguage}
                  onAddCertification={onAddCertification}
                  onRemoveCertification={onRemoveCertification}
                  onUpdateCertification={onUpdateCertification}
                  onAddAward={onAddAward}
                  onRemoveAward={onRemoveAward}
                  onUpdateAward={onUpdateAward}
                  onAddProject={onAddProject}
                  onRemoveProject={onRemoveProject}
                  onUpdateProject={onUpdateProject}
                  onAddInterest={onAddInterest}
                  onRemoveInterest={onRemoveInterest}
                  onUpdateInterest={onUpdateInterest}
                  onImageUpload={onImageUpload}
                  onRemoveImage={onRemoveImage}
                  onUpdateSection={onUpdateSection}
                />
              )}
            </SectionModal>
          </div>
        </div>
      </div>
    </div>
  );
}
