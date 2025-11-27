// components/cv/builder/CVBuilderMain.tsx

"use client";

import React, { useEffect, useMemo, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Award,
  Languages,
  BookOpen,
  Heart,
  BookOpenCheck,
  Users,
  UserCheck,
  FileText,
  X,
} from "lucide-react";
import ErrorBoundary from "@/components/ErrorBoundary";
import BuilderLayout from "./BuilderLayout";
import ModeSelector from "./ModeSelector";
import { StatusBar } from "./StatusBar";
import MemoizedTemplateRenderer from "./MemoizedTemplateRenderer";
import MemoizedDynamicSectionContent from "./MemoizedDynamicSectionContent";
import TemplateSelectorModal from "@/components/cv/TemplateSelectorModal";
import AIConsentModal from "./modals/AIConsentModal";
import LoadCVModal from "@/components/cv/builder/modals/LoadCVModal";
import CVUploadModal from "@/components/cv/builder/modals/CVUploadModal";
import AddSectionModal from "@/components/cv/builder/modals/AddSectionModal";
import SimplePreviewModal from "@/components/cv/builder/modals/SimplePreviewModal";
import JobMatchScore from "./JobMatchScore";
import { useCVBuilder } from "@/hooks/cv/useCVBuilder";
import { CVBuilderProps } from "@/types/cv/cv-builder";
import { ResumeSection } from "@/types/cv";
import {
  useOnboardingTour,
  CVBuilderTourSteps,
} from "@/hooks/useOnboardingTour";
import { useCVAnalytics } from "@/hooks/cv/useCVAnalytics";
import { useCVVersions } from "@/hooks/cv/useCVVersions";
import { useCVSharing } from "@/hooks/cv/useCVSharing";
import { useJobBoardIntegration } from "@/hooks/useJobBoardIntegration";
import OnboardingTour from "@/components/OnboardingTour";
import AnalyticsDashboard from "./AnalyticsDashboard";
import VersionManager from "./VersionManager";
import SharingPanel from "./SharingPanel";
import JobBoardIntegration from "./JobBoardIntegration";
import { SectionArrangement } from "./SectionArrangement";

export default function CVBuilderMain({
  initialState,
  autoSaveConfig,
  onStateChange,
  onSave,
  onLoad,
  onExport,
}: CVBuilderProps) {
  const router = useRouter();

  // AI Consent Modal state
  const [showAIConsentModal, setShowAIConsentModal] = useState(false);

  const handleConsentAccept = (consent: {
    aiProcessing: boolean;
    aiTraining: boolean;
  }) => {
    // TODO: Save consent to secure draft API instead of localStorage
    // This will be implemented with the useSecureDraft hook
    console.log("AI consent would be saved to secure draft:", consent);
    setShowAIConsentModal(false);
    console.log("Consent accepted:", consent);
  };

  const {
    state,
    updateState,
    sectionManager,
    validation,
    history,
    autoSave,
    cvApi,
    // aiFeatures,
    sections,
    handleModeSelect,
    handleTemplateSelect,
    handleExportPDF: originalHandleExportPDF,
    handleImageUpload,
    removeImage,
    toggleSection,
    navigateToSection,
  } = useCVBuilder({
    initialState,
    autoSaveConfig,
    onStateChange,
  });

  // Create a wrapper function that calls the onExport prop
  const handleExportPDF = useCallback(async () => {
    if (onExport) {
      await onExport(state);
    } else {
      // Fallback to the original function if no onExport prop is provided
      await originalHandleExportPDF();
    }
  }, [onExport, state, originalHandleExportPDF]);

  // Section arrangement state - initialize with available sections
  const [leftColumnSections, setLeftColumnSections] = React.useState<string[]>(
    []
  );

  // Initialize left column sections based on available data
  React.useEffect(() => {
    if (state.resumeData.length > 0 && leftColumnSections.length === 0) {
      const availableSections = state.resumeData
        .filter((section) => section.type !== "personal-info")
        .map((section) => section.type);

      // Default left column sections that exist in the data
      const defaultLeftSections = availableSections.filter((type) =>
        ["skills", "languages", "certifications", "awards"].includes(type)
      );

      setLeftColumnSections(defaultLeftSections);
      console.log("Left column sections initialized:", defaultLeftSections);
    }
  }, [state.resumeData, leftColumnSections.length]);

  // Set default section order for resume data
  React.useEffect(() => {
    if (state.resumeData.length > 0) {
      const defaultOrder = [
        "personal-info",
        "education",
        "work-experience",
        "skills",
        "professional-summary",
        "languages",
        "certifications",
        "awards",
      ];

      // Reorder sections according to default order
      const orderedSections = defaultOrder
        .map((type) =>
          state.resumeData.find((section) => section.type === type)
        )
        .filter(Boolean) as (typeof state.resumeData)[0][];

      // Add any remaining sections that aren't in the default order
      const remainingSections = state.resumeData.filter(
        (section) => !defaultOrder.includes(section.type)
      );

      const finalOrder = [...orderedSections, ...remainingSections];

      // Only update if the order is actually different
      const isOrderDifferent = finalOrder.some(
        (section, index) => section.id !== state.resumeData[index]?.id
      );

      if (isOrderDifferent) {
        updateState({ resumeData: finalOrder });
      }
    }
  }, [state.resumeData.length]); // Only run when sections are added/removed

  const handleSectionReorder = (reorderedSections: any[]) => {
    // Update the resumeData with the new order
    updateState({ resumeData: reorderedSections });
  };

  const handleLeftColumnChange = (sections: string[]) => {
    setLeftColumnSections(sections);
  };

  // CVBuilderMain.tsx
  // CVBuilderMain.tsx

  const handleUpdateSection = useCallback(
    (sectionId: string, updates: Partial<ResumeSection>) => {
      const next = state.resumeData.map((s) => {
        if (s.id !== sectionId) return s;

        let newData = s.data;

        if ("data" in updates) {
          const incoming = updates.data as any;

          if (Array.isArray(incoming)) {
            // ✅ replace arrays outright (skills, languages, etc.)
            newData = incoming;
          } else if (Array.isArray(s.data)) {
            // ✅ if existing is array but incoming isn't, also replace
            newData = incoming as any;
          } else {
            // ✅ shallow-merge for object-shaped sections
            newData = { ...(s.data as any), ...(incoming as any) };
          }
        }

        return { ...s, ...updates, data: newData } as ResumeSection;
      });

      updateState({ resumeData: next });
    },
    [state.resumeData, updateState]
  );

  // Load dummy data handler
  const handleLoadDummyData = () => {
    const dummyData = generateDummyData();
    updateState({
      personalInfo: dummyData.personalInfo,
      professionalSummary: dummyData.professionalSummary,
      experiences: dummyData.experiences,
      educations: dummyData.educations,
      skills: dummyData.skills,
      languages: dummyData.languages,
      certifications: dummyData.certifications,
      awards: dummyData.awards,
      projects: dummyData.projects,
      interests: dummyData.interests,
      resumeData: [
        {
          id: "personal-info",
          type: "personal-info",
          data: dummyData.personalInfo,
          heading: "Personal Information",
          visible: true,
        },
        {
          id: "education",
          type: "education",
          data: dummyData.educations,
          heading: "Education",
          visible: true,
        },
        {
          id: "work-experience",
          type: "work-experience",
          data: dummyData.experiences,
          heading: "Work Experience",
          visible: true,
        },
        {
          id: "skills",
          type: "skills",
          data: dummyData.skills,
          heading: "Skills",
          visible: true,
        },
        {
          id: "professional-summary",
          type: "professional-summary",
          data: dummyData.professionalSummary,
          heading: "Professional Summary",
          visible: true,
        },
        {
          id: "languages",
          type: "languages",
          data: dummyData.languages,
          heading: "Languages",
          visible: true,
        },
        {
          id: "certifications",
          type: "certifications",
          data: dummyData.certifications,
          heading: "Certifications",
          visible: true,
        },
        {
          id: "awards",
          type: "awards",
          data: dummyData.awards,
          heading: "Awards",
          visible: true,
        },
        {
          id: "projects",
          type: "projects",
          data: dummyData.projects,
          heading: "Projects",
          visible: true,
        },
        {
          id: "interests",
          type: "interests",
          data: dummyData.interests,
          heading: "Interests",
          visible: true,
        },
      ],
    });
  };

  // Generate dummy data for template previews
  const generateDummyData = () => {
    return {
      personalInfo: {
        id: "personal-info",
        firstName: "John",
        lastName: "Doe",
        targetedJobTitle: "Senior Software Engineer",
        email: "john.doe@email.com",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
        linkedin: "linkedin.com/in/johndoe",
        github: "github.com/johndoe",
        website: "johndoe.dev",
        image:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      },
      professionalSummary: {
        id: "professional-summary",
        summary:
          "Experienced software developer with 5+ years of expertise in building scalable web applications using React, Node.js, and cloud technologies. Passionate about creating user-friendly solutions and leading cross-functional teams to deliver high-quality products.",
      },
      experiences: [
        {
          id: "exp-1",
          position: "Senior Software Engineer",
          company: "TechCorp Inc.",
          startDate: "2021-01",
          endDate: "2024-01",
          location: "San Francisco, CA",
          description:
            "<ul><li>Led development of microservices architecture serving 1M+ users</li><li>Mentored 3 junior developers and improved team productivity by 40%</li><li>Implemented CI/CD pipelines reducing deployment time by 60%</li><li>Collaborated with product team to define technical requirements</li></ul>",
        },
        {
          id: "exp-2",
          position: "Full Stack Developer",
          company: "StartupXYZ",
          startDate: "2019-06",
          endDate: "2020-12",
          location: "Remote",
          description:
            "<ul><li>Built responsive web applications using React and Node.js</li><li>Integrated third-party APIs and payment processing systems</li><li>Optimized database queries improving performance by 50%</li><li>Participated in agile development process and code reviews</li></ul>",
        },
      ],
      educations: [
        {
          id: "edu-1",
          degree: "Bachelor of Science in Computer Science",
          institution: "University of California, Berkeley",
          field: "Computer Science",
          startDate: "2015-09",
          endDate: "2019-05",
          location: "Berkeley, CA",
          gpa: "3.8/4.0",
        },
      ],
      skills: [
        {
          id: "skill-1",
          name: "JavaScript",
          level: "Expert" as const,
        },
        { id: "skill-2", name: "React", level: "Advanced" as const },
        { id: "skill-3", name: "Node.js", level: "Advanced" as const },
        {
          id: "skill-4",
          name: "TypeScript",
          level: "Expert" as const,
        },
        { id: "skill-5", name: "AWS", level: "Intermediate" as const },
        { id: "skill-6", name: "Docker", level: "Intermediate" as const },
        { id: "skill-7", name: "MongoDB", level: "Advanced" as const },
        { id: "skill-8", name: "Git", level: "Expert" as const },
      ],
      languages: [
        {
          id: "lang-1",
          name: "English",
          level: "Native" as const,
        },
        {
          id: "lang-2",
          name: "Spanish",
          level: "Professional" as const,
        },
        {
          id: "lang-3",
          name: "French",
          level: "Conversational" as const,
        },
      ],
      certifications: [
        {
          id: "cert-1",
          name: "AWS Certified Solutions Architect",
          issuer: "Amazon Web Services",
          date: "2023-06",
          credentialId: "AWS-SAA-123456",
        },
        {
          id: "cert-2",
          name: "Google Cloud Professional Developer",
          issuer: "Google Cloud",
          date: "2023-03",
          credentialId: "GCP-PD-789012",
        },
      ],
      awards: [
        {
          id: "award-1",
          title: "Employee of the Year",
          issuer: "TechCorp Inc.",
          date: "2023-12",
          description:
            "Recognized for outstanding contribution to the microservices architecture project",
        },
        {
          id: "award-2",
          title: "Best Innovation Award",
          issuer: "Tech Conference 2023",
          date: "2023-09",
          description: "Awarded for innovative CI/CD pipeline implementation",
        },
      ],
      projects: [
        {
          id: "proj-1",
          name: "E-commerce Platform",
          description:
            "Built a full-stack e-commerce platform using React, Node.js, and MongoDB. Features include user authentication, payment processing, and inventory management.",
          technologies: ["React", "Node.js", "MongoDB", "Stripe API"],
          url: "https://ecommerce-demo.com",
          githubUrl: "https://github.com/johndoe/ecommerce-platform",
        },
        {
          id: "proj-2",
          name: "Task Management App",
          description:
            "Developed a collaborative task management application with real-time updates and team collaboration features.",
          technologies: ["React", "Socket.io", "Express", "PostgreSQL"],
          url: "https://taskmanager-demo.com",
          githubUrl: "https://github.com/johndoe/task-manager",
        },
      ],
      interests: [
        {
          id: "int-1",
          name: "Machine Learning",
          description: "Exploring AI and ML applications in web development",
        },
        {
          id: "int-2",
          name: "Open Source",
          description: "Contributing to various open source projects",
        },
        {
          id: "int-3",
          name: "Photography",
          description: "Digital photography and photo editing",
        },
      ],
    };
  };

  // Load saved state on component mount (optional override)
  useEffect(() => {
    const loadSavedState = async () => {
      if (onLoad) {
        try {
          const savedState = await onLoad("current");
          if (savedState && Object.keys(savedState).length > 0) {
            // Only update if we have actual saved data to override the default
            updateState(savedState);
          }
        } catch (error) {
          console.error("Failed to load saved state:", error);
        }
      }
    };

    loadSavedState();
  }, [onLoad, updateState]);

  // Initialize additional features
  const tour = useOnboardingTour({
    steps: CVBuilderTourSteps,
    onComplete: () => console.log("Tour completed"),
    onSkip: () => console.log("Tour skipped"),
    autoStart: true,
  });

  const analytics = useCVAnalytics({ state });

  const versions = useCVVersions({
    initialState: state,
    onVersionChange: (version) => {
      updateState(version.state);
    },
  });

  const sharing = useCVSharing({
    cvId: "current", // Use a default ID since cvId might not exist in state
    onShareCreated: (share) => console.log("Share created:", share),
  });

  const jobBoardIntegration = useJobBoardIntegration({
    cvState: state,
    onApplicationSubmitted: (application) =>
      console.log("Application submitted:", application),
  });

  // Initialize template configuration when template changes
  useEffect(() => {
    if (state.selectedTemplate) {
      import("@/lib/cv/templates/templateManager").then(
        ({ templateManager }) => {
          const template = templateManager.getTemplate(state.selectedTemplate);
          updateState({ templateConfig: template });
        }
      );
    }
  }, [state.selectedTemplate, updateState]);

  // Generate preview data using live template configuration
  const previewData = useMemo(() => {
    const templateId = state.templateConfig?.id || state.selectedTemplate;
    return (
      <MemoizedTemplateRenderer
        data={state.resumeData}
        templateId={templateId}
        mode="preview"
        templateConfig={state.templateConfig}
        leftColumnSections={leftColumnSections}
        dependencies={[
          state.resumeData,
          state.templateConfig,
          leftColumnSections,
        ]}
      />
    );
  }, [
    state.resumeData,
    state.selectedTemplate,
    state.templateConfig,
    leftColumnSections,
  ]);

  // CV Upload success handler
  const handleCVUploadSuccess = async (uploadResult: any) => {
    try {
      updateState({ showCVUpload: false });

      // Process the uploaded CV
      const { processCVUpload } = await import(
        "@/lib/cv/services/cvUploadWorkflow"
      );
      const workflowResult = await processCVUpload(uploadResult.file, {
        userId: "anonymous",
        autoCreateCV: true,
        template: "two-column",
      });

      if (workflowResult.error) {
        alert(`CV processing failed: ${workflowResult.error}`);
        return;
      }

      // Populate the builder with parsed data
      const { parsedData } = workflowResult;

      updateState({
        personalInfo: parsedData.personalInfo,
        professionalSummary: parsedData.professionalSummary || {
          id: "professional-summary",
          summary: "",
        },
        experiences: parsedData.experiences,
        educations: parsedData.educations,
        skills: parsedData.skills,
        languages: parsedData.languages,
        certifications: parsedData.certifications,
        awards: parsedData.awards,
        projects: parsedData.projects,
        interests: parsedData.interests,
      });

      alert(
        `CV uploaded and parsed successfully! Confidence: ${Math.round(
          parsedData.confidence * 100
        )}%`
      );

      updateState({ showTemplateSelector: true });
    } catch (error) {
      console.error("CV upload success handler failed:", error);
      alert("Failed to process uploaded CV. Please try again.");
    }
  };

  // Show mode selector if no mode selected yet
  if (!state.selectedMode) {
    return (
      <ErrorBoundary>
        <ModeSelector onModeSelect={handleModeSelect} />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <BuilderLayout
          onTogglePreview={() =>
            updateState({ showPreview: !state.showPreview })
          }
          onExportPDF={handleExportPDF}
          onChangeTemplate={() => updateState({ showTemplateSelector: true })}
          showPreview={state.showPreview}
          isExporting={state.isExporting}
          onSaveDraft={async (providedCvId?: string) => {
            console.log(
              "🔧 onSaveDraft called in CVBuilderMain with cvId:",
              providedCvId
            );
            // Get current data from state
            const personalInfo = state.personalInfo;
            const sections = state.resumeData;

            console.log("📊 Current state:", {
              hasPersonalInfo: !!personalInfo,
              sectionsCount: sections.length,
              cvId: cvApi.cvId,
              draftId: cvApi.draftId,
              providedCvId,
            });

            try {
              // Save draft only (no CV update for manual save)
              console.log("💾 Saving draft...");
              await cvApi.saveDraft(personalInfo, sections, providedCvId);
              console.log("✅ Draft saved successfully");
            } catch (error) {
              console.error("❌ Error saving draft:", error);
              throw error; // Re-throw to handle in the calling component
            }
          }}
          onLoadCV={() => updateState({ showLoadCVModal: true })}
          onShowJobMatch={() => updateState({ showJobMatchModal: true })}
          onPublishCV={() => {
            // Publish CV using draftId
            if (cvApi.draftId) {
              cvApi.publishCV(cvApi.draftId);
            } else {
              alert(
                "No draft available to publish. Please save a draft first."
              );
            }
          }}
          onCreateCV={async () => {
            try {
              // Create CV with current data
              const personalInfo = state.personalInfo;
              const sections = state.resumeData;
              const newCvId = await cvApi.createCV(personalInfo, sections);
              return newCvId;
            } catch (error) {
              console.error("Error creating CV:", error);
              alert("Failed to create CV. Please try again.");
              return null;
            }
          }}
          isSaving={cvApi.cvLoading}
          isLoading={cvApi.cvLoading}
          apiError={cvApi.cvError}
          cvId={cvApi.cvId}
          onClearError={() => {}} // No clearError method in useCVSimplified
          showSuccessMessage={false} // No success message in useCVSimplified
          successMessage={""}
          onClearSuccess={() => {}} // No clearSuccess method in useCVSimplified
          previewData={previewData}
          onPreviewClick={() => updateState({ showPreviewModal: true })}
          builderMode={state.builderMode}
          onToggleBuilderMode={() =>
            updateState({
              builderMode:
                state.builderMode === "content" ? "customize" : "content",
            })
          }
          sections={sections}
          enabledSections={state.enabledSections}
          activeSection={state.activeSection}
          onSectionChange={(sectionId) =>
            updateState({ activeSection: sectionId })
          }
          selectedTemplate={state.selectedTemplate}
          onTemplateConfigSave={(template) => {
            console.log("Template config saved:", template);
            updateState({ templateConfig: template });
          }}
          onUpdateSection={handleUpdateSection}
          onAddSection={() => {
            console.log("Add section clicked");
            updateState({ showAddSectionModal: true });
          }}
        >
          {/* Section Arrangement */}
          <SectionArrangement
            sections={state.resumeData}
            onReorder={handleSectionReorder}
            leftColumnSections={leftColumnSections}
            onLeftColumnChange={handleLeftColumnChange}
          />

          {/* Dynamic SectionContent - fully template-driven and customizable */}
          <MemoizedDynamicSectionContent
            activeSection={state.activeSection}
            templateConfig={state.templateConfig}
            onUpdateTemplateConfig={(updates) =>
              updateState({
                templateConfig: { ...state.templateConfig, ...updates },
              })
            }
            onRemoveSection={(sectionType) => {
              if (state.templateConfig) {
                const updatedTemplate = { ...state.templateConfig };
                updatedTemplate.columns.forEach((column: any) => {
                  column.sections = column.sections.filter(
                    (s: string) => s !== sectionType
                  );
                });
                updateState({ templateConfig: updatedTemplate });
              }
            }}
            onAddSection={() => updateState({ showAddSectionModal: true })}
            onShowAIConsent={() => setShowAIConsentModal(true)}
            personalInfo={state.personalInfo}
            professionalSummary={state.professionalSummary}
            experiences={state.experiences}
            educations={state.educations}
            skills={state.skills}
            languages={state.languages}
            certifications={state.certifications}
            awards={state.awards}
            projects={state.projects}
            interests={state.interests}
            customSections={state.customSections}
            onUpdatePersonalInfo={(updates) =>
              updateState({
                personalInfo: { ...state.personalInfo, ...updates },
              })
            }
            onUpdateProfessionalSummary={(updates) =>
              updateState({
                professionalSummary: {
                  ...state.professionalSummary,
                  ...updates,
                },
              })
            }
            onImageUpload={handleImageUpload}
            onRemoveImage={removeImage}
            onAddExperience={sectionManager.addExperience}
            onRemoveExperience={sectionManager.removeExperience}
            onUpdateExperience={sectionManager.updateExperience as any}
            onAddEducation={sectionManager.addEducation}
            onRemoveEducation={sectionManager.removeEducation}
            onUpdateEducation={sectionManager.updateEducation as any}
            onAddSkill={sectionManager.addSkill}
            onRemoveSkill={sectionManager.removeSkill}
            onUpdateSkill={sectionManager.updateSkill as any}
            onAddLanguage={sectionManager.addLanguage}
            onRemoveLanguage={sectionManager.removeLanguage}
            onUpdateLanguage={sectionManager.updateLanguage as any}
            onAddCertification={sectionManager.addCertification}
            onRemoveCertification={sectionManager.removeCertification}
            onUpdateCertification={sectionManager.updateCertification as any}
            onAddAward={sectionManager.addAward}
            onRemoveAward={sectionManager.removeAward}
            onUpdateAward={sectionManager.updateAward as any}
            onAddProject={sectionManager.addProject}
            onRemoveProject={sectionManager.removeProject}
            onUpdateProject={sectionManager.updateProject as any}
            onAddInterest={sectionManager.addInterest}
            onRemoveInterest={sectionManager.removeInterest}
            onUpdateInterest={sectionManager.updateInterest as any}
            onAddCustomSection={sectionManager.addCustomSection}
            onRemoveCustomSection={sectionManager.removeCustomSection}
            onUpdateCustomSection={sectionManager.updateCustomSection as any}
          />
        </BuilderLayout>

        {/* Modals */}

        <TemplateSelectorModal
          isOpen={state.showTemplateSelector}
          onClose={() => updateState({ showTemplateSelector: false })}
          onTemplateSelect={handleTemplateSelect}
        />

        <LoadCVModal
          isOpen={state.showLoadCVModal}
          onClose={() => updateState({ showLoadCVModal: false })}
          onLoad={cvApi.loadCV}
          isLoading={cvApi.cvLoading}
        />

        <CVUploadModal
          isOpen={state.showCVUpload}
          onClose={() => updateState({ showCVUpload: false })}
          onUploadSuccess={handleCVUploadSuccess}
        />

        <AddSectionModal
          isOpen={state.showAddSectionModal}
          onClose={() => updateState({ showAddSectionModal: false })}
          onAddSection={(sectionType) => {
            if (state.templateConfig) {
              const updatedTemplate = { ...state.templateConfig };
              if (updatedTemplate.columns.length > 0) {
                updatedTemplate.columns[0].sections.push(sectionType);
              }
              updateState({ templateConfig: updatedTemplate });
            }
          }}
          availableSections={
            state.templateConfig
              ? state.templateConfig.columns.flatMap(
                  (column: any) => column.sections
                )
              : []
          }
        />

        <SimplePreviewModal
          isOpen={state.showPreviewModal}
          onClose={() => updateState({ showPreviewModal: false })}
          previewData={previewData}
        />

        {/* Job Match Modal */}
        {state.showJobMatchModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[10px] max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Job Match Analysis</h2>
                  <button
                    onClick={() => updateState({ showJobMatchModal: false })}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <JobMatchScore
                  onScoreGenerated={(score, analysis) => {
                    console.log("Job match score:", score, analysis);
                    // You can add logic here to save the analysis or show it elsewhere
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Status Bar */}
        <StatusBar
          isSaving={autoSave.isSaving}
          lastSaved={autoSave.lastSaved}
          isValid={validation.isValid}
          errors={validation.errors}
          onSaveNow={autoSave.saveNow}
          onClearErrors={validation.clearErrors}
        />

        {/* Onboarding Tour */}
        <OnboardingTour
          isActive={tour.isActive}
          currentStep={tour.currentStep}
          totalSteps={CVBuilderTourSteps.length}
          currentStepData={tour.currentStepData}
          onNext={tour.next}
          onPrevious={tour.previous}
          onSkip={tour.skip}
          onComplete={tour.complete}
        />

        {/* Additional Feature Modals */}
        {state.showAnalytics && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-[10px] max-w-4xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Resume Analytics
                  </h2>
                  <button
                    onClick={() => updateState({ showAnalytics: false })}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <AnalyticsDashboard analytics={analytics} />
              </div>
            </div>
          </div>
        )}

        {state.showVersions && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-[10px] max-w-4xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Version Manager
                  </h2>
                  <button
                    onClick={() => updateState({ showVersions: false })}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <VersionManager
                  versions={versions.versions}
                  currentVersion={versions.currentVersion}
                  onCreateVersion={versions.createVersion}
                  onSwitchVersion={versions.switchToVersion}
                  onUpdateVersion={versions.updateVersion}
                  onDeleteVersion={versions.deleteVersion}
                  onDuplicateVersion={versions.duplicateVersion}
                  onPublishVersion={versions.publishVersion}
                  onUnpublishVersion={versions.unpublishVersion}
                />
              </div>
            </div>
          </div>
        )}

        {state.showSharing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-[10px] max-w-4xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Share Your Resume
                  </h2>
                  <button
                    onClick={() => updateState({ showSharing: false })}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <SharingPanel
                  shares={sharing.shares}
                  onCreateShare={sharing.createShare}
                  onUpdateShare={sharing.updateShare}
                  onDeleteShare={sharing.deleteShare}
                  onCopyUrl={async (url) => {
                    await navigator.clipboard.writeText(url);
                  }}
                  onShareToSocial={(platform, url) => {
                    // Implement social sharing
                    console.log(`Sharing to ${platform}:`, url);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {state.showJobBoards && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-[10px] max-w-6xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Job Board Integration
                  </h2>
                  <button
                    onClick={() => updateState({ showJobBoards: false })}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <JobBoardIntegration
                  jobBoards={jobBoardIntegration.jobBoards}
                  atsSystems={jobBoardIntegration.atsSystems}
                  applications={jobBoardIntegration.applications}
                  onSubmitToJobBoard={async (
                    jobBoardId,
                    jobId,
                    jobTitle,
                    company
                  ) => {
                    await jobBoardIntegration.submitToJobBoard(
                      jobBoardId,
                      jobId,
                      jobTitle,
                      company
                    );
                  }}
                  onCheckATSCompatibility={
                    jobBoardIntegration.checkATSCompatibility
                  }
                  onGetOptimizationSuggestions={
                    jobBoardIntegration.getOptimizationSuggestions
                  }
                  onValidateCV={jobBoardIntegration.validateCVForJobBoard}
                  onGetRecommendedJobBoards={
                    jobBoardIntegration.getRecommendedJobBoards
                  }
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Consent Modal */}
      <AIConsentModal
        isOpen={showAIConsentModal}
        onClose={() => setShowAIConsentModal(false)}
        onAccept={handleConsentAccept}
      />
    </ErrorBoundary>
  );
}
