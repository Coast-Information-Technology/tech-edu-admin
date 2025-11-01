"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Save, Eye, Download, Trash2 } from "lucide-react";
import Link from "next/link";
import { getTokenFromCookies } from "@/lib/cookies";

// Import builder components
import BuilderLayout from "@/components/cv/builder/BuilderLayout";
import TemplateRenderer from "@/components/cv/dynamic/TemplateRenderer";
import SimplePreviewModal from "@/components/cv/builder/modals/SimplePreviewModal";
import AddSectionModal from "@/components/cv/builder/modals/AddSectionModal";
import AIConsentModal from "@/components/cv/builder/modals/AIConsentModal";
import { StatusBar } from "@/components/cv/builder/StatusBar";

// Import hooks
import { useTemplateBuilder } from "@/hooks/cv/useTemplateBuilder";
import { useCVSimplified } from "@/hooks/cv/useCVSimplified";
import { templateManager } from "@/lib/cv/templates/templateManager";
import { cvService } from "@/services/cv/cvServiceOptimized";

interface CVSection {
  id: string;
  type: string;
  heading: string;
  visible: boolean;
  data: any;
}

interface CV {
  _id: string;
  userId: string;
  title: string;
  sections: CVSection[];
  template: string; // Changed from templateId to template
  theme: {
    primary: string;
    secondary: string;
    font: string;
    spacing: number;
  };
  privacy: {
    visibility: string;
    shareSlug: string | null;
    allowDownload: boolean;
  };
  consent: {
    aiProcessing: boolean;
    aiTraining: boolean;
  };
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface CVResponse {
  success: boolean;
  message: string;
  data: CV;
  meta: {
    requestId: string;
    timestamp: string;
    durationMs: number;
    path: string;
  };
}

export default function CVPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") || "edit";
  const isViewMode = mode === "view";

  const [cv, setCv] = useState<CV | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [draftSaving, setDraftSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showAddSection, setShowAddSection] = useState(false);
  const [showAIConsent, setShowAIConsent] = useState(false);
  const [aiConsent, setAiConsent] = useState<any>(null);
  const [draftId, setDraftId] = useState<string | null>(null);

  // Initialize template builder with default template first
  const templateBuilder = useTemplateBuilder("classic");

  // Load CV data
  useEffect(() => {
    if (params.id) {
      loadCV(params.id);
    }
  }, [params.id]);

  // Ensure a draft exists for this CV once it is loaded
  useEffect(() => {
    const ensureDraft = async () => {
      if (!cv) return;

      try {
        // If we already have a draftId in state, do nothing
        if (draftId) return;

        // Query server for existing draft for this CV
        const existing = await cvService.getDraftIdForCv(cv._id);
        if (existing) {
          setDraftId(existing);
          return;
        }

        // Create a draft for this CV if none exists yet
        const working = cv.sections.map((s) => ({
          id: s.id,
          type: s.type,
          heading: s.heading,
          visible: s.visible,
          data: s.data,
        }));

        const newDraftId = await cvService.createOrUpdateDraft({
          cvId: cv._id,
          working,
          isDirty: false,
          template: cv.template,
        });
        setDraftId(newDraftId);
        console.log("✅ Draft ready for CV:", newDraftId);
      } catch (e) {
        console.error("❌ Failed to ensure draft:", e);
      }
    };

    ensureDraft();
  }, [cv, draftId]);

  // Auto-save draft when CV exists and data changes
  useEffect(() => {
    if (cv && !isViewMode) {
      const interval = setInterval(() => {
        // Only auto-save if we have CV data loaded, a draftId, and not currently saving
        if (cv.sections && cv.sections.length > 0 && draftId && !draftSaving) {
          console.log("Auto-saving Draft:", draftId);
          handleSaveDraft();
        }
      }, 5000); // Auto-save every 5 seconds

      return () => clearInterval(interval);
    }
  }, [cv, isViewMode, draftId, draftSaving]);

  // Initialize template builder with CV data
  useEffect(() => {
    if (cv) {
      console.log("🔄 Loading CV data into template builder:", {
        cvId: cv._id,
        template: cv.template,
        sectionsCount: cv.sections?.length || 0,
      });

      // Extract personal info from sections
      const personalInfoSection = cv.sections.find(
        (s) => s.type === "personal-info"
      );
      const personalInfo = personalInfoSection?.data || {};

      // Extract other sections - preserve section IDs
      const resumeData = cv.sections.map((section) => ({
        id: section.id, // Preserve section ID from existing CV
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

      // Update individual section data
      resumeData.forEach((section) => {
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

      // Set AI consent
      setAiConsent(cv.consent);

      console.log("✅ CV data loaded into template builder:", {
        personalInfo: Object.keys(personalInfo),
        resumeDataCount: resumeData.length,
        template: cv.template,
      });
    }
  }, [cv, templateBuilder]);

  const loadCV = async (cvId: string) => {
    try {
      setLoading(true);
      const token = getTokenFromCookies();
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cv/${cvId}`,
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

      const data: CVResponse = await response.json();
      setCv(data.data);
    } catch (err) {
      console.error("Error loading CV:", err);
      setError(err instanceof Error ? err.message : "Failed to load CV");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCV = async () => {
    if (!cv) return;

    try {
      setSaving(true);
      const token = getTokenFromCookies();
      if (!token) {
        throw new Error("Authentication token not found");
      }

      // Get current data from template builder or use existing CV data
      const personalInfo =
        templateBuilder.personalInfo ||
        cv.sections.find((s) => s.type === "personal-info")?.data ||
        {};
      const resumeData =
        templateBuilder.resumeData ||
        cv.sections.map((s) => ({
          id: s.id, // Preserve section ID from existing CV
          type: s.type,
          heading: s.heading,
          visible: s.visible,
          data: s.data,
        }));

      // Transform data for API - preserve section IDs and use templateBuilder data for skills
      const sections = resumeData.map((section) => ({
        id: section.id, // Preserve section ID from existing CV
        type: section.type,
        heading: section.heading,
        visible: section.visible,
        data:
          section.type === "skills"
            ? templateBuilder.skills || section.data
            : section.data,
      }));

      const updateData = {
        title: cv.title,
        sections,
        theme: cv.theme,
        privacy: cv.privacy,
        consent: aiConsent || cv.consent,
        tags: cv.tags,
      };

      console.log("Updating CV with data:", updateData);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cv/${cv._id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update CV: ${response.status}`);
      }

      const updatedData: CVResponse = await response.json();
      setCv(updatedData.data);
      console.log("CV updated successfully:", updatedData.data._id);
    } catch (err) {
      console.error("Error saving CV:", err);
      setError(err instanceof Error ? err.message : "Failed to save CV");
    } finally {
      setSaving(false);
    }
  };

  // Save current builder state to Draft (create or update)
  const handleSaveDraft = async () => {
    if (!cv) return;
    if (!draftId) return; // ensureDraft effect will create one

    try {
      setDraftSaving(true);

      const working = (templateBuilder.resumeData ||
        cv.sections.map((s) => ({
          id: s.id,
          type: s.type,
          heading: s.heading,
          visible: s.visible,
          data: s.type === "skills" ? templateBuilder.skills || s.data : s.data,
        }))) as any[];

      const newDraftId = await cvService.createOrUpdateDraft({
        cvId: cv._id,
        working,
        isDirty: true,
        template: cv.template,
        draftId: draftId || undefined,
      });
      if (newDraftId && newDraftId !== draftId) setDraftId(newDraftId);
      console.log("✅ Draft saved:", newDraftId || draftId);
    } catch (e) {
      console.error("❌ Failed to save draft:", e);
    } finally {
      setDraftSaving(false);
    }
  };

  const handleDeleteCV = async () => {
    if (
      !cv ||
      !confirm(
        "Are you sure you want to delete this CV? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const token = getTokenFromCookies();
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cv/${cv._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete CV: ${response.status}`);
      }

      router.push("/dashboard/cvs");
    } catch (err) {
      console.error("Error deleting CV:", err);
      setError(err instanceof Error ? err.message : "Failed to delete CV");
    }
  };

  const handleExportPDF = async () => {
    if (!cv) return;

    try {
      // Save current state before export
      await handleSaveCV();

      // For now, just show a message - PDF export can be implemented later
      alert("PDF export functionality will be implemented soon!");
    } catch (err) {
      console.error("Error exporting PDF:", err);
      setError(err instanceof Error ? err.message : "Failed to export PDF");
    }
  };

  const handleConsentAccept = async (consent: any) => {
    setAiConsent(consent);
    setShowAIConsent(false);

    // Update CV with new consent
    if (cv) {
      try {
        const token = getTokenFromCookies();
        if (!token) return;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/cv/${cv._id}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              consent,
            }),
          }
        );

        if (response.ok) {
          const updatedData: CVResponse = await response.json();
          setCv(updatedData.data);
        }
      } catch (err) {
        console.error("Error updating consent:", err);
      }
    }
  };

  const handleCheckExistingConsent = async (cvId: string) => {
    if (cv && cv.consent) {
      return cv.consent;
    }
    return null;
  };

  const handleAddSection = (sectionType: string) => {
    // Add section logic here
    setShowAddSection(false);
  };

  const handleRemoveSection = (sectionType: string) => {
    // Remove section logic here
  };

  const handleUpdateSection = (sectionType: string, data: any) => {
    // Update section logic here
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading CV...</p>
        </div>
      </div>
    );
  }

  if (error || !cv) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">
          <p className="text-lg font-medium">Error loading CV</p>
          <p className="text-sm">{error || "CV not found"}</p>
        </div>
        <Link
          href="/dashboard/cvs"
          className="px-4 py-2 bg-blue-600 text-white rounded-[10px] hover:bg-blue-700"
        >
          Back to CVs
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/cvs"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to CVs</span>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{cv.title}</h1>
            <p className="text-gray-600">
              {isViewMode ? "View Mode" : "Edit Mode"} • Updated{" "}
              {new Date(cv.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {!isViewMode && (
            <>
              <button
                onClick={handleSaveDraft}
                disabled={draftSaving || !draftId}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-[10px] hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>{draftSaving ? "Saving Draft..." : "Save Draft"}</span>
              </button>
              <button
                onClick={async () => {
                  if (!draftId) return;
                  try {
                    const publishedCvId = await cvService.publishCV(draftId);
                    console.log("🚀 Published to CV:", publishedCvId);
                    await loadCV(publishedCvId);
                  } catch (e) {
                    console.error("❌ Failed to publish CV:", e);
                  }
                }}
                disabled={!draftId}
                className="px-4 py-2 bg-green-600 text-white rounded-[10px] hover:bg-green-700 disabled:opacity-50"
              >
                Publish
              </button>
              <button
                onClick={() => setShowAddSection(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-[10px] hover:bg-green-700"
              >
                Add Section
              </button>
            </>
          )}
          <button
            onClick={() => setShowPreview(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-[10px] hover:bg-gray-700"
          >
            <Eye className="h-4 w-4" />
            <span>Preview</span>
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-[10px] hover:bg-purple-700"
          >
            <Download className="h-4 w-4" />
            <span>Export PDF</span>
          </button>
          {!isViewMode && (
            <button
              onClick={handleDeleteCV}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-[10px] hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </button>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <StatusBar
        isSaving={saving}
        lastSaved={new Date(cv.updatedAt)}
        error={error}
        onClearErrors={() => setError(null)}
      />

      {/* Builder Layout */}
      <BuilderLayout
        onTogglePreview={() => setShowPreview(!showPreview)}
        onExportPDF={handleExportPDF}
        onChangeTemplate={() => {}}
        showPreview={showPreview}
        isExporting={false}
        isSaving={saving}
        isLoading={loading}
        error={error}
        onClearError={() => setError(null)}
        cvId={cv._id}
        builderMode="content"
        onToggleBuilderMode={() => {}}
        sections={cv.sections.map((s) => ({
          type: s.type,
          heading: s.heading,
          visible: s.visible,
          data: s.data,
        }))}
        enabledSections={cv.sections.map((s) => s.type)}
        activeSection={cv.sections[0]?.type || "personal-info"}
        onSectionChange={() => {}}
        selectedTemplate={cv.template}
        onTemplateConfigSave={() => {}}
        onAddSection={() => setShowAddSection(true)}
        onRemoveSection={handleRemoveSection}
        personalInfo={
          cv.sections.find((s) => s.type === "personal-info")?.data || {}
        }
        professionalSummary={
          cv.sections.find((s) => s.type === "professional-summary")?.data
        }
        experiences={
          cv.sections.find((s) => s.type === "work-experience")?.data || []
        }
        educations={cv.sections.find((s) => s.type === "education")?.data || []}
        skills={
          templateBuilder.skills ||
          cv.sections.find((s) => s.type === "skills")?.data ||
          []
        }
        languages={cv.sections.find((s) => s.type === "languages")?.data || []}
        certifications={
          cv.sections.find((s) => s.type === "certifications")?.data || []
        }
        awards={cv.sections.find((s) => s.type === "awards")?.data || []}
        projects={cv.sections.find((s) => s.type === "projects")?.data || []}
        interests={cv.sections.find((s) => s.type === "interests")?.data || []}
        customSections={cv.sections.filter((s) => s.type.startsWith("custom-"))}
        onUpdatePersonalInfo={() => {}}
        onUpdateProfessionalSummary={() => {}}
        onAddExperience={() => {}}
        onRemoveExperience={() => {}}
        onUpdateExperience={() => {}}
        onAddEducation={() => {}}
        onRemoveEducation={() => {}}
        onUpdateEducation={() => {}}
        onAddSkill={() => {
          const newSkill = {
            id: `skill-${Date.now()}`,
            name: "",
            level: "Beginner" as const,
          };
          templateBuilder.setSkills([...templateBuilder.skills, newSkill]);
        }}
        onRemoveSkill={(id: string) => {
          templateBuilder.setSkills(
            templateBuilder.skills.filter((s: any) => s.id !== id)
          );
        }}
        onUpdateSkill={(id: string, field: string, value: any) => {
          templateBuilder.setSkills(
            templateBuilder.skills.map((s: any) =>
              s.id === id ? { ...s, [field]: value } : s
            )
          );
        }}
        onAddLanguage={() => {}}
        onRemoveLanguage={() => {}}
        onUpdateLanguage={() => {}}
        onAddCertification={() => {}}
        onRemoveCertification={() => {}}
        onUpdateCertification={() => {}}
        onAddAward={() => {}}
        onRemoveAward={() => {}}
        onUpdateAward={() => {}}
        onAddProject={() => {}}
        onRemoveProject={() => {}}
        onUpdateProject={() => {}}
        onAddInterest={() => {}}
        onRemoveInterest={() => {}}
        onUpdateInterest={() => {}}
        onImageUpload={() => {}}
        onRemoveImage={() => {}}
        onShowAIConsent={() => setShowAIConsent(true)}
        aiConsent={aiConsent}
        onCheckExistingConsent={handleCheckExistingConsent}
        onUpdateSection={handleUpdateSection}
      >
        {/* Template Renderer */}
        <TemplateRenderer
          templateId={cv.template}
          data={
            templateBuilder.resumeData ||
            cv.sections.map((s) => ({
              id: s.id,
              type: s.type as any,
              heading: s.heading,
              visible: s.visible,
              data: s.data,
            }))
          }
          mode="preview"
        />
      </BuilderLayout>

      {/* Modals */}
      {showAddSection && (
        <AddSectionModal
          isOpen={showAddSection}
          onClose={() => setShowAddSection(false)}
          onAddSection={handleAddSection}
          availableSections={[]}
        />
      )}

      {showAIConsent && (
        <AIConsentModal
          isOpen={showAIConsent}
          onClose={() => setShowAIConsent(false)}
          onAccept={handleConsentAccept}
        />
      )}

      {showPreview && (
        <SimplePreviewModal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          previewData={{
            templateId: cv.template,
            personalInfo:
              templateBuilder.personalInfo ||
              cv.sections.find((s) => s.type === "personal-info")?.data ||
              {},
            resumeData:
              templateBuilder.resumeData ||
              cv.sections.map((s) => ({
                id: s.id,
                type: s.type as any,
                heading: s.heading,
                visible: s.visible,
                data:
                  s.type === "skills"
                    ? templateBuilder.skills || s.data
                    : s.data,
              })),
            theme: cv.theme,
          }}
        />
      )}
    </div>
  );
}
