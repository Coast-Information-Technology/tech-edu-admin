// app/dashboard/cv-builder/[template]/page.tsx

"use client";

import { useState, useMemo, use, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getTokenFromCookies } from "@/lib/cookies";

// Import shared components
import BuilderLayout from "@/components/cv/builder/BuilderLayout";
import TemplateRenderer from "@/components/cv/dynamic/TemplateRenderer";
import DynamicPdfRenderer from "@/components/cv/dynamic/DynamicPdfRenderer";
import SimplePreviewModal from "@/components/cv/builder/modals/SimplePreviewModal";
import AddSectionModal from "@/components/cv/builder/modals/AddSectionModal";
import TemplateSelectorModal from "@/components/cv/TemplateSelectorModal";
import AIConsentModal from "@/components/cv/builder/modals/AIConsentModal";
import { StatusBar } from "@/components/cv/builder/StatusBar";

// Import custom hooks
import { useTemplateBuilder } from "@/hooks/cv/useTemplateBuilder";
import { useCVSimplified } from "@/hooks/cv/useCVSimplified";
// import { useAIFeatures } from "@/hooks/useAIFeatures";

// Import utilities
import { templateManager } from "@/lib/cv/templates/templateManager";
import { pdf } from "@react-pdf/renderer";

// Initialize dynamic sections
import "@/lib/cv/sections/initializeSections";
import { cvService } from "@/services/cv/cvServiceOptimized";

// draft id helpers
const draftKey = (cv: string) => `cvDraftId:${cv}`;

const storeDraftId = (cv: string, draftId: string) => {
  try {
    sessionStorage.setItem(draftKey(cv), draftId);
  } catch {}
  try {
    localStorage.setItem("cvDraftId", draftId);
  } catch {}
};

const readDraftId = (cv: string | undefined | null) => {
  if (!cv) return null;
  try {
    return (
      sessionStorage.getItem(draftKey(cv)) || localStorage.getItem("cvDraftId")
    );
  } catch {
    return localStorage.getItem("cvDraftId");
  }
};

interface TemplateBuilderPageProps {
  params: Promise<{
    template: string;
  }>;
}

export default function TemplateBuilderPage({
  params,
}: TemplateBuilderPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { template: templateId } = use(params);

  // Get URL parameters
  const cvId = searchParams.get("cvId");
  const mode = searchParams.get("mode");
  const draftId = searchParams.get("draftId");
  const isNew = searchParams.get("new") === "1";
  const isViewMode = mode === "view";

  // Validate template exists
  const template = templateManager.getTemplate(templateId);
  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Template Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The template "{templateId}" does not exist.
          </p>
          <Link
            href="/dashboard/cv-builder/template-selection"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-[10px] hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Template Selection
          </Link>
        </div>
      </div>
    );
  }

  // State management
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [currentCvId, setCurrentCvId] = useState<string | undefined>(() => {
    // Initialize cvId from URL parameter or localStorage
    if (typeof window !== "undefined") {
      return cvId || localStorage.getItem("cvId") || undefined;
    }
    return cvId || undefined;
  });
  const [showAIConsentModal, setShowAIConsentModal] = useState(false); // Don't show immediately
  const [aiConsent, setAiConsent] = useState<{
    aiProcessing: boolean;
    aiTraining: boolean;
  } | null>(null);
  const [loadingExistingCV, setLoadingExistingCV] = useState(false);
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [loadedSections, setLoadedSections] = useState<any[] | null>(null);

  // Helper to reset builder state for brand new CV/Draft
  const resetBuilderState = () => {
    setCurrentCvId(undefined);
    setLoadedSections(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("cvId");
      localStorage.removeItem("cvDraftId");
    }
    templateBuilder.setPersonalInfo({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      website: "",
      targetedJobTitle: "",
      industry: "",
      image: "",
    });
    templateBuilder.setProfessionalSummary({
      id: "professional-summary",
      summary: "",
    });
    templateBuilder.setExperiences([]);
    templateBuilder.setEducations([]);
    templateBuilder.setSkills([]);
    templateBuilder.setLanguages([]);
    templateBuilder.setCertifications([]);
    templateBuilder.setAwards([]);
    templateBuilder.setProjects([]);
    templateBuilder.setInterests([]);
    templateBuilder.setCustomSections([]);
    templateBuilder.setCustomSectionHeadings({});
  };

  // Handle AI consent
  const handleAIConsent = async (consent: {
    aiProcessing: boolean;
    aiTraining: boolean;
  }) => {
    setAiConsent(consent);
    setShowAIConsentModal(false);

    // Update CV with consent if we have a cvId
    if (currentCvId) {
      try {
        console.log("🔄 Updating CV with AI consent:", consent);
        await cvOperations.updateCV(
          templateBuilder.personalInfo,
          templateBuilder.resumeData,
          consent
        );
        console.log("✅ CV updated with AI consent successfully");
      } catch (error) {
        console.error("❌ Failed to update CV with consent:", error);
        alert("Failed to save consent. Please try again.");
      }
    } else {
      console.log("⚠️ No cvId available to update consent");
    }

    console.log("AI consent received:", consent);
  };

  // Handle consent acceptance and CV creation
  const handleConsentAccept = async (consent: {
    aiProcessing: boolean;
    aiTraining: boolean;
  }) => {
    console.log("Consent accepted:", consent);
    handleAIConsent(consent);

    // Update CV with new consent if CV already exists
    if (cvId) {
      try {
        console.log("Updating CV with new consent:", consent);
        await cvOperations.handleUpdateCV(
          templateBuilder.personalInfo,
          templateBuilder.resumeData
        );
        console.log("CV updated with new consent");
      } catch (error) {
        console.error("Failed to update CV with consent:", error);
      }
    }
  };

  // Custom hooks
  const templateBuilder = useTemplateBuilder(templateId);
  const cvOperations = useCVSimplified();
  // const aiFeatures = useAIFeatures(cvId);

  // Set cvId in cvOperations when in view/edit mode
  useEffect(() => {
    if (cvId && (mode === "view" || mode === "edit")) {
      console.log("🔧 Setting cvId in cvOperations:", cvId);
      cvOperations.setCvId(cvId);
    }
  }, [cvId, mode, cvOperations]);

  // Generate preview data
  const previewData = useMemo(() => {
    const dataForPreview =
      templateBuilder.resumeData && templateBuilder.resumeData.length > 0
        ? templateBuilder.resumeData
        : loadedSections || [];
    return (
      <TemplateRenderer
        data={dataForPreview}
        templateId={templateId}
        mode="preview"
        templateConfig={templateBuilder.templateConfig}
        leftColumnSections={templateBuilder.leftColumnSections}
      />
    );
  }, [
    templateBuilder.resumeData,
    loadedSections,
    templateId,
    templateBuilder.templateConfig,
    templateBuilder.leftColumnSections,
  ]);

  // CV Management handlers
  const handleCreateCV = async (): Promise<string | null> => {
    console.log("handleCreateCV called with:");
    console.log("- personalInfo:", templateBuilder.personalInfo);
    console.log("- aiConsent:", aiConsent);

    const newCvId = await cvOperations.handleCreateCV(
      templateBuilder.personalInfo,
      templateBuilder.resumeData,
      aiConsent || undefined, // Pass consent data or undefined
      templateId // Pass template name
    );

    console.log("cvOperations.handleCreateCV returned:", newCvId);

    if (newCvId) {
      setCurrentCvId(newCvId);
      // Also save to localStorage for persistence
      try {
        localStorage.setItem("cvId", newCvId);
      } catch {}
      console.log("setCurrentCvId called with:", newCvId);
    }
    return newCvId;
  };

  const handleUpdateCV = async () => {
    await cvOperations.handleUpdateCV(
      templateBuilder.personalInfo,
      templateBuilder.resumeData
    );
  };

  const handleSaveDraft = async (providedCvId?: string, template?: string) => {
    const idToUse = providedCvId || currentCvId || cvId;
    if (!idToUse) throw new Error("CV must be created before saving draft");

    // Expect saveDraft to return a draftId
    const returnedDraftId = await cvOperations.saveDraft(
      templateBuilder.personalInfo,
      templateBuilder.resumeData,
      idToUse, // ensure server associates the draft with the CV
      template || templateId
    );

    // Fallback (if your saveDraft didn’t return an id)
    const effectiveDraftId =
      returnedDraftId ||
      (await cvService.getDraftIdForCv(idToUse).catch(() => null));

    if (effectiveDraftId) {
      storeDraftId(idToUse, effectiveDraftId);
    }

    setLastSaved(new Date());
    setShowSaveNotification(true);
    setTimeout(() => setShowSaveNotification(false), 2000);
  };

  // Wrapper for ResumeNav onSaveDraft (no parameters)
  const handleSaveDraftWrapper = async () => {
    console.log("🔧 handleSaveDraftWrapper called with cvId:", currentCvId);
    console.log("🔧 cvOperations.cvId:", cvOperations.cvId);
    console.log("🔧 cvOperations.draftId:", cvOperations.draftId);
    await handleSaveDraft();
  };

  const handlePublishDraft = async () => {
    try {
      // Use the current draftId from cvOperations
      const currentDraftId = cvOperations.draftId;
      if (!currentDraftId) {
        console.warn("⚠️ No draftId available for publishing");
        alert("No draft available to publish. Please save a draft first.");
        return;
      }

      await cvOperations.handlePublishDraft(
        templateBuilder.personalInfo,
        templateBuilder.resumeData,
        currentDraftId
      );
      // Show publish success notification
      setLastSaved(new Date());
      setShowSaveNotification(true);
      setTimeout(() => setShowSaveNotification(false), 2000); // Show longer for publish
    } catch (error) {
      console.error("❌ Error publishing CV:", error);
      // Could add error notification here
    }
  };

  // AI suggestion handler
  const handleAISuggestion = (sectionType: string, suggestion: any) => {
    console.log(`AI suggestion for ${sectionType}:`, suggestion);

    // Apply AI suggestions based on section type
    switch (sectionType) {
      case "professional-summary":
        if (suggestion.content) {
          templateBuilder.setProfessionalSummary((prev) => ({
            ...prev,
            summary: suggestion.content,
          }));
        }
        break;
      case "work-experience":
        if (suggestion.enhanced) {
          console.log("Enhanced work experience:", suggestion.enhanced);
        }
        break;
      case "skills":
        if (suggestion.skills) {
          console.log("Prioritized skills:", suggestion.skills);
        }
        break;
      default:
        console.log("AI suggestion received:", suggestion);
    }
  };

  // Export handlers
  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      // Create/update draft FIRST (and persist draft id)
      await handleSaveDraft(currentCvId, templateId);

      // Register fonts before PDF generation
      const { registerPDFFonts } = await import("@/utils/cv/fontUtils");
      registerPDFFonts();

      const blob = await pdf(
        <DynamicPdfRenderer
          data={templateBuilder.resumeData}
          templateId={templateId}
          templateConfig={templateBuilder.templateConfig}
          leftColumnSections={templateBuilder.leftColumnSections}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `resume-${templateBuilder.personalInfo.firstName}-${templateBuilder.personalInfo.lastName}.pdf`;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log("PDF exported successfully");
    } catch (error: any) {
      console.error("Export failed:", error);
      alert(`PDF export failed: ${error.message || error}`);
    } finally {
      setIsExporting(false);
    }
  };

  console.log(
    "CV Builder Page - cvId being passed to BuilderLayout:",
    currentCvId
  );

  // Load existing CV data when cvId is provided
  const loadExistingCV = async (cvIdToLoad: string) => {
    try {
      setLoadingExistingCV(true);
      const token = getTokenFromCookies();
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cv/${cvIdToLoad}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch CV: ${response.status}`);
      }

      const data = await response.json();
      const cv = data.data;

      console.log("📄 Loading existing CV data:", cv);

      // Extract personal info from sections
      const personalInfoSection = cv.sections.find(
        (s: any) => s.type === "personal-info"
      );
      const personalInfo = personalInfoSection?.data || {};

      // Extract other sections
      const resumeData = cv.sections.map((section: any) => ({
        id: section.id,
        type: section.type,
        heading: section.heading,
        visible: section.visible,
        data: section.data,
      }));

      // Update template builder with CV data
      templateBuilder.setPersonalInfo(personalInfo);
      templateBuilder.setTemplateConfig(
        templateManager.getTemplate(cv.template) || undefined
      );
      setLoadedSections(resumeData);

      // Update individual section data
      resumeData.forEach((section: any) => {
        switch (section.type) {
          case "professional-summary":
            templateBuilder.setProfessionalSummary(section.data);
            break;
          case "work-experience":
            templateBuilder.setExperiences(section.data || []);
            break;
          case "education":
            templateBuilder.setEducations(section.data || []);
            break;
          case "skills":
            templateBuilder.setSkills(section.data || []);
            break;
          case "languages":
            templateBuilder.setLanguages(section.data || []);
            break;
          case "certifications":
            templateBuilder.setCertifications(section.data || []);
            break;
          case "awards":
            templateBuilder.setAwards(section.data || []);
            break;
          case "projects":
            templateBuilder.setProjects(section.data || []);
            break;
          case "interests":
            templateBuilder.setInterests(section.data || []);
            break;
        }
      });

      // Set AI consent from CV data
      setAiConsent(cv.consent);
      console.log("✅ AI consent loaded from CV:", cv.consent);

      console.log("✅ CV data loaded into template builder:", {
        personalInfo: Object.keys(personalInfo),
        resumeDataCount: resumeData.length,
        template: cv.template,
        consent: cv.consent,
      });
    } catch (err) {
      console.error("Error loading existing CV:", err);
    } finally {
      setLoadingExistingCV(false);
    }
  };

  // Load existing Draft data when draftId is provided
  const loadExistingDraft = async (draftIdToLoad: string) => {
    try {
      setLoadingExistingCV(true);
      const token = getTokenFromCookies();
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cv/drafts/${draftIdToLoad}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch Draft: ${response.status}`);
      }

      const data = await response.json();
      const draft = data.data;

      console.log("📄 Loading existing Draft data:", draft);

      const sections = draft.working || [];
      const personalInfoSection = sections.find(
        (s: any) => s.type === "personal-info"
      );
      const personalInfo = personalInfoSection?.data || {};

      const resumeData = sections.map((section: any) => ({
        id: section.id,
        type: section.type,
        heading: section.heading,
        visible: section.visible,
        data: section.data,
      }));

      // Update template builder with Draft data
      templateBuilder.setPersonalInfo(personalInfo);
      templateBuilder.setTemplateConfig(
        templateManager.getTemplate(draft.template || templateId) || undefined
      );
      setLoadedSections(resumeData);

      resumeData.forEach((section: any) => {
        switch (section.type) {
          case "professional-summary":
            templateBuilder.setProfessionalSummary(section.data);
            break;
          case "work-experience":
            templateBuilder.setExperiences(section.data || []);
            break;
          case "education":
            templateBuilder.setEducations(section.data || []);
            break;
          case "skills":
            templateBuilder.setSkills(section.data || []);
            break;
          case "languages":
            templateBuilder.setLanguages(section.data || []);
            break;
          case "certifications":
            templateBuilder.setCertifications(section.data || []);
            break;
          case "awards":
            templateBuilder.setAwards(section.data || []);
            break;
          case "projects":
            templateBuilder.setProjects(section.data || []);
            break;
          case "interests":
            templateBuilder.setInterests(section.data || []);
            break;
        }
      });

      // ✅ Persist cvId/draftId for refresh
      if (draft.cvId && draft._id) {
        storeDraftId(draft.cvId, draft._id);
      }
      if (draft.cvId) {
        setCurrentCvId(draft.cvId);
        try {
          localStorage.setItem("cvId", draft.cvId);
        } catch {}
      }
      try {
        localStorage.setItem("cvDraftId", draft._id);
      } catch {}
    } catch (err) {
      console.error("Error loading existing Draft:", err);
    } finally {
      setLoadingExistingCV(false);
    }
  };

  // Persist ids from URL and hydrate from server (CV or Draft)
  useEffect(() => {
    (async () => {
      setLoadedSections(null);

      if (isNew) {
        resetBuilderState();
        return;
      }

      // If URL has explicit draftId or cvId, prefer those
      if (draftId) {
        try {
          localStorage.setItem("cvDraftId", draftId);
        } catch {}
        await loadExistingDraft(draftId);
        return;
      }

      if (cvId) {
        setCurrentCvId(cvId);
        try {
          localStorage.setItem("cvId", cvId);
        } catch {}

        // 1) Prefer a stored draft for THIS cv
        const stored = readDraftId(cvId);
        if (stored) {
          await loadExistingDraft(stored);
          return;
        }

        // 2) Ask server for latest draft for this cv
        const discovered = await cvService
          .getDraftIdForCv(cvId)
          .catch(() => null);
        if (discovered) {
          storeDraftId(cvId, discovered);
          await loadExistingDraft(discovered);
          return;
        }

        // 3) Fallback: published CV
        await loadExistingCV(cvId);
        return;
      }

      // No ids in URL — try storage
      const storedDraftId = localStorage.getItem("cvDraftId");
      const storedCvId = localStorage.getItem("cvId");

      if (storedDraftId) {
        await loadExistingDraft(storedDraftId);
        return;
      }
      if (storedCvId) {
        setCurrentCvId(storedCvId);
        await loadExistingCV(storedCvId);
        return;
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cvId, draftId, templateId, isNew]);

  // Monitor cvId changes
  useEffect(() => {
    console.log("cvId state changed to:", currentCvId);
  }, [currentCvId]);

  // Auto-save draft when CV exists and data changes
  useEffect(() => {
    if (currentCvId && !isViewMode) {
      const interval = setInterval(() => {
        // Only auto-save draft if we have personal info and not currently saving
        if (
          templateBuilder.personalInfo.firstName &&
          templateBuilder.personalInfo.lastName &&
          !cvOperations.isCreating &&
          !cvOperations.isUpdating
        ) {
          console.log("🤖 Auto-saving draft for cvId:", currentCvId);
          // ✅ route through handleSaveDraft so draftId is persisted
          void handleSaveDraft(currentCvId, templateId);
          // Show auto-save notification
          setLastSaved(new Date());
          setShowSaveNotification(true);
          setTimeout(() => setShowSaveNotification(false), 2000);
        } else {
          console.log(
            "⏭️ Auto-save skipped - personal info not ready or already saving"
          );
        }
      }, 20000); // Auto-save draft every 20 seconds

      return () => clearInterval(interval);
    }
  }, [
    currentCvId,
    templateBuilder.personalInfo,
    templateBuilder.resumeData,
    cvOperations.isCreating,
    cvOperations.isUpdating,
    isViewMode,
    templateId,
  ]);

  // Function to check existing consent from CV
  const checkExistingConsent = async (cvId: string) => {
    try {
      console.log("Checking existing consent for CV:", cvId);

      // First check if we already have consent loaded from the current CV
      if (aiConsent && cvId === currentCvId) {
        console.log("Using already loaded consent:", aiConsent);
        return aiConsent;
      }

      // Fallback to API call if consent not loaded yet
      const cvData = await cvOperations.handleLoadCV(cvId);
      if (cvData && cvData.consent) {
        console.log("Found existing consent via API:", cvData.consent);
        // Update the local consent state
        setAiConsent(cvData.consent);
        return cvData.consent;
      }
      return null;
    } catch (error) {
      console.error("Failed to check existing consent:", error);
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Main builder content */}
      <BuilderLayout
        onTogglePreview={() => {}}
        onExportPDF={handleExportPDF}
        onChangeTemplate={templateBuilder.handleTemplateChange}
        showPreview={true}
        isExporting={isExporting}
        mode={mode === "view" ? "view" : mode === "edit" ? "edit" : "create"}
        previewData={previewData}
        onPreviewClick={() => setShowPreviewModal(true)}
        builderMode={templateBuilder.builderMode}
        onToggleBuilderMode={() =>
          templateBuilder.setBuilderMode(
            templateBuilder.builderMode === "content" ? "customize" : "content"
          )
        }
        selectedTemplate={templateId}
        onTemplateConfigSave={templateBuilder.handleTemplateConfigSave}
        onAddSection={() => setShowAddSectionModal(true)}
        onRemoveSection={(sectionId) => {
          console.log("Remove section clicked:", sectionId);

          // Handle different section types
          switch (sectionId) {
            case "languages":
              templateBuilder.setLanguages([]);
              break;
            case "certifications":
              templateBuilder.setCertifications([]);
              break;
            case "awards":
              templateBuilder.setAwards([]);
              break;
            case "projects":
              templateBuilder.setProjects([]);
              break;
            case "interests":
              templateBuilder.setInterests([]);
              break;
            case "courses":
              templateBuilder.setCourses([]);
              break;
            case "organizations":
              templateBuilder.setOrganizations([]);
              break;
            case "publications":
              templateBuilder.setPublications([]);
              break;
            case "references":
              templateBuilder.setReferences([]);
              break;
            case "declarations":
              templateBuilder.setDeclarations([]);
              break;
            default:
              console.log("Cannot remove core section:", sectionId);
              break;
          }
        }}
        sections={templateBuilder.allSections}
        // Section data
        personalInfo={templateBuilder.personalInfo}
        professionalSummary={templateBuilder.professionalSummary}
        experiences={templateBuilder.experiences}
        educations={templateBuilder.educations}
        skills={templateBuilder.skills}
        languages={templateBuilder.languages}
        certifications={templateBuilder.certifications}
        awards={templateBuilder.awards}
        projects={templateBuilder.projects}
        interests={templateBuilder.interests}
        customSections={templateBuilder.customSections}
        // Section handlers
        onUpdatePersonalInfo={(updates) => {
          const newPersonalInfo = {
            ...templateBuilder.personalInfo,
            ...updates,
          };
          templateBuilder.setPersonalInfo(newPersonalInfo);
          // CV creation is handled by useEffect above
        }}
        onUpdateProfessionalSummary={(updates) =>
          templateBuilder.setProfessionalSummary({
            ...templateBuilder.professionalSummary,
            ...updates,
          })
        }
        onAddExperience={() => {
          const newExperience = {
            id: Date.now().toString(),
            company: "",
            position: "",
            startDate: "",
            endDate: "",
            current: false,
            description: "",
            location: "",
          };
          templateBuilder.setExperiences([
            ...templateBuilder.experiences,
            newExperience,
          ]);
        }}
        onRemoveExperience={(id) => {
          templateBuilder.setExperiences(
            templateBuilder.experiences.filter((exp) => exp.id !== id)
          );
        }}
        onUpdateExperience={(id, field, value) => {
          templateBuilder.setExperiences(
            templateBuilder.experiences.map((exp) =>
              exp.id === id ? { ...exp, [field]: value } : exp
            )
          );
        }}
        onAddEducation={() => {
          const newEducation = {
            id: Date.now().toString(),
            institution: "",
            degree: "",
            field: "",
            startDate: "",
            endDate: "",
            gpa: "",
            location: "",
            description: "",
          };
          templateBuilder.setEducations([
            ...templateBuilder.educations,
            newEducation,
          ]);
        }}
        onRemoveEducation={(id) => {
          templateBuilder.setEducations(
            templateBuilder.educations.filter((edu) => edu.id !== id)
          );
        }}
        onUpdateEducation={(id, field, value) => {
          templateBuilder.setEducations(
            templateBuilder.educations.map((edu) =>
              edu.id === id ? { ...edu, [field]: value } : edu
            )
          );
        }}
        onAddSkill={() => {
          const newSkill = {
            id: Date.now().toString(),
            name: "",
            level: "Intermediate" as const,
          };
          templateBuilder.setSkills([...templateBuilder.skills, newSkill]);
        }}
        onRemoveSkill={(id) => {
          templateBuilder.setSkills(
            templateBuilder.skills.filter((skill) => skill.id !== id)
          );
        }}
        onUpdateSkill={(id, field, value) => {
          templateBuilder.setSkills(
            templateBuilder.skills.map((skill) =>
              skill.id === id ? { ...skill, [field]: value } : skill
            )
          );
        }}
        onAddLanguage={() => {
          const newLanguage = {
            id: Date.now().toString(),
            name: "",
            level: "Conversational" as const,
          };
          templateBuilder.setLanguages([
            ...templateBuilder.languages,
            newLanguage,
          ]);
        }}
        onRemoveLanguage={(id) => {
          templateBuilder.setLanguages(
            templateBuilder.languages.filter((lang) => lang.id !== id)
          );
        }}
        onUpdateLanguage={(id, field, value) => {
          templateBuilder.setLanguages(
            templateBuilder.languages.map((lang) =>
              lang.id === id ? { ...lang, [field]: value } : lang
            )
          );
        }}
        onAddCertification={() => {
          const newCertification = {
            id: Date.now().toString(),
            name: "",
            issuer: "",
            date: "",
            credentialId: "",
            credentialUrl: "",
          };
          templateBuilder.setCertifications([
            ...templateBuilder.certifications,
            newCertification,
          ]);
        }}
        onRemoveCertification={(id) => {
          templateBuilder.setCertifications(
            templateBuilder.certifications.filter((cert) => cert.id !== id)
          );
        }}
        onUpdateCertification={(id, field, value) => {
          templateBuilder.setCertifications(
            templateBuilder.certifications.map((cert) =>
              cert.id === id ? { ...cert, [field]: value } : cert
            )
          );
        }}
        onAddAward={() => {
          const newAward = {
            id: Date.now().toString(),
            title: "",
            issuer: "",
            date: "",
            description: "",
          };
          templateBuilder.setAwards([...templateBuilder.awards, newAward]);
        }}
        onRemoveAward={(id) => {
          templateBuilder.setAwards(
            templateBuilder.awards.filter((award) => award.id !== id)
          );
        }}
        onUpdateAward={(id, field, value) => {
          templateBuilder.setAwards(
            templateBuilder.awards.map((award) =>
              award.id === id ? { ...award, [field]: value } : award
            )
          );
        }}
        onAddProject={() => {
          const newProject = {
            id: Date.now().toString(),
            name: "",
            description: "",
            technologies: [],
            url: "",
            startDate: "",
            endDate: "",
          };
          templateBuilder.setProjects([
            ...templateBuilder.projects,
            newProject,
          ]);
        }}
        onRemoveProject={(id) => {
          templateBuilder.setProjects(
            templateBuilder.projects.filter((project) => project.id !== id)
          );
        }}
        onUpdateProject={(id, field, value) => {
          templateBuilder.setProjects(
            templateBuilder.projects.map((project) =>
              project.id === id ? { ...project, [field]: value } : project
            )
          );
        }}
        onAddInterest={() => {
          const newInterest = {
            id: Date.now().toString(),
            name: "",
          };
          templateBuilder.setInterests([
            ...templateBuilder.interests,
            newInterest,
          ]);
        }}
        onRemoveInterest={(id) => {
          templateBuilder.setInterests(
            templateBuilder.interests.filter((interest) => interest.id !== id)
          );
        }}
        onUpdateInterest={(id, field, value) => {
          templateBuilder.setInterests(
            templateBuilder.interests.map((interest) =>
              interest.id === id ? { ...interest, [field]: value } : interest
            )
          );
        }}
        onImageUpload={(event: React.ChangeEvent<HTMLInputElement>) => {
          const file = event.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const result = e.target?.result as string;
              templateBuilder.setPersonalInfo({
                ...templateBuilder.personalInfo,
                image: result,
              });
            };
            reader.readAsDataURL(file);
          }
        }}
        onRemoveImage={() => {
          templateBuilder.setPersonalInfo({
            ...templateBuilder.personalInfo,
            image: "",
          });
        }}
        onShowAIConsent={() => {
          // Only show consent modal if AI processing consent is not already given
          if (!aiConsent?.aiProcessing) {
            setShowAIConsentModal(true);
          } else {
            console.log("AI processing consent already given:", aiConsent);
          }
        }}
        aiConsent={aiConsent}
        cvId={currentCvId}
        onCheckExistingConsent={checkExistingConsent}
        onUpdateSection={(sectionId, updates) => {
          // Update the custom section heading
          if (updates.heading) {
            templateBuilder.setCustomSectionHeadings({
              ...templateBuilder.customSectionHeadings,
              [sectionId]: updates.heading,
            });
          }
        }}
        // CV Management buttons - Only Save Draft and Publish CV
        onCreateCV={handleCreateCV}
        onUpdateCV={handleUpdateCV}
        onSaveDraft={handleSaveDraftWrapper}
        // onPublishDraft={handlePublishDraft}
        // onLoadCV={() => {}}
        onPublishCV={handlePublishDraft}
        isSaving={cvOperations.cvLoading}
        isLoading={cvOperations.cvLoading}
        isCreating={cvOperations.isCreating}
        loading={cvOperations.cvLoading}
        error={cvOperations.cvError}
      >
        {/* Status Bar */}
        <StatusBar
          isSaving={cvOperations.cvLoading}
          lastSaved={cvOperations.lastSaved}
          error={cvOperations.cvError}
          isCreating={cvOperations.isCreating}
          cvId={currentCvId}
        />
      </BuilderLayout>

      {/* Modals */}
      <SimplePreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        previewData={previewData}
      />

      <AddSectionModal
        isOpen={showAddSectionModal}
        onClose={() => setShowAddSectionModal(false)}
        onAddSection={(sectionType) => {
          // Add data to the appropriate array based on section type
          switch (sectionType) {
            case "work-experience":
              const newExperience = {
                id: Date.now().toString(),
                company: "",
                position: "",
                startDate: "",
                endDate: "",
                current: false,
                description: "",
                location: "",
              };
              templateBuilder.setExperiences([
                ...templateBuilder.experiences,
                newExperience,
              ]);
              break;
            case "education":
              const newEducation = {
                id: Date.now().toString(),
                institution: "",
                degree: "",
                field: "",
                startDate: "",
                endDate: "",
                gpa: "",
                location: "",
                description: "",
              };
              templateBuilder.setEducations([
                ...templateBuilder.educations,
                newEducation,
              ]);
              break;
            case "skills":
              const newSkill = {
                id: Date.now().toString(),
                name: "",
                level: "Intermediate" as const,
              };
              templateBuilder.setSkills([...templateBuilder.skills, newSkill]);
              break;
            case "languages":
              const newLanguage = {
                id: Date.now().toString(),
                name: "",
                level: "Conversational" as const,
              };
              templateBuilder.setLanguages([
                ...templateBuilder.languages,
                newLanguage,
              ]);
              break;
            case "certifications":
              const newCertification = {
                id: Date.now().toString(),
                name: "",
                issuer: "",
                date: "",
                credentialId: "",
                credentialUrl: "",
              };
              templateBuilder.setCertifications([
                ...templateBuilder.certifications,
                newCertification,
              ]);
              break;
            case "awards":
              const newAward = {
                id: Date.now().toString(),
                title: "",
                issuer: "",
                date: "",
                description: "",
              };
              templateBuilder.setAwards([...templateBuilder.awards, newAward]);
              break;
            case "projects":
              const newProject = {
                id: Date.now().toString(),
                name: "",
                description: "",
                technologies: [],
                url: "",
                startDate: "",
                endDate: "",
              };
              templateBuilder.setProjects([
                ...templateBuilder.projects,
                newProject,
              ]);
              break;
            case "interests":
              const newInterest = {
                id: Date.now().toString(),
                name: "",
              };
              templateBuilder.setInterests([
                ...templateBuilder.interests,
                newInterest,
              ]);
              break;
            case "professional-summary":
              // Professional summary is already handled by the data
              break;
            default:
              console.log("Unknown section type:", sectionType);
          }
          setShowAddSectionModal(false);
        }}
        availableSections={templateBuilder.allSections.map(
          (section) => section.type
        )}
      />

      <TemplateSelectorModal
        isOpen={templateBuilder.showTemplateSelector}
        onClose={() => templateBuilder.setShowTemplateSelector(false)}
        onTemplateSelect={(templateId) =>
          templateBuilder.handleTemplateSelect(templateId)
        }
      />

      <AIConsentModal
        isOpen={showAIConsentModal && !aiConsent?.aiProcessing}
        onClose={() => setShowAIConsentModal(false)}
        onAccept={handleConsentAccept}
      />

      {/* Save Notification */}
      {showSaveNotification && (
        <div className="fixed bottom-4 right-4 z-50 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-300 px-4 py-2 rounded-[10px] shadow-lg flex items-center space-x-2 animate-slide-in-right">
          <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-md font-medium">
            {lastSaved ? `Auto-saved` : "Saved"}
          </span>
        </div>
      )}
    </div>
  );
}
